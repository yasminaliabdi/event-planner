from __future__ import annotations

from marshmallow import EXCLUDE

from ..extensions import db, ma


class BaseSchema(ma.SQLAlchemyAutoSchema):
    """Base schema with shared configuration."""

    class Meta:
        load_instance = True
        sqla_session = db.session
        include_relationships = True
        unknown = EXCLUDE


class AutoSchema(BaseSchema):
    """Backward-compatible alias providing shared config."""

    class Meta(BaseSchema.Meta):
        pass
