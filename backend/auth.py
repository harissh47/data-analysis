from flask import request, jsonify
from utils.helpers import is_valid_email, is_valid_phone
from werkzeug.security import generate_password_hash, check_password_hash
from user_model import User
from db import db

def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']
    usertype = data['usertype']
    
    existing_user = User.query.filter_by(
        username=username,
        password=password,
        usertype=usertype
    ).first()
    
    if existing_user:
        return jsonify({'message': 'User already exists'}), 200
    else:
        return jsonify({'message': 'User not registered'}), 400

def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    usertype = data['usertype']
    email = data['email']
    mobile = data['mobile']

    # Check if all fields are present
    if not all([username, password, usertype, email, mobile]):
        return jsonify({'error': 'All fields are required'}), 400

    # Validate email
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    # Validate phone number
    if not is_valid_phone(mobile):
        return jsonify({'error': 'Invalid phone number'}), 400

    try:
        if usertype == 'admin':
            admin_exists = User.query.filter_by(usertype='admin').first()
            if admin_exists:
                return jsonify({'message': 'Admin already exists'}), 400
            
        password_hash = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password_hash=password_hash,
            usertype=usertype
        )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({'error': str(e)}), 500
    
def checkadmin():
    
    data = request.get_json()
    usertype = data['usertype']
    usertype = usertype.lower()
    
    # Ensure this function is used only to verify admin existence
    if usertype == 'admin':
        admin_exists = User.query.filter_by(usertype='admin').first()
        if admin_exists:
            return jsonify({'message': 'Admin exists'}), 200
        else:
            return jsonify({'message': 'Admin does not exist'}), 400
    else:
        return jsonify({'message': 'Invalid usertype provided'}), 400
    
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()    

    if user and check_password_hash(user.password_hash, password):  # Secure password check
        return jsonify({'message': 'Login successful', 'usertype': user.usertype}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401






