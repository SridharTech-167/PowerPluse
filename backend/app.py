from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv()

app = Flask(__name__)

CORS(app)

# Connect to MySQL
db = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE")
)


@app.route("/")
def home():
    return "PowerPulse Backend is Running!"


@app.route("/test-db")
def test_db():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    result = cursor.fetchall()
    cursor.close()

    return str(result)


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    mobile = data.get("mobile")
    password = data.get("password")

    if not full_name or not email or not mobile or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    cursor = db.cursor()

    try:
        query = """
            INSERT INTO users (full_name, email, mobile, password)
            VALUES (%s, %s, %s, %s)
        """

        values = (full_name, email, mobile, password)

        cursor.execute(query, values)
        db.commit()

        return jsonify({
            "success": True,
            "message": "Registration successful"
        })

    except mysql.connector.Error as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 400

    finally:
        cursor.close()


@app.route("/outages", methods=["GET"])
def get_outages():
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                area_name,
                reason,
                start_time,
                estimated_restore_time,
                status
            FROM outages
            ORDER BY start_time DESC
        """)

        outages = cursor.fetchall()

        return jsonify(outages)

    except mysql.connector.Error as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:
        cursor.close()


if __name__ == "__main__":
    app.run(debug=True)