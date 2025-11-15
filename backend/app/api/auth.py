from __future__ import annotations

from dataclasses import dataclass

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from marshmallow import Schema, ValidationError, fields, validate

from ..extensions import db
from ..models import Role, User
from ..schemas import (
    OTPVerifySchema,
    UserDetailSchema,
    UserSchema,
    UserUpdateSchema,
    UserWriteSchema,
)
from ..services.otp_service import OTPService
from ..utils.email import EmailService
from ..utils.security import hash_password, verify_password

auth_bp = Blueprint("auth", __name__)

user_schema = UserSchema()
user_detail_schema = UserDetailSchema()


class LoginSchema(Schema):
    email = fields.Email(required=True, validate=validate.Length(max=255))
    password = fields.String(required=True, validate=validate.Length(min=8, max=255))


class OTPResendSchema(Schema):
    email = fields.Email(required=True, validate=validate.Length(max=255))
    purpose = fields.String(missing="registration")


@dataclass
class AuthResponse:
    access_token: str
    user: dict

    def to_dict(self) -> dict:
        return {"accessToken": self.access_token, "user": self.user}


@auth_bp.post("/register")
def register_user():
    try:
        payload = request.get_json() or {}
        data = UserWriteSchema().load(payload)

        normalized_email = data["email"].lower()
        existing_user = User.query.filter_by(email=normalized_email).first()

        if existing_user and existing_user.is_active:
            return (
                jsonify({"message": "Account already exists. Please log in."}),
                409,
            )

        if not existing_user:
            user = User(
                name=data["name"],
                email=normalized_email,
                role=data.get("role", Role.USER),
                phone=data.get("phone"),
                password_hash=hash_password(data["password"]),
                is_active=False,
            )
            db.session.add(user)
            db.session.commit()
        else:
            user = existing_user
            user.name = data["name"]
            user.phone = data.get("phone")
            user.role = data.get("role", user.role)
            if data.get("password"):
                user.password_hash = hash_password(data["password"])
            db.session.commit()

        otp = OTPService.generate(email=user.email, purpose="registration")
        EmailService.send_otp(user.email, otp.code)

        return (
            jsonify(
                {
                    "message": "Registration initiated. Please verify the OTP sent to your email.",
                    "email": user.email,
                },
            ),
            201 if not existing_user else 200,
        )
    except ValidationError:
        # Let the global error handler deal with validation errors
        raise
    except Exception as e:
        db.session.rollback()
        from flask import current_app
        current_app.logger.exception("Registration error: %s", e)
        return (
            jsonify({"message": f"Registration failed: {str(e)}"}),
            500,
        )


@auth_bp.post("/verify")
def verify_otp():
    payload = request.get_json() or {}
    data = OTPVerifySchema().load(payload)
    normalized_email = data["email"].lower()

    user = User.query.filter_by(email=normalized_email).first()
    if not user:
        return jsonify({"message": "Account not found for the provided email."}), 404

    verified = OTPService.verify(
        email=normalized_email,
        code=data["code"],
        purpose=data.get("purpose") or "registration",
    )
    if not verified:
        return jsonify({"message": "Invalid or expired verification code."}), 400

    user.is_active = True
    db.session.commit()

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.value},
    )

    response = AuthResponse(access_token=access_token, user=user_detail_schema.dump(user))
    return jsonify(response.to_dict()), 200


@auth_bp.post("/resend-otp")
def resend_otp():
    payload = request.get_json() or {}
    data = OTPResendSchema().load(payload)

    normalized_email = data["email"].lower()
    user = User.query.filter_by(email=normalized_email).first()
    if not user:
        return jsonify({"message": "Account not found for the provided email."}), 404

    otp = OTPService.generate(email=normalized_email, purpose=data["purpose"])
    EmailService.send_otp(normalized_email, otp.code)

    return jsonify({"message": "A new verification code has been sent."}), 200


@auth_bp.post("/login")
def login():
    payload = request.get_json() or {}
    data = LoginSchema().load(payload)
    normalized_email = data["email"].lower()

    user = User.query.filter_by(email=normalized_email).first()
    if not user or not verify_password(data["password"], user.password_hash):
        return jsonify({"message": "Invalid email or password."}), 401

    if not user.is_active:
        return jsonify({"message": "Account not verified. Please verify your email."}), 403

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.value},
    )
    response = AuthResponse(access_token=access_token, user=user_schema.dump(user))
    return jsonify(response.to_dict()), 200


@auth_bp.get("/profile")
@jwt_required()
def profile():
    identity = get_jwt_identity()
    user = User.query.get_or_404(int(identity))
    return jsonify(user_detail_schema.dump(user)), 200


@auth_bp.patch("/profile")
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    payload = request.get_json() or {}
    data = UserUpdateSchema().load(payload)

    user = User.query.get_or_404(int(identity))
    if "name" in data:
        user.name = data["name"]
    if "phone" in data:
        user.phone = data["phone"]

    db.session.commit()
    return jsonify(user_detail_schema.dump(user)), 200


@auth_bp.get("/me/claims")
@jwt_required()
def token_claims():
    claims = get_jwt()
    return jsonify({"claims": claims}), 200


@auth_bp.get("/dev/otp/<email>")
def get_dev_otp(email: str):
    """Development-only endpoint to retrieve the latest OTP for an email."""
    from flask import current_app
    
    if not current_app.config.get("DEBUG", False):
        return jsonify({"message": "This endpoint is only available in development mode."}), 403
    
    normalized_email = email.lower()
    from ..models import OTPCode
    from datetime import datetime
    
    otp = (
        OTPCode.query.filter_by(email=normalized_email, is_used=False)
        .order_by(OTPCode.created_at.desc())
        .first()
    )
    
    if not otp:
        return jsonify({"message": "No active OTP found for this email."}), 404
    
    if otp.expires_at < datetime.utcnow():
        return jsonify({"message": "OTP has expired."}), 400
    
    return jsonify({
        "email": otp.email,
        "code": otp.code,
        "purpose": otp.purpose,
        "expires_at": otp.expires_at.isoformat(),
        "created_at": otp.created_at.isoformat(),
    }), 200
