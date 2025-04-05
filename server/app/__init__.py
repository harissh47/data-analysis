from flask import Flask
from app.config import Config
from flask_cors import CORS
from app.extensions import db, migrate, jwt, bcrypt
from app.routes import register_blueprints

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        from app import models

    register_blueprints(app)

    return app
