from __future__ import annotations

from app.models import Role
from tests.factories import create_user


def test_login_success(client):
    password = "Password123"
    create_user(email="active@example.com", password=password, role=Role.USER)

    response = client.post(
        "/api/auth/login",
        json={"email": "active@example.com", "password": password},
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert "accessToken" in payload
    assert payload["user"]["email"] == "active@example.com"


def test_login_requires_verification(client):
    password = "Password123"
    create_user(
        email="inactive@example.com",
        password=password,
        role=Role.USER,
        is_active=False,
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "inactive@example.com", "password": password},
    )

    assert response.status_code == 403
    payload = response.get_json()
    assert payload["message"] == "Account not verified. Please verify your email."

