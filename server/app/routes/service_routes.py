from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.notification_model import Notification
from app.models.service_models import Service, ServiceRequest
from app.models.staff_model import Staff, StaffAllocation
from app.models.tenant_model import Tenant
from app.models.user_model import User

service_bp = Blueprint("service_bp", __name__)

@service_bp.route("/request", methods=["POST"])
@jwt_required()
def request_service():
    data = request.json
    tenant_id = data.get("tenant_id")
    service_id = data.get("service_id")

    # Validate tenant_id
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404

    # Validate service_id
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    service_request = ServiceRequest(tenant_id=tenant_id, service_id=service_id)
    db.session.add(service_request)
    db.session.commit()

    admin_users = User.query.filter_by(role="admin").all()
    for admin in admin_users:
        notification = Notification(
            user_id=admin.id,
            role="admin",
            message=f"New service request submitted by Tenant ID {tenant_id}."
        )
        db.session.add(notification)
    db.session.commit()


    return jsonify({"message": "Service request submitted successfully"}), 201


@service_bp.route("/allocate", methods=["POST"])
@jwt_required()
def allocate_staff():
    data = request.json
    service_request_id = data.get("service_request_id")
    staff_id = data.get("staff_id")

    # Validate service request
    service_request = ServiceRequest.query.get(service_request_id)
    if not service_request:
        return jsonify({"error": "Service request not found"}), 404

    # Validate staff
    staff = Staff.query.get(staff_id)
    if not staff:
        return jsonify({"error": "Staff member not found"}), 404

    # Allocate staff to the service request
    allocation = StaffAllocation(service_request_id=service_request_id, staff_id=staff_id)
    db.session.add(allocation)

    # Update service request status
    service_request.status = "Approved"
    db.session.commit()

    # Create a notification for the tenant
    tenant_id = service_request.tenant.user.id
    notification = Notification(
        user_id=tenant_id,
        role="tenant",  # Explicitly set the role to "tenant"
        message="Your service request has been approved."
    )
    db.session.add(notification)
    db.session.commit()

    # Return success response with staff details
    return jsonify({
        "message": "Staff allocated successfully",
        "staff": {
            "id": staff.id,
            "name": staff.name,
            "phone": staff.phone,
            "apartment_id": staff.apartment_id,
            "specialization": staff.specialization.name  # Assuming specialization is linked to Service
        }
    }), 200


@service_bp.route("/complete", methods=["POST"])
@jwt_required()
def complete_service():
    data = request.json
    service_request_id = data.get("service_request_id")

    # Validate service request
    service_request = ServiceRequest.query.get(service_request_id)
    if not service_request:
        return jsonify({"error": "Service request not found"}), 404

    # Mark the service request as completed
    service_request.status = "Completed"

    # Deallocate staff
    StaffAllocation.query.filter_by(service_request_id=service_request_id).delete()
    db.session.commit()

    # Notify all admins
    admin_users = User.query.filter_by(role="admin").all()
    for admin in admin_users:
        notification = Notification(
            user_id=admin.id,
            role="admin",
            message=f"Service request ID {service_request_id} has been marked as completed."
        )
        db.session.add(notification)
    db.session.commit()

    return jsonify({"message": "Service marked as completed"}), 200


# Create a new service
@service_bp.route("/create", methods=["POST"])
@jwt_required()
def create_service():
    data = request.json
    name = data.get("name")
    description = data.get("description")

    if Service.query.filter_by(name=name).first():
        return jsonify({"error": "Service with this name already exists"}), 400

    new_service = Service(name=name, description=description)
    db.session.add(new_service)
    db.session.commit()

    return jsonify({"message": "Service created successfully"}), 201

# Read all services
@service_bp.route("/list", methods=["GET"])
@jwt_required()
def list_services():
    services = Service.query.all()
    return jsonify([
        {"id": service.id, "name": service.name, "description": service.description}
        for service in services
    ]), 200

# Update a service
@service_bp.route("/update/<int:service_id>", methods=["PUT"])
@jwt_required()
def update_service(service_id):
    data = request.json
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    service.name = data.get("name", service.name)
    service.description = data.get("description", service.description)
    db.session.commit()

    return jsonify({"message": "Service updated successfully"}), 200

# Delete a service
@service_bp.route("/delete/<int:service_id>", methods=["DELETE"])
@jwt_required()
def delete_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    db.session.delete(service)
    db.session.commit()

    return jsonify({"message": "Service deleted successfully"}), 200
