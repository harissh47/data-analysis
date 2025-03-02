from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
import os
from db import db
from user_model import Tenant

def tenant_details():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")
    city = data.get("city")
    state = data.get("state")
    zip_code = data.get("zip")
    country = data.get("country")
    tenant_type = data.get("tenant_type")
    tenant_status = data.get("tenant_status")
    tenant_start_date = data.get("tenant_start_date")
    tenant_end_date = data.get("tenant_end_date")
    family_members = data.get("family_members")
    number_of_members = data.get("number_of_members")

    try:
        db.session.add(Tenant(name=name, email=email, phone=phone, address=address,
                              city=city, state=state, zip=zip_code, country=country,
                              tenant_type=tenant_type, tenant_status=tenant_status,
                              tenant_start_date=tenant_start_date, tenant_end_date=tenant_end_date,
                              family_members=family_members, number_of_members=number_of_members))
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
