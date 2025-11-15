from __future__ import annotations

from app.models import EventStatus, Role
from tests.factories import create_event, create_user


def test_university_can_create_event(client, token_factory):
    university_user = create_user(
        email="uni@example.com",
        role=Role.UNIVERSITY,
    )
    token = token_factory(university_user)

    response = client.post(
        "/api/events/",
        json={
            "title": "Campus Expo",
            "description": "Annual expo",
            "location": "Campus Hall",
            "date": "2025-01-01",
            "time": "09:00:00",
            "capacity": 100,
            "price": "0.00",
            "status": "draft",
        },
        headers=token,
    )

    assert response.status_code == 201
    payload = response.get_json()
    assert payload["title"] == "Campus Expo"
    assert payload["organizer_id"] == university_user.id


def test_regular_user_cannot_create_event(client, token_factory):
    user = create_user(email="user@example.com", role=Role.USER)
    token = token_factory(user)

    response = client.post(
        "/api/events/",
        json={
            "title": "User Event",
            "description": "Should fail",
            "location": "Somewhere",
            "date": "2025-01-01",
            "time": "10:00:00",
            "capacity": 10,
            "price": "0.00",
        },
        headers=token,
    )

    assert response.status_code == 403
    payload = response.get_json()
    assert payload["message"] == "Only university or admin accounts can create events."


def test_event_list_is_paginated(client, token_factory):
    admin = create_user(email="admin@example.com", role=Role.ADMIN)
    uni = create_user(email="uni2@example.com", role=Role.UNIVERSITY)
    create_event(title="Event A", organizer=uni, status=EventStatus.PUBLISHED)
    create_event(title="Event B", organizer=uni, status=EventStatus.PUBLISHED)

    response = client.get("/api/events/")
    assert response.status_code == 200
    payload = response.get_json()
    assert "data" in payload and "meta" in payload
    assert payload["meta"]["total"] >= 2

