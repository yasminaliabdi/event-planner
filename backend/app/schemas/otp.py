from __future__ import annotations

from datetime import datetime, timedelta

from marshmallow import Schema, ValidationError, fields, validates

from ..models import OTPCode
from .base import AutoSchema

DEFAULT_EXPIRY_MINUTES = 10


class OTPCodeSchema(AutoSchema):
    class Meta(AutoSchema.Meta):
        model = OTPCode
        dump_only = ("id", "created_at", "updated_at")


class OTPGenerateSchema(Schema):
    email = fields.Email(required=True)
    purpose = fields.String(required=True)


class OTPVerifySchema(Schema):
    email = fields.Email(required=True)
    code = fields.String(required=True, validate=lambda c: len(c) == 6 and c.isdigit())
    purpose = fields.String(required=True)

    @validates("code")
    def validate_code(self, value: str) -> None:
        if not value.isdigit():
            raise ValidationError("OTP code must be numeric.")


def default_expiry() -> datetime:
    return datetime.utcnow() + timedelta(minutes=DEFAULT_EXPIRY_MINUTES)
