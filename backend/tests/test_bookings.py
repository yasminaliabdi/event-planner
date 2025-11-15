from __future__ import annotations

from app.models import BookingStatus, EventStatus, Role
from tests.factories import create_booking, create_event, create_user


def test_user_can_book_and_university_can_approve(client, token_factory):
    university = create_user(email="uni-book@example.com", role=Role.UNIVERSITY)
    event = create_event(
        organizer=university,
        status=EventStatus.PUBLISHED,
        capacity=10,
    )

    attendee = create_user(email="attendee@example.com", role=Role.USER)
    user_token = token_factory(attendee)

    response = client.post(
        f"/api/events/{event.id}/book",
        json={"seats": 2},
        headers=user_token,
    )
    assert response.status_code == 201
    booking_payload = response.get_json()
    assert booking_payload["status"] == BookingStatus.PENDING.value

    booking_id = booking_payload["id"]
    uni_token = token_factory(university)

    response = client.put(
        f"/api/bookings/{booking_id}",
        json={"status": BookingStatus.APPROVED.value},
        headers=uni_token,
    )
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["status"] == BookingStatus.APPROVED.value


def test_booking_history_paginated(client, token_factory):
    university = create_user(email="uni-hist@example.com", role=Role.UNIVERSITY)
    event = create_event(organizer=university, status=EventStatus.PUBLISHED)
    attendee = create_user(email="hist@example.com", role=Role.USER)
    create_booking(event=event, user=attendee)

    token = token_factory(attendee)
    response = client.get("/api/bookings/me", headers=token)
    assert response.status_code == 200
    payload = response.get_json()
    assert "data" in payload and "meta" in payload
    assert payload["meta"]["total"] == 1

