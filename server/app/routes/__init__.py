from flask import Blueprint
from .auth_routes import auth_bp
from .service_routes import service_bp
from .staff_routes import staff_bp
from .apartment_routes import apartment_bp
from .tenant_routes import tenant_bp
from .user_routes import user_bp
from .notification_routes import notification_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')    
    app.register_blueprint(service_bp, url_prefix='/service')
    app.register_blueprint(staff_bp, url_prefix='/staff')
    app.register_blueprint(apartment_bp, url_prefix='/apartment')
    app.register_blueprint(tenant_bp, url_prefix='/tenant')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(notification_bp, url_prefix='/notification')