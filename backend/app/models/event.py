from __future__ import annotations

from datetime import date, time
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Integer, Numeric, String, Text, Time
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel, TimestampMixin

if TYPE_CHECKING:
    from .booking import Booking
    from .university import UniversityProfile
    from .user import User


class EventStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CANCELLED = "cancelled"


class Event(TimestampMixin, BaseModel):
    __tablename__ = "events"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    time: Mapped[time] = mapped_column(Time, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[EventStatus] = mapped_column(
        SqlEnum(EventStatus),
        nullable=False,
        default=EventStatus.DRAFT,
    )
    organizer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    university_id: Mapped[int | None] = mapped_column(
        ForeignKey("university_profiles.id", ondelete="SET NULL"),
        nullable=True,
    )

    organizer: Mapped[User] = relationship(
        "User",
        back_populates="events_created",
        foreign_keys=[organizer_id],
    )
    university: Mapped[UniversityProfile | None] = relationship(
        "UniversityProfile",
        back_populates="events",
    )
    bookings: Mapped[list[Booking]] = relationship(
        "Booking",
        back_populates="event",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:  # pragma: no cover - debugging helper
        return f"<Event id={self.id} title={self.title!r} status={self.status}>"
