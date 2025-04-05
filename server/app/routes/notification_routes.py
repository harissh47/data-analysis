from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.notification_model import Notification
from app.models.service_models import Service, ServiceRequest
from app.models.staff_model import Staff, StaffAllocation
from app.models.tenant_model import Tenant
from app.models.user_model import User

notification_bp = Blueprint("notification_bp", __name__)

@notification_bp.route("/get", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    role = get_jwt()["role"]

    notifications = Notification.query.filter_by(user_id=user_id, role=role, is_read=0).all()
    return jsonify([
        {"id": n.id, "message": n.message, "created_at": n.created_at} for n in notifications
    ]), 200

@notification_bp.route("/mark-read", methods=["POST"])
@jwt_required()
def mark_notifications_as_read():
    data = request.json
    notification_ids = data.get("notification_ids")  # List of notification IDs

    Notification.query.filter(Notification.id.in_(notification_ids)).update({"is_read": 1}, synchronize_session=False)
    db.session.commit()

    return jsonify({"message": "Notifications marked as read"}), 200