from __future__ import annotations

from typing import Any

from marshmallow import Schema, ValidationError, fields, validate, validates, validates_schema

from ..models import Role, User
from .base import AutoSchema

ROLE_FIELD = fields.Enum(Role, by_value=True, required=True)


class UserSchema(AutoSchema):
    role = ROLE_FIELD
    email = fields.Email(required=True, validate=validate.Length(max=255))
    name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    phone = fields.String(validate=validate.Length(min=7, max=30), allow_none=True)

    class Meta(AutoSchema.Meta):
        model = User
        dump_only = ("id", "created_at", "updated_at", "password_hash")
        load_only = ("password_hash",)
        include_fk = True


class UserDetailSchema(UserSchema):
    class Meta(UserSchema.Meta):
        include_relationships = True


class UserWriteSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True, validate=validate.Length(max=255))
    password = fields.String(required=True, validate=validate.Length(min=8, max=255))
    role = fields.Enum(Role, by_value=True, missing=Role.USER)
    phone = fields.String(validate=validate.Length(min=7, max=30), allow_none=True, missing=None)

    @validates_schema
    def normalize_phone(self, data: dict[str, Any], **_: Any) -> None:
        if "phone" in data and data["phone"] == "":
            data["phone"] = None

    @validates("password")
    def validate_password_strength(self, value: str) -> None:
        if value.isdigit() or value.isalpha():
            raise ValidationError("Password must include both letters and numbers.")
        if value.lower() == value or value.upper() == value:
            raise ValidationError("Password must include both uppercase and lowercase characters.")


class UserUpdateSchema(Schema):
    name = fields.String(validate=validate.Length(min=2, max=120))
    phone = fields.String(validate=validate.Length(min=7, max=30))
    role = fields.Enum(Role, by_value=True)
    is_active = fields.Boolean()

    @validates_schema
    def validate_presence(self, data: dict[str, Any], **_: Any) -> None:
        if not data:
            raise ValidationError("At least one field must be provided for update.")


class RoleSchema(Schema):
    role = ROLE_FIELD
