from __future__ import annotations

from .base import AutoSchema, BaseSchema
from .booking import BookingSchema, BookingStatusSchema, BookingWriteSchema
from .event import EventSchema, EventStatusSchema, EventWriteSchema
from .otp import OTPCodeSchema, OTPGenerateSchema, OTPVerifySchema
from .university import UniversityProfileSchema, UniversityProfileWriteSchema
from .user import (
    RoleSchema,
    UserDetailSchema,
    UserSchema,
    UserUpdateSchema,
    UserWriteSchema,
)

__all__ = [
    "BaseSchema",
    "AutoSchema",
    "UserSchema",
    "UserDetailSchema",
    "UserWriteSchema",
    "UserUpdateSchema",
    "RoleSchema",
    "UniversityProfileSchema",
    "UniversityProfileWriteSchema",
    "EventSchema",
    "EventStatusSchema",
    "EventWriteSchema",
    "BookingSchema",
    "BookingStatusSchema",
    "BookingWriteSchema",
    "OTPCodeSchema",
    "OTPGenerateSchema",
    "OTPVerifySchema",
]
