# from dotenv import load_dotenv
# from db import collection
# from flask import request,jsonify
# load_dotenv()

# def signup():    
#     data=request.get_json()
#     username=data['username']
#     password=data['password']
#     usertype=data['usertype']
#     if collection.find_one({'username':username,'password':password,'usertype':usertype}):
#         return jsonify({'message':'User already exists'}),200
#     else:
#         return jsonify({'message':'User not registered'}),400    

# def checkadmin():
#     data = request.get_json()
#     usertype = data['usertype']
#     # Ensure checkadmin is used only to verify admin existence.
#     if usertype == 'admin' and collection.find_one({'usertype': 'admin'}):
#        return jsonify({'message': 'admin is existing'}), 200
#     else:
#        return jsonify({'message': 'admin is not existing'}), 400

# def register():
#     data=request.get_json()
#     username=data['username']
#     password=data['password']
#     usertype=data['usertype']
#     # If attempting to register an admin and one already exists, return an error.
#     if usertype == 'admin':
#         if collection.find_one({'usertype': 'admin'}):
#             return jsonify({'message': 'admin is existing'}), 400
#     collection.insert_one({'username':username,'password':password,'usertype' :usertype})
#     return jsonify({'message':'User registered'}),200


from flask import request, jsonify
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
    
    try:
        if usertype == 'admin':
            admin_exists = User.query.filter_by(usertype='admin').first()
            if admin_exists:
                return jsonify({'message': 'Admin already exists'}), 400
            
        new_user = User(
            username=username,
            password=password,
            usertype=usertype
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
def checkadmin():
    data = request.get_json()
    usertype = data['usertype']
    
    # Ensure this function is used only to verify admin existence
    if usertype == 'admin':
        admin_exists = User.query.filter_by(usertype='admin').first()
        if admin_exists:
            return jsonify({'message': 'Admin exists'}), 200
        else:
            return jsonify({'message': 'Admin does not exist'}), 400
    else:
        return jsonify({'message': 'Invalid usertype provided'}), 400





