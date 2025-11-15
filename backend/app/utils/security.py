from __future__ import annotations

from datetime import datetime, timedelta
from secrets import choice
from string import digits

from passlib.hash import pbkdf2_sha256

OTP_LENGTH = 6
OTP_TTL_MINUTES = 10
OTP_CHAR_SET = digits


def hash_password(password: str) -> str:
    return pbkdf2_sha256.using(rounds=200000).hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pbkdf2_sha256.verify(password, hashed)


def generate_otp_code(length: int = OTP_LENGTH) -> str:
    return "".join(choice(OTP_CHAR_SET) for _ in range(length))


def otp_expiry(ttl_minutes: int = OTP_TTL_MINUTES) -> datetime:
    return datetime.utcnow() + timedelta(minutes=ttl_minutes)
