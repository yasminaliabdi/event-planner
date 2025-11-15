from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel, TimestampMixin

if TYPE_CHECKING:
    from .booking import Booking
    from .event import Event
    from .university import UniversityProfile


class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    UNIVERSITY = "university"


class User(TimestampMixin, BaseModel):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(SqlEnum(Role), default=Role.USER, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    bookings: Mapped[list[Booking]] = relationship(
        "Booking",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    events_created: Mapped[list[Event]] = relationship(
        "Event",
        back_populates="organizer",
        cascade="all, delete-orphan",
        passive_deletes=True,
        foreign_keys="Event.organizer_id",
    )
    university_profile: Mapped[UniversityProfile | None] = relationship(
        "UniversityProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:  # pragma: no cover - for debugging
        return f"<User id={self.id} email={self.email!r} role={self.role}>"
