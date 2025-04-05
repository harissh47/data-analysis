from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.service_models import Service, ServiceRequest
from app.models.staff_model import Staff, StaffAllocation
from app.models.tenant_model import Tenant

staff_bp = Blueprint("staff_bp", __name__)

@staff_bp.route("/available", methods=["GET"])
@jwt_required()
def get_available_staff():
    service_id = request.args.get("service_id")
    tenant_id = request.args.get("tenant_id")

    # Get the tenant's apartment ID
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404

    apartment_id = tenant.apartment_id
    print(f"Apartment ID: {apartment_id}")
    print(f"Service ID: {service_id}")
    # Validate service_id
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    # Fetch staff members who specialize in the service and belong to the tenant's apartment
    # Exclude staff members who are already allocated to active service requests
    allocated_staff_ids = db.session.query(StaffAllocation.staff_id).join(ServiceRequest).filter(
        ServiceRequest.status.in_(["Pending", "Approved"])
    ).subquery()

    available_staff = Staff.query.filter(
        Staff.apartment_id == apartment_id,
        Staff.specialization_id == service_id,  # Match by service ID
        ~Staff.id.in_(allocated_staff_ids)  # Exclude allocated staff
    ).all()

    if not available_staff:
        return jsonify({"error": "No available staff for the requested service"}), 404

    # Return the list of available staff
    return jsonify([
        {"id": staff.id, "name": staff.name, "phone": staff.phone, "specialization": staff.specialization.name}
        for staff in available_staff
    ]), 200

# Create a new staff member
@staff_bp.route("/create", methods=["POST"])
@jwt_required()
def create_staff():
    data = request.json
    name = data.get("name")
    phone = data.get("phone")
    apartment_id = data.get("apartment_id")
    specialization_id = data.get("specialization_id")  # Now references the Service ID

    # Validate specialization (service ID)
    service = Service.query.get(specialization_id)
    if not service:
        return jsonify({"error": "Invalid specialization. Service not found."}), 404

    # Check if phone number already exists
    if Staff.query.filter_by(phone=phone).first():
        return jsonify({"error": "Staff member with this phone number already exists"}), 400


    new_staff = Staff(name=name, phone=phone, apartment_id=apartment_id, specialization_id=specialization_id)
    db.session.add(new_staff)
    db.session.commit()

    return jsonify({"message": "Staff member created successfully"}), 201

# Read all staff members
@staff_bp.route("/list", methods=["GET"])
@jwt_required()
def list_staff():
    staff_members = Staff.query.all()
    return jsonify([
        {
            "id": staff.id,
            "name": staff.name,
            "phone": staff.phone,
            "apartment_id": staff.apartment_id,
            "specialization": staff.specialization.name  # Fetch specialization name
        }
        for staff in staff_members
    ]), 200

@staff_bp.route("/update/<int:staff_id>", methods=["PUT"])
@jwt_required()
def update_staff(staff_id):
    data = request.json
    staff = Staff.query.get(staff_id)
    if not staff:
        return jsonify({"error": "Staff member not found"}), 404

    specialization_id = data.get("specialization_id")
    if specialization_id:
        service = Service.query.get(specialization_id)
        if not service:
            return jsonify({"error": "Invalid specialization. Service not found."}), 404
        staff.specialization_id = specialization_id

    staff.name = data.get("name", staff.name)
    staff.phone = data.get("phone", staff.phone)
    staff.apartment_id = data.get("apartment_id", staff.apartment_id)
    db.session.commit()

    return jsonify({"message": "Staff member updated successfully"}), 200
# Delete a staff member
@staff_bp.route("/delete/<int:staff_id>", methods=["DELETE"])
@jwt_required()
def delete_staff(staff_id):
    staff = Staff.query.get(staff_id)
    if not staff:
        return jsonify({"error": "Staff member not found"}), 404

    db.session.delete(staff)
    db.session.commit()

    return jsonify({"message": "Staff member deleted successfully"}), 200