from __future__ import annotations

from http import HTTPStatus

from flask import Blueprint, jsonify
from marshmallow import ValidationError
from werkzeug.exceptions import HTTPException

errors_bp = Blueprint("errors", __name__)


class ApiError(Exception):
    def __init__(self, message: str, status_code: int = HTTPStatus.BAD_REQUEST):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation_error(err: ValidationError):
        return (
            jsonify(
                {
                    "message": "Validation error",
                    "errors": err.messages,
                },
            ),
            HTTPStatus.UNPROCESSABLE_ENTITY,
        )

    @app.errorhandler(ApiError)
    def handle_api_error(err: ApiError):
        return jsonify({"message": err.message}), err.status_code

    @app.errorhandler(HTTPException)
    def handle_http_exception(err: HTTPException):
        return jsonify({"message": err.description}), err.code

    @app.errorhandler(Exception)
    def handle_generic_exception(err: Exception):
        app.logger.exception("Unhandled exception: %s", err)
        return (
            jsonify({"message": "An unexpected error occurred."}),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )
