from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.tenant_model import Tenant
from app.models.user_model import User

tenant_bp = Blueprint("tenant_bp", __name__)

@tenant_bp.route("/get/<int:tenant_id>", methods=["GET"])
@jwt_required()
def get_tenant_details(tenant_id):
    # Fetch the tenant record
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404

    # Fetch the associated user record
    user = tenant.user
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Return user and tenant details
    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at
        },
        "tenant": {
            "id": tenant.id,
            "apartment_id": tenant.apartment_id,
            "address": tenant.address,
            "city": tenant.city,
            "state": tenant.state,
            "zip_code": tenant.zip_code,
            "country": tenant.country,
            "tenant_type": tenant.tenant_type,
            "tenant_status": tenant.tenant_status,
            "tenant_start_date": tenant.tenant_start_date,
            "tenant_end_date": tenant.tenant_end_date,
            "family_members": tenant.family_members,
            "number_of_members": tenant.number_of_members
        }
    }), 200

@tenant_bp.route("/get-by-user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_tenant_details_by_user(user_id):
    # Fetch the tenant record using user_id
    tenant = Tenant.query.filter_by(user_id=user_id).first()
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404

    # Fetch the associated user record
    user = tenant.user
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Return user and tenant details
    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at
        },
        "tenant": {
            "id": tenant.id,
            "apartment_id": tenant.apartment_id,
            "address": tenant.address,
            "city": tenant.city,
            "state": tenant.state,
            "zip_code": tenant.zip_code,
            "country": tenant.country,
            "tenant_type": tenant.tenant_type,
            "tenant_status": tenant.tenant_status,
            "tenant_start_date": tenant.tenant_start_date,
            "tenant_end_date": tenant.tenant_end_date,
            "family_members": tenant.family_members,
            "number_of_members": tenant.number_of_members
        }
    }), 200

@tenant_bp.route("/register", methods=["POST"])
@jwt_required()
def register_tenant():
    data = request.json
    user_id = data.get("user_id")
    apartment_id = data.get("apartment_id")
    address = data.get("address")
    city = data.get("city")
    state = data.get("state")
    zip_code = data.get("zip_code")
    country = data.get("country")
    tenant_type = data.get("tenant_type")
    tenant_status = data.get("tenant_status")
    tenant_start_date = data.get("tenant_start_date")
    tenant_end_date = data.get("tenant_end_date")
    family_members = data.get("family_members")
    number_of_members = data.get("number_of_members")

    # Validate user_id
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Ensure the user has the role "tenant"
    if user.role != "tenant":
        return jsonify({"error": "User is not a tenant"}), 400

    # Create the tenant
    tenant = Tenant(
        user_id=user_id,
        apartment_id=apartment_id,
        address=address,
        city=city,
        state=state,
        zip_code=zip_code,
        country=country,
        tenant_type=tenant_type,
        tenant_status=tenant_status,
        tenant_start_date=tenant_start_date,
        tenant_end_date=tenant_end_date,
        family_members=family_members,
        number_of_members=number_of_members
    )
    db.session.add(tenant)
    db.session.commit()

    return jsonify({
        "message": "Tenant registered successfully",
        "tenant": {
            "id": tenant.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "apartment_id": tenant.apartment_id,
            "address": tenant.address,
            "city": tenant.city,
            "state": tenant.state,
            "zip_code": tenant.zip_code,
            "country": tenant.country,
            "tenant_type": tenant.tenant_type,
            "tenant_status": tenant.tenant_status,
            "tenant_start_date": tenant.tenant_start_date,
            "tenant_end_date": tenant.tenant_end_date,
            "family_members": tenant.family_members,
            "number_of_members": tenant.number_of_members
        }
    }), 201

@tenant_bp.route("/edit/<int:tenant_id>", methods=["PUT"])
@jwt_required()
def edit_tenant_details(tenant_id):
    data = request.json

    # Fetch the tenant record
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404

    # Update User details (if provided)
    user = tenant.user
    if "name" in data:
        user.name = data["name"]
    if "email" in data:
        # Check if the email is already in use by another user
        if User.query.filter(User.email == data["email"], User.id != user.id).first():
            return jsonify({"error": "Email already exists"}), 400
        user.email = data["email"]
    if "phone" in data:
        # Check if the phone is already in use by another user
        if User.query.filter(User.phone == data["phone"], User.id != user.id).first():
            return jsonify({"error": "Phone number already exists"}), 400
        user.phone = data["phone"]

    # Update Tenant details (if provided)
    if "address" in data:
        tenant.address = data["address"]
    if "city" in data:
        tenant.city = data["city"]
    if "state" in data:
        tenant.state = data["state"]
    if "zip_code" in data:
        tenant.zip_code = data["zip_code"]
    if "country" in data:
        tenant.country = data["country"]
    if "tenant_type" in data:
        tenant.tenant_type = data["tenant_type"]
    if "tenant_status" in data:
        tenant.tenant_status = data["tenant_status"]
    if "tenant_start_date" in data:
        tenant.tenant_start_date = data["tenant_start_date"]
    if "tenant_end_date" in data:
        tenant.tenant_end_date = data["tenant_end_date"]
    if "family_members" in data:
        tenant.family_members = data["family_members"]
    if "number_of_members" in data:
        tenant.number_of_members = data["number_of_members"]

    # Commit changes to the database
    db.session.commit()

    return jsonify({"message": "Tenant details updated successfully"}), 200