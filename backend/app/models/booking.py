from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Enum as SqlEnum
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel, TimestampMixin

if TYPE_CHECKING:
    from .event import Event
    from .user import User


class BookingStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class Booking(TimestampMixin, BaseModel):
    __tablename__ = "bookings"

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    seats: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    status: Mapped[BookingStatus] = mapped_column(
        SqlEnum(BookingStatus),
        nullable=False,
        default=BookingStatus.PENDING,
    )
    notes: Mapped[str | None] = mapped_column(String(255))

    event: Mapped[Event] = relationship("Event", back_populates="bookings")
    user: Mapped[User] = relationship("User", back_populates="bookings")

    def __repr__(self) -> str:  # pragma: no cover - debugging helper
        return (
            f"<Booking id={self.id} event_id={self.event_id} user_id={self.user_id} "
            f"status={self.status}>"
        )
