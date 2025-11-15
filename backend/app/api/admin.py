from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required
from sqlalchemy import func

from ..extensions import db
from ..models import Booking, BookingStatus, Event, EventStatus, Role, UniversityProfile, User
from ..schemas import (
    EventSchema,
    EventStatusSchema,
    UniversityProfileSchema,
    UniversityProfileWriteSchema,
    UserDetailSchema,
    UserSchema,
    UserWriteSchema,
)
from ..utils.security import hash_password
from ..utils.pagination import (
    build_paginated_response,
    paginate_query,
    resolve_pagination_params,
)

admin_bp = Blueprint("admin", __name__)

user_schema = UserSchema(many=True)
user_detail_schema = UserDetailSchema()
university_schema = UniversityProfileSchema(many=True)
university_write_schema = UniversityProfileWriteSchema()
university_detail_schema = UniversityProfileSchema()
event_list_schema = EventSchema(many=True)
event_detail_schema = EventSchema()
event_status_schema = EventStatusSchema()
user_write_schema = UserWriteSchema()


def _require_admin() -> None:
    claims = get_jwt()
    role_value = claims.get("role")
    if role_value is None or Role(role_value) != Role.ADMIN:
        raise PermissionError("Administrator privileges required.")


@admin_bp.get("/users")
@jwt_required()
def list_users():
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    role_filter = request.args.get("role")
    query = User.query
    if role_filter:
        try:
            query = query.filter(User.role == Role(role_filter))
        except ValueError:
            return jsonify({"message": "Invalid role filter."}), 400

    query = query.order_by(User.created_at.desc())
    page, page_size = resolve_pagination_params()
    users, total = paginate_query(query, page, page_size)
    payload = build_paginated_response(user_schema.dump(users), total, page, page_size)
    return jsonify(payload), 200


@admin_bp.put("/users/<int:user_id>/ban")
@jwt_required()
def update_user_status(user_id: int):
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    user = User.query.get_or_404(user_id)
    action = request.args.get("action", "ban")
    if action == "ban":
        user.is_active = False
    elif action == "unban":
        user.is_active = True
    else:
        return jsonify({"message": "Invalid action. Use 'ban' or 'unban'."}), 400

    db.session.commit()
    return jsonify(user_detail_schema.dump(user)), 200


@admin_bp.delete("/users/<int:user_id>")
@jwt_required()
def delete_user(user_id: int):
    """Delete a user. Admin only. Cannot delete admin users."""
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    user = User.query.get_or_404(user_id)
    
    # Prevent deleting admin users
    if user.role == Role.ADMIN:
        return jsonify({"message": "Cannot delete administrator accounts."}), 400
    
    # Prevent deleting yourself
    from flask_jwt_extended import get_jwt_identity
    current_user_id = get_jwt_identity()
    if current_user_id and int(current_user_id) == user.id:
        return jsonify({"message": "Cannot delete your own account."}), 400
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully."}), 200


@admin_bp.get("/universities")
@jwt_required()
def list_universities():
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    query = UniversityProfile.query.order_by(UniversityProfile.created_at.desc())
    page, page_size = resolve_pagination_params()
    universities, total = paginate_query(query, page, page_size)
    payload = build_paginated_response(university_schema.dump(universities), total, page, page_size)
    return jsonify(payload), 200


@admin_bp.post("/universities")
@jwt_required()
def create_university():
    """Create a new university account. Admin only."""
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    payload = request.get_json() or {}
    
    try:
        # Validate user data
        user_data = user_write_schema.load({
            "name": payload.get("name"),
            "email": payload.get("email"),
            "password": payload.get("password"),
            "phone": payload.get("phone") or None,
            "role": Role.UNIVERSITY,
        })
    except Exception as e:
        from marshmallow import ValidationError
        if isinstance(e, ValidationError):
            return jsonify({"message": "Validation error", "errors": e.messages}), 422
        return jsonify({"message": "Invalid user data", "errors": str(e)}), 422
    
    try:
        # Validate university profile data
        university_data = university_write_schema.load({
            "name": payload.get("university_name") or payload.get("name"),
            "address": payload.get("address") or None,
            "contact": payload.get("contact") or None,
            "description": payload.get("description") or None,
            "logo_url": payload.get("logo_url") or None,
        })
    except Exception as e:
        from marshmallow import ValidationError
        if isinstance(e, ValidationError):
            return jsonify({"message": "Validation error", "errors": e.messages}), 422
        return jsonify({"message": "Invalid university data", "errors": str(e)}), 422

    normalized_email = user_data["email"].lower()
    existing_user = User.query.filter_by(email=normalized_email).first()
    if existing_user:
        return jsonify({"message": "A user with this email already exists."}), 409

    # Create user with university role
    user = User(
        name=user_data["name"],
        email=normalized_email,
        role=Role.UNIVERSITY,
        phone=user_data.get("phone"),
        password_hash=hash_password(user_data["password"]),
        is_active=True,  # Admin-created accounts are active immediately
    )
    db.session.add(user)
    db.session.flush()  # Get user.id

    # Create university profile
    university = UniversityProfile(
        user_id=user.id,
        name=university_data["name"],
        address=university_data.get("address"),
        contact=university_data.get("contact"),
        description=university_data.get("description"),
        logo_url=university_data.get("logo_url"),
    )
    db.session.add(university)
    db.session.commit()

    return jsonify(university_detail_schema.dump(university)), 201


@admin_bp.delete("/universities/<int:university_id>")
@jwt_required()
def delete_university(university_id: int):
    """Delete a university account. Admin only."""
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    university = UniversityProfile.query.get_or_404(university_id)
    user = university.user
    
    # Delete university profile (cascade will handle related data)
    db.session.delete(university)
    # Delete the associated user account
    if user:
        db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "University account deleted successfully."}), 200


@admin_bp.get("/events")
@jwt_required()
def list_events():
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    status = request.args.get("status")
    query = Event.query
    if status:
        try:
            query = query.filter(Event.status == EventStatus(status))
        except ValueError:
            return jsonify({"message": "Invalid status filter."}), 400

    query = query.order_by(Event.created_at.desc())
    page, page_size = resolve_pagination_params()
    events, total = paginate_query(query, page, page_size)
    payload = build_paginated_response(event_list_schema.dump(events), total, page, page_size)
    return jsonify(payload), 200


@admin_bp.patch("/events/<int:event_id>/status")
@jwt_required()
def admin_update_event_status(event_id: int):
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    payload = request.get_json() or {}
    data = event_status_schema.load(payload)

    event = Event.query.get_or_404(event_id)
    event.status = data["status"]
    db.session.commit()
    return jsonify(event_detail_schema.dump(event)), 200


@admin_bp.delete("/events/<int:event_id>")
@jwt_required()
def admin_delete_event(event_id: int):
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted."}), 200


@admin_bp.get("/stats")
@jwt_required()
def admin_stats():
    try:
        _require_admin()
    except PermissionError:
        return jsonify({"message": "Administrator access required."}), 403

    total_users = db.session.query(func.count(User.id)).scalar() or 0
    total_universities = db.session.query(func.count(UniversityProfile.id)).scalar() or 0
    total_events = db.session.query(func.count(Event.id)).scalar() or 0
    published_events = (
        db.session.query(func.count(Event.id))
        .filter(Event.status == EventStatus.PUBLISHED)
        .scalar()
        or 0
    )
    total_bookings = db.session.query(func.count(Booking.id)).scalar() or 0
    approved_bookings = (
        db.session.query(func.count(Booking.id))
        .filter(Booking.status == BookingStatus.APPROVED)
        .scalar()
        or 0
    )

    return (
        jsonify(
            {
                "users": total_users,
                "universities": total_universities,
                "events": total_events,
                "publishedEvents": published_events,
                "bookings": total_bookings,
                "approvedBookings": approved_bookings,
            },
        ),
        200,
    )
