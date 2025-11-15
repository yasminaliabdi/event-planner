from __future__ import annotations

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

cors = CORS()
db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
