from __future__ import annotations

from marshmallow import Schema, fields, validate

from ..models import Booking, BookingStatus
from .base import AutoSchema
from .user import UserSchema


class BookingSchema(AutoSchema):
    status = fields.Enum(BookingStatus, by_value=True)
    user = fields.Nested(UserSchema, dump_only=True)

    class Meta(AutoSchema.Meta):
        model = Booking
        dump_only = ("id", "created_at", "updated_at")
        include_fk = True


class BookingWriteSchema(Schema):
    seats = fields.Integer(required=True, validate=validate.Range(min=1))
    status = fields.Enum(BookingStatus, by_value=True, missing=BookingStatus.PENDING)
    notes = fields.String(validate=validate.Length(max=255))


class BookingStatusSchema(Schema):
    status = fields.Enum(BookingStatus, by_value=True, required=True)
