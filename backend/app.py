import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from authentication import send_otp
from homepage_notification import homepage_notification_delete, homepage_notification_get, homepage_notification_send
from db import db, connect
from auth import login, signup, register
from flask_migrate import Migrate  # Import Flask-Migrate
from user_model import User, Notification


load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() in ('true', '1', 't')

db.init_app(app)

migrate = Migrate(app, db)

# ------------------------- Routes -------------------------#
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Server is running"}), 200

# @app.route('/chat', methods=['POST'])
# def chat():
#     global analyzed_data
#     if analyzed_data is None:
#         return jsonify({"error": "Please analyze data first before chatting"}), 400
    
#     user_question = request.json.get('question')
#     if not user_question:
#         return jsonify({"error": "No question provided"}), 400
    
#     try:
#         response = chatbot(analyzed_data, user_question)
#         return jsonify({"response": response})
#     except Exception as e:
#         return jsonify({"error": f"Chat error: {str(e)}"}), 500

@app.route('/connect')
def home():
    return connect()

@app.route('/signup', methods=['POST'])
def signup_route():
    return signup()

@app.route('/register', methods=['POST'])
def register_route():
    return register()

@app.route('/login', methods=['POST'])
def login_route():
    return login()

@app.route('/send_otp', methods=['POST'])
def send_otp_route():
    return send_otp(request.json.get('email'))

# @app.route('/view_csv', methods=['GET'])
# def view_csv_route():
#     return view_csv()

# @app.route('/upload', methods=['POST'])
# def upload_file():
    
#     if 'file' not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files['file']

  
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

   
#     try:
#         global analyzed_data
#         analyzed_data = analyze_data(file)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500  # Handle any errors during analysis

#     return jsonify({
#         "message": "File uploaded successfully. AI is ready to chat!",
#         "analyzed_data": analyzed_data  # Optionally return the analyzed data
#     }), 200

@app.route('/homepage_notification/send', methods=['POST'])
def homepage_notification_send_route():
    data = request.get_json()
    user_id = data.get('user_id')
    message = data.get('message')
    return homepage_notification_send(user_id, message)

@app.route('/homepage_notification/get', methods=['POST'])
def homepage_notification_get_route():
    data = request.get_json()
    user_id = data.get('user_id')
    return homepage_notification_get(user_id)

@app.route('/homepage_notification/delete', methods=['DELETE'])
def homepage_notification_delete_route():
    data = request.get_json()
    user_id = data.get('user_id')
    return homepage_notification_delete(user_id)

if __name__ == '__main__':
    app.run(debug=True)

