from __future__ import annotations

from .base import BaseModel, TimestampMixin
from .booking import Booking, BookingStatus
from .event import Event, EventStatus
from .otp import OTPCode
from .university import UniversityProfile
from .user import Role, User

__all__ = [
    "BaseModel",
    "TimestampMixin",
    "User",
    "Role",
    "UniversityProfile",
    "Event",
    "EventStatus",
    "Booking",
    "BookingStatus",
    "OTPCode",
]
