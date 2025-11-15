from __future__ import annotations

from datetime import date, time

from app.models import Booking, BookingStatus, Event, EventStatus, Role, User
from app.utils.security import hash_password
from app.extensions import db


def create_user(
    *,
    name: str = "Test User",
    email: str,
    password: str = "Password123",
    role: Role = Role.USER,
    is_active: bool = True,
) -> User:
    user = User(
        name=name,
        email=email.lower(),
        password_hash=hash_password(password),
        role=role,
        is_active=is_active,
    )
    db.session.add(user)
    db.session.commit()
    return user


def create_event(
    *,
    title: str = "Sample Event",
    organizer: User,
    university_id: int | None = None,
    status: EventStatus = EventStatus.DRAFT,
    capacity: int = 50,
    price: float = 0.0,
    event_date: date | None = None,
    event_time: time | None = None,
) -> Event:
    event = Event(
        title=title,
        description="Description for event",
        location="Garissa",
        date=event_date or date.today(),
        time=event_time or time(hour=10, minute=0),
        capacity=capacity,
        price=price,
        image_url=None,
        status=status,
        organizer_id=organizer.id,
        university_id=university_id,
    )
    db.session.add(event)
    db.session.commit()
    return event


def create_booking(
    *,
    event: Event,
    user: User,
    seats: int = 1,
    status: BookingStatus = BookingStatus.PENDING,
) -> Booking:
    booking = Booking(
        event_id=event.id,
        user_id=user.id,
        seats=seats,
        status=status,
    )
    db.session.add(booking)
    db.session.commit()
    return booking

