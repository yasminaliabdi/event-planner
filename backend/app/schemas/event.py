from __future__ import annotations

from marshmallow import Schema, ValidationError, fields, validate, validates_schema

from ..models import Event, EventStatus
from .base import AutoSchema


class EventSchema(AutoSchema):
    status = fields.Enum(EventStatus, by_value=True)
    title = fields.String(required=True, validate=validate.Length(min=3, max=200))
    description = fields.String(required=True, validate=validate.Length(min=10))
    location = fields.String(required=True, validate=validate.Length(min=3, max=200))
    image_url = fields.URL(allow_none=True)
    price = fields.Decimal(required=True, as_string=True, places=2, allow_nan=False)
    capacity = fields.Integer(required=True, validate=validate.Range(min=1))

    class Meta(AutoSchema.Meta):
        model = Event
        dump_only = ("id", "created_at", "updated_at")
        include_fk = True


class EventWriteSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=3, max=200))
    description = fields.String(required=True, validate=validate.Length(min=10))
    location = fields.String(required=True, validate=validate.Length(min=3, max=200))
    date = fields.Date(required=True)
    time = fields.Time(required=True)
    capacity = fields.Integer(required=True, validate=validate.Range(min=1))
    price = fields.Decimal(required=True, as_string=True, places=2)
    image_url = fields.URL(allow_none=True)
    status = fields.Enum(EventStatus, by_value=True, missing=EventStatus.DRAFT)
    university_id = fields.Integer(allow_none=True)

    @validates_schema
    def validate_price_capacity(self, data: dict[str, object], **_: object) -> None:
        if "price" in data and data["price"] is not None:
            price = data["price"]
            if hasattr(price, "as_tuple") and price.as_tuple().exponent < -2:
                raise ValidationError("Price cannot have more than two decimal places.", "price")


class EventStatusSchema(Schema):
    status = fields.Enum(EventStatus, by_value=True, required=True)
