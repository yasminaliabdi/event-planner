from __future__ import annotations

from datetime import date

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy import asc, desc

from ..extensions import db
from ..models import Booking, BookingStatus, Event, EventStatus, Role, User
from ..schemas import (
    BookingSchema,
    BookingWriteSchema,
    EventSchema,
    EventStatusSchema,
    EventWriteSchema,
)
from ..services.booking_service import seats_available
from ..utils.pagination import (
    build_paginated_response,
    paginate_query,
    resolve_pagination_params,
)

events_bp = Blueprint("events", __name__)

event_schema = EventSchema()
events_schema = EventSchema(many=True)
event_write_schema = EventWriteSchema()
event_status_schema = EventStatusSchema()
booking_schema = BookingSchema()
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


@events_bp.get("/")
@jwt_required(optional=True)
def list_events():
    query = Event.query

    status = request.args.get("status")
    if status:
        try:
            query = query.filter(Event.status == EventStatus(status))
        except ValueError:
            return jsonify({"message": "Invalid status filter."}), 400

    organizer_id = request.args.get("organizer_id")
    if organizer_id:
        query = query.filter(Event.organizer_id == organizer_id)

    university_id = request.args.get("university_id")
    if university_id:
        query = query.filter(Event.university_id == university_id)

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if start_date:
        query = query.filter(Event.date >= date.fromisoformat(start_date))
    if end_date:
        query = query.filter(Event.date <= date.fromisoformat(end_date))

    order_by = request.args.get("order_by", "date")
    direction = request.args.get("direction", "asc")

    if order_by == "date":
        order_column = Event.date
    elif order_by == "created_at":
        order_column = Event.created_at
    else:
        order_column = Event.date

    if direction == "desc":
        query = query.order_by(desc(order_column))
    else:
        query = query.order_by(asc(order_column))

    page, page_size = resolve_pagination_params()
    events, total = paginate_query(query, page, page_size)

    payload = build_paginated_response(
        events_schema.dump(events),
        total,
        page,
        page_size,
    )
    return jsonify(payload), 200


@events_bp.get("/<int:event_id>")
@jwt_required(optional=True)
def get_event(event_id: int):
    event = Event.query.get_or_404(event_id)
    return jsonify(event_schema.dump(event)), 200


@events_bp.post("/")
@jwt_required()
def create_event():
    try:
        _require_role([Role.UNIVERSITY, Role.ADMIN])
    except PermissionError:
        return jsonify({"message": "Only university or admin accounts can create events."}), 403

    payload = request.get_json() or {}
    data = event_write_schema.load(payload)

    user = _current_user()

    event = Event(
        title=data["title"],
        description=data["description"],
        location=data["location"],
        date=data["date"],
        time=data["time"],
        capacity=data["capacity"],
        price=data["price"],
        image_url=data.get("image_url"),
        status=data.get("status", EventStatus.DRAFT),
        organizer_id=user.id,
        university_id=data.get("university_id"),
    )
    db.session.add(event)
    db.session.commit()

    return jsonify(event_schema.dump(event)), 201


@events_bp.put("/<int:event_id>")
@jwt_required()
def update_event(event_id: int):
    payload = request.get_json() or {}
    data = event_write_schema.load(payload, partial=True)

    event = Event.query.get_or_404(event_id)
    current_user = _current_user()

    if current_user.role not in (Role.ADMIN, Role.UNIVERSITY):
        return jsonify({"message": "You are not allowed to update events."}), 403

    if current_user.role == Role.UNIVERSITY and event.organizer_id != current_user.id:
        return jsonify({"message": "You can only update your own events."}), 403

    for key, value in data.items():
        setattr(event, key, value)

    db.session.commit()
    return jsonify(event_schema.dump(event)), 200


@events_bp.patch("/<int:event_id>/status")
@jwt_required()
def update_event_status(event_id: int):
    payload = request.get_json() or {}
    data = event_status_schema.load(payload)

    event = Event.query.get_or_404(event_id)
    current_user = _current_user()

    if current_user.role not in (Role.ADMIN, Role.UNIVERSITY):
        return jsonify({"message": "You are not allowed to update event status."}), 403

    if current_user.role == Role.UNIVERSITY and event.organizer_id != current_user.id:
        return jsonify({"message": "You can only update your own events."}), 403

    event.status = data["status"]
    db.session.commit()
    return jsonify(event_schema.dump(event)), 200


@events_bp.delete("/<int:event_id>")
@jwt_required()
def delete_event(event_id: int):
    event = Event.query.get_or_404(event_id)
    current_user = _current_user()

    if current_user.role not in (Role.ADMIN, Role.UNIVERSITY):
        return jsonify({"message": "You are not allowed to delete events."}), 403

    if current_user.role == Role.UNIVERSITY and event.organizer_id != current_user.id:
        return jsonify({"message": "You can only delete your own events."}), 403

    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted."}), 200


@events_bp.post("/<int:event_id>/book")
@jwt_required()
def book_event(event_id: int):
    try:
        _require_role([Role.USER])
    except PermissionError:
        return jsonify({"message": "Only user accounts can book events."}), 403

    payload = request.get_json() or {}
    data = booking_write_schema.load(payload)

    event = Event.query.get_or_404(event_id)

    if event.status != EventStatus.PUBLISHED:
        return jsonify({"message": "This event is not open for booking."}), 400

    user = _current_user()

    existing_booking = (
        Booking.query.filter(
            Booking.event_id == event.id,
            Booking.user_id == user.id,
            Booking.status.in_([BookingStatus.PENDING, BookingStatus.APPROVED]),
        )
        .order_by(Booking.created_at.desc())
        .first()
    )
    if existing_booking:
        return jsonify({"message": "You already have an active booking for this event."}), 409

    available = seats_available(event)
    if data["seats"] > available:
        return jsonify({"message": "Not enough seats available."}), 400

    booking = Booking(
        event_id=event.id,
        user_id=user.id,
        seats=data["seats"],
        status=BookingStatus.PENDING,
        notes=data.get("notes"),
    )
    db.session.add(booking)
    db.session.commit()

    return jsonify(booking_schema.dump(booking)), 201
