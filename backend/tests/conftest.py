from __future__ import annotations

import pytest
from flask import Flask
from flask.testing import FlaskClient
from sqlalchemy.orm import Session

from app import create_app
from app.extensions import db as database
from app.models import Role, User
from flask_jwt_extended import create_access_token


@pytest.fixture(scope="session")
def app() -> Flask:
    app = create_app("testing")
    with app.app_context():
        database.create_all()
    yield app
    with app.app_context():
        database.drop_all()


@pytest.fixture(scope="session")
def client(app: Flask) -> FlaskClient:
    return app.test_client()


@pytest.fixture(autouse=True)
def db_session(app: Flask):
    with app.app_context():
        yield database.session
        for table in reversed(database.metadata.sorted_tables):
            database.session.execute(table.delete())
        database.session.commit()


@pytest.fixture
def token_factory(app: Flask):
    def _make_token(user: User) -> dict[str, str]:
        with app.app_context():
            token = create_access_token(
                identity=str(user.id),
                additional_claims={"role": user.role.value},
            )
        return {"Authorization": f"Bearer {token}"}

    return _make_token

