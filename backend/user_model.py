from db import db

class User(db.Model):
    __tablename__ = 'user_info' 
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(500), nullable=False)
    usertype = db.Column(db.String(100), nullable=False)