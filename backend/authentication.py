import flask 
from flask import jsonify
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_otp(email_address):
    if "@" not in email_address:
        return jsonify({"error": "Invalid email address"}), 400
    
    otp = random.randint(100000, 999999)
    
    # SMTP server configuration (update these for Gmail)
    smtp_server = "smtp.example.com"  # Change this to smtp.gmail.com for Gmail
    smtp_port = 587
    smtp_username = "your_email@example.com"  # Your Gmail address
    smtp_password = "your_email_password"       # Your Gmail password (or app password)
    
    try:
        # Create the email message
        msg = MIMEMultipart()
        msg["From"] = smtp_username
        msg["To"] = email_address
        msg["Subject"] = "Your OTP Code"
        body = f"Your OTP is {otp}"
        msg.attach(MIMEText(body, "plain"))
        
        # Connect to SMTP server and send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure connection
        server.login(smtp_username, smtp_password)
        server.sendmail(smtp_username, email_address, msg.as_string())
        server.quit()
        return jsonify({"message": "OTP sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500