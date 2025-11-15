from __future__ import annotations

from sqlalchemy import func

from ..extensions import db
from ..models import Booking, BookingStatus, Event


def seats_reserved(event_id: int, exclude_booking_id: int | None = None) -> int:
    query = db.session.query(
        func.coalesce(func.sum(Booking.seats), 0),
    ).filter(
        Booking.event_id == event_id,
        Booking.status.in_([BookingStatus.PENDING, BookingStatus.APPROVED]),
    )
    if exclude_booking_id is not None:
        query = query.filter(Booking.id != exclude_booking_id)
    return int(query.scalar() or 0)


def seats_available(event: Event, exclude_booking_id: int | None = None) -> int:
    reserved = seats_reserved(event.id, exclude_booking_id=exclude_booking_id)
    return max(event.capacity - reserved, 0)
