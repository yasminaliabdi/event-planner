from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv
from flask import Flask

from .api.errors import register_error_handlers
from .config import get_config
from .extensions import cors, db, jwt, ma

# Load environment variables from .env file
load_dotenv()


def create_app(config_name: str | None = None) -> Flask:
    """Application factory for the Garissa Event Planner backend."""
    app = Flask(
        __name__,
        instance_relative_config=True,
    )
    # Disable strict slashes to prevent redirects on OPTIONS requests
    app.url_map.strict_slashes = False

    config_class = get_config(config_name)
    app.config.from_object(config_class)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)

    _register_extensions(app)
    _register_blueprints(app)
    _register_cli(app)
    register_error_handlers(app)

    return app


def _register_extensions(app: Flask) -> None:
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    if isinstance(cors_origins, str) and "," in cors_origins:
        cors_origins = [origin.strip() for origin in cors_origins.split(",")]
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": cors_origins,
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": False,
            }
        },
        supports_credentials=False,
        automatic_options=True,
    )
    db.init_app(app)
    # Import models so SQLAlchemy is aware of them before creating tables.
    from . import models  # noqa: F401

    ma.init_app(app)

    # Ensure services are imported so they can register hooks if needed.
    from . import services  # noqa: F401

    jwt.init_app(app)


def _register_blueprints(app: Flask) -> None:
    from .api import api_bp

    app.register_blueprint(api_bp)


def _register_cli(app: Flask) -> None:
    @app.cli.command("init-db")
    def init_db() -> None:  # pragma: no cover - CLI helper
        """Create database tables."""
        with app.app_context():
            db.create_all()
            print("Database tables created.")

    @app.cli.command("drop-db")
    def drop_db() -> None:  # pragma: no cover - CLI helper
        """Drop database tables."""
        with app.app_context():
            db.drop_all()
            print("Database tables dropped.")

    @app.cli.command("create-admin")
    def create_admin() -> None:  # pragma: no cover - CLI helper
        """Create initial admin user from environment variables."""
        import os
        from app.models import Role, User
        from app.utils.security import hash_password

        admin_email = os.environ.get("ADMIN_EMAIL", "admin@garissaeventplanner.com")
        admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123456")
        admin_name = os.environ.get("ADMIN_NAME", "System Administrator")

        with app.app_context():
            normalized_email = admin_email.lower()
            existing = User.query.filter_by(email=normalized_email).first()
            if existing:
                if existing.role == Role.ADMIN:
                    print(f"Admin user already exists: {normalized_email}")
                    return
                else:
                    # Update existing user to admin
                    existing.role = Role.ADMIN
                    existing.password_hash = hash_password(admin_password)
                    existing.is_active = True
                    db.session.commit()
                    print(f"Updated user to admin: {normalized_email}")
                    return

            admin = User(
                name=admin_name,
                email=normalized_email,
                role=Role.ADMIN,
                password_hash=hash_password(admin_password),
                is_active=True,
            )
            db.session.add(admin)
            db.session.commit()
            print(f"Admin user created: {normalized_email}")
            print(f"Password: {admin_password}")
