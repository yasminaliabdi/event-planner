from __future__ import annotations

from flask import Blueprint, jsonify

from .admin import admin_bp
from .auth import auth_bp
from .bookings import bookings_bp
from .events import events_bp

api_bp = Blueprint("api", __name__, url_prefix="/api")
api_bp.register_blueprint(auth_bp, url_prefix="/auth")
api_bp.register_blueprint(events_bp, url_prefix="/events")
api_bp.register_blueprint(bookings_bp, url_prefix="/bookings")
api_bp.register_blueprint(admin_bp, url_prefix="/admin")


@api_bp.route("/health", methods=["GET"])
def health_check():
    """Basic health check endpoint for uptime monitoring."""
    return jsonify(status="ok", service="Garissa Event Planner API"), 200
