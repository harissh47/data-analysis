from flask import Blueprint, request, jsonify
from .. import db
from app.models.user_model import User
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import bcrypt

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    role = data.get("role")
    password = data.get("password")

    # Validate role
    if role not in ["admin", "tenant"]:
        return jsonify({"error": "Invalid role. Allowed values are 'admin' or 'tenant'"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(name=name, email=email, phone=phone, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate an access token
    access_token = create_access_token(
    identity=str(user.id),
    additional_claims={"role": user.role},)

    return jsonify({"token": access_token, "user_id": user.id}), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Requires a valid refresh token
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200