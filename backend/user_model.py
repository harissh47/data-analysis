from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'user_info' 
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(500), nullable=False)
    usertype = db.Column(db.String(100), nullable=False)

    # Method to set password (hashing)
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to check password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)