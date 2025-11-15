from __future__ import annotations

from marshmallow import Schema, fields, validate

from ..models import UniversityProfile
from .base import AutoSchema


class UniversityProfileSchema(AutoSchema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=200))
    address = fields.String(validate=validate.Length(max=255), allow_none=True)
    contact = fields.String(validate=validate.Length(max=255), allow_none=True)
    description = fields.String(allow_none=True)
    logo_url = fields.URL(allow_none=True)

    class Meta(AutoSchema.Meta):
        model = UniversityProfile
        dump_only = ("id", "created_at", "updated_at")
        include_fk = True


class UniversityProfileWriteSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=200))
    address = fields.String(validate=validate.Length(max=255), allow_none=True, missing=None)
    contact = fields.String(validate=validate.Length(max=255), allow_none=True, missing=None)
    description = fields.String(allow_none=True, missing=None)
    logo_url = fields.URL(allow_none=True, missing=None)
