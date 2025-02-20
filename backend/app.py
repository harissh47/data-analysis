from flask import Flask, request, jsonify
from db import connect
from auth import signup, register
from upload import upload  # Ensure this is used if needed
from view_csv import view_csv
from ai import chatbot, chatbot_analyze
from flask_cors import CORS
from authentication import send_otp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
analyzed_data = None

@app.route('/chat', methods=['POST'])
def chat():
    user_question = request.json.get('question')
    if not user_question:
        return jsonify({"error": "No question provided"}), 400
    
    try:
        response = chatbot(None, user_question)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": f"Chat error: {str(e)}"}), 500

@app.route('/connect')
def home():
    return connect()

@app.route('/signup', methods=['POST'])
def signup_route():
    return signup()

@app.route('/register', methods=['POST'])
def register_route():
    return register()

@app.route('/send_otp', methods=['POST'])
def send_otp_route():
    return send_otp(request.json.get('email'))

@app.route('/upload', methods=['POST'])
def upload_file():
    
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    print("file uploaded")
    file = request.files['file']

    print(file)
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

   
    try:
        global analyzed_data
        analyzed_data = chatbot_analyze(file)
        print(analyzed_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle any errors during analysis

    return jsonify({
        "message": "File uploaded successfully. AI is ready to chat!",
        "analyzed_data": analyzed_data  # Optionally return the analyzed data
    }), 200

@app.route('/view_csv', methods=['GET'])
def view_csv_route():
    return view_csv()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
