from __future__ import annotations

from datetime import datetime

from sqlalchemy import and_

from ..extensions import db
from ..models import OTPCode
from ..schemas import OTPGenerateSchema, OTPVerifySchema
from ..utils.security import generate_otp_code, otp_expiry


class OTPService:
    purpose = "registration"

    @classmethod
    def generate(cls, email: str, purpose: str | None = None) -> OTPCode:
        purpose = purpose or cls.purpose
        data = OTPGenerateSchema().load({"email": email, "purpose": purpose})
        code = generate_otp_code()
        otp = OTPCode(
            email=data["email"],
            purpose=data["purpose"],
            code=code,
            expires_at=otp_expiry(),
        )
        db.session.add(otp)
        db.session.commit()
        return otp

    @classmethod
    def verify(cls, email: str, code: str, purpose: str | None = None) -> bool:
        purpose = purpose or cls.purpose
        data = OTPVerifySchema().load(
            {"email": email, "code": code, "purpose": purpose},
        )
        otp = (
            OTPCode.query.filter(
                and_(
                    OTPCode.email == data["email"],
                    OTPCode.code == data["code"],
                    OTPCode.purpose == data["purpose"],
                    OTPCode.is_used.is_(False),  # noqa: E131
                ),
            )
            .order_by(OTPCode.created_at.desc())
            .first()
        )
        if not otp:
            return False
        if otp.expires_at < datetime.utcnow():
            return False

        otp.mark_used()
        db.session.commit()
        return True
