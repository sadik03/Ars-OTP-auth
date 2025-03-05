from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import random
import sqlite3
import bcrypt
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)

EMAIL_ADDRESS = "studycare240@gmail.com"
EMAIL_PASSWORD = "kgpc zwad jtfl obyq"
otp_store = {}

# Database Setup
def create_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT, age INTEGER, email TEXT UNIQUE,
                        password TEXT)''')
    conn.commit()
    conn.close()

create_db()

# Send OTP
@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    otp = str(random.randint(100000, 999999))
    otp_store[email] = otp

    msg = EmailMessage()
    msg['Subject'] = 'Your OTP Code'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = email
    msg.set_content(f'Your OTP code is: {otp}')

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        return jsonify({"message": "OTP sent successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    age = data.get('age')
    email = data.get('email')
    password = data.get('password')
    otp = data.get('otp')

    if email not in otp_store or otp_store[email] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    del otp_store[email]  # Remove OTP after successful verification

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, age, email, password) VALUES (?, ?, ?, ?)",
                       (name, age, email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully"})
    except Exception as e:
        return jsonify({"error": "User already exists or other error"}), 400

# Login (Fixed to check email first)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "Email not registered"}), 400  # Debugging fix

    stored_password = user[0]
    if bcrypt.checkpw(password.encode(), stored_password):
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"error": "Invalid password"}), 400

if __name__ == '__main__':
    app.run(debug=True)
