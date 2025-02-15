from dotenv import load_dotenv
from db import collection
from flask import request,jsonify
load_dotenv()
def signup():
    data=request.get_json()
    username=data['username']
    password=data['password']
    usertype=data['usertype']
    if collection.find_one({'username':username,'password':password,'usertype':usertype}):
        return jsonify({'message':'User already exists'}),200
    else:
        return jsonify({'message':'User not registered'}),400    

def checkadmin():
    data = request.get_json()
    usertype = data['usertype']
    # Ensure checkadmin is used only to verify admin existence.
    if usertype == 'admin' and collection.find_one({'usertype': 'admin'}):
       return jsonify({'message': 'admin is existing'}), 200
    else:
       return jsonify({'message': 'admin is not existing'}), 400

def register():
    data=request.get_json()
    username=data['username']
    password=data['password']
    usertype=data['usertype']
    # If attempting to register an admin and one already exists, return an error.
    if usertype == 'admin':
        if collection.find_one({'usertype': 'admin'}):
            return jsonify({'message': 'admin is existing'}), 400
    collection.insert_one({'username':username,'password':password,'usertype' :usertype})
    return jsonify({'message':'User registered'}),200






