from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy import desc

from ..extensions import db
from ..models import Booking, BookingStatus, Event, Role, User
from ..schemas import BookingSchema, BookingStatusSchema, BookingWriteSchema
from ..services.booking_service import seats_available
from ..utils.pagination import (
    build_paginated_response,
    paginate_query,
    resolve_pagination_params,
)

bookings_bp = Blueprint("bookings", __name__)

booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)
booking_status_schema = BookingStatusSchema()
booking_write_schema = BookingWriteSchema()


def _current_user() -> User:
    identity = get_jwt_identity()
    if identity is None:
        raise PermissionError("Authentication required.")
    return User.query.get_or_404(int(identity))


def _require_role(roles: list[Role]) -> None:
    claims = get_jwt()
    role_value = claims.get("role")
    if role_value is None or Role(role_value) not in roles:
        raise PermissionError("Insufficient permissions.")


@bookings_bp.get("/me")
@jwt_required()
def my_bookings():
    user = _current_user()
    query = Booking.query.filter(Booking.user_id == user.id).order_by(desc(Booking.created_at))
    page, page_size = resolve_pagination_params()
    bookings, total = paginate_query(query, page, page_size)
    payload = build_paginated_response(
        bookings_schema.dump(bookings),
        total,
        page,
        page_size,
    )
    return jsonify(payload), 200


@bookings_bp.get("/event/<int:event_id>")
@jwt_required()
def event_bookings(event_id: int):
    user = _current_user()
    event = Event.query.get_or_404(event_id)

    if user.role == Role.UNIVERSITY and event.organizer_id != user.id:
        return jsonify({"message": "You are not authorized to view bookings for this event."}), 403
    if user.role not in (Role.UNIVERSITY, Role.ADMIN):
        return (
            jsonify({"message": "Only university or admin accounts may view event bookings."}),
            403,
        )

    query = Booking.query.filter(Booking.event_id == event.id).order_by(desc(Booking.created_at))
    page, page_size = resolve_pagination_params()
    bookings, total = paginate_query(query, page, page_size)
    payload = build_paginated_response(
        bookings_schema.dump(bookings),
        total,
        page,
        page_size,
    )
    return jsonify(payload), 200


@bookings_bp.put("/<int:booking_id>")
@jwt_required()
def update_booking_status(booking_id: int):
    payload = request.get_json() or {}
    data = booking_status_schema.load(payload)

    booking = Booking.query.get_or_404(booking_id)
    event = booking.event
    user = _current_user()

    if user.role == Role.UNIVERSITY and event.organizer_id != user.id:
        return jsonify({"message": "You are not authorized to manage this booking."}), 403
    if user.role not in (Role.UNIVERSITY, Role.ADMIN):
        return jsonify({"message": "Only university or admin accounts may manage bookings."}), 403

    if data["status"] == BookingStatus.APPROVED:
        available = seats_available(event, exclude_booking_id=booking.id)
        if booking.seats > available:
            return jsonify({"message": "Not enough seats available to approve this booking."}), 400

    booking.status = data["status"]
    db.session.commit()

    return jsonify(booking_schema.dump(booking)), 200


@bookings_bp.delete("/<int:booking_id>")
@jwt_required()
def cancel_booking(booking_id: int):
    booking = Booking.query.get_or_404(booking_id)
    user = _current_user()
    claims = get_jwt()
    role_value = claims.get("role")
    role = Role(role_value) if role_value else None

    is_owner = booking.user_id == user.id
    is_admin = role == Role.ADMIN
    is_university_owner = role == Role.UNIVERSITY and booking.event.organizer_id == user.id

    if not (is_owner or is_admin or is_university_owner):
        return jsonify({"message": "You are not authorized to cancel this booking."}), 403

    booking.status = BookingStatus.CANCELLED
    db.session.commit()

    return jsonify({"message": "Booking cancelled."}), 200
