from __future__ import annotations

from app.models import BookingStatus, EventStatus, Role
from tests.factories import create_booking, create_event, create_user


def test_admin_stats_and_users_list(client, token_factory):
    admin = create_user(email="admin-stats@example.com", role=Role.ADMIN)
    university = create_user(email="admin-uni@example.com", role=Role.UNIVERSITY)
    user = create_user(email="admin-user@example.com", role=Role.USER)

    event = create_event(organizer=university, status=EventStatus.PUBLISHED)
    create_booking(event=event, user=user, status=BookingStatus.APPROVED)

    headers = token_factory(admin)

    stats_response = client.get("/api/admin/stats", headers=headers)
    assert stats_response.status_code == 200
    stats = stats_response.get_json()
    for key in [
        "users",
        "universities",
        "events",
        "publishedEvents",
        "bookings",
        "approvedBookings",
    ]:
        assert key in stats

    users_response = client.get("/api/admin/users", headers=headers)
    assert users_response.status_code == 200
    users_payload = users_response.get_json()
    assert "data" in users_payload and "meta" in users_payload
    assert users_payload["meta"]["total"] >= 3

