from flask import Flask, request, jsonify
from flask_cors import CORS
from openpyxl import Workbook, load_workbook
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_FILE = os.path.join(BASE_DIR, "events.xlsx")
SHEET_NAME = "Events"

REQUIRED_FIELDS = [
    "title",
    "description",
    "category",
    "date",
    "time",
    "location",
    "address",
    "capacity",
    "imageUrl",
    "organizer",
    "organizerId",
    "isPublic",
]


def initialize_excel():
    if not os.path.exists(EXCEL_FILE):
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = SHEET_NAME
        sheet.append([
            "Title",
            "Description",
            "Category",
            "Date",
            "Time",
            "Location",
            "Address",
            "Capacity",
            "Image URL",
            "Organizer",
            "Organizer ID",
            "Is Public",
        ])
        workbook.save(EXCEL_FILE)


def save_event_to_excel(event_data):
    initialize_excel()
    workbook = load_workbook(EXCEL_FILE)
    sheet = workbook[SHEET_NAME]

    sheet.append([
        event_data["title"],
        event_data["description"],
        event_data["category"],
        event_data["date"],
        event_data["time"],
        event_data["location"],
        event_data["address"],
        event_data["capacity"],
        event_data["imageUrl"],
        event_data["organizer"],
        event_data["organizerId"],
        "Yes" if event_data["isPublic"] else "No",
    ])

    workbook.save(EXCEL_FILE)


@app.route("/api/events", methods=["POST"])
def create_event():
    try:
        data = request.get_json()
        print("Received data:", data)

        if not data:
            return jsonify({
                "success": False,
                "message": "No JSON data received."
            }), 400

        missing_fields = []
        for field in REQUIRED_FIELDS:
            value = data.get(field)
            if value is None or value == "":
                missing_fields.append(field)

        if missing_fields:
            return jsonify({
                "success": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400

        cleaned_data = {
            "title": str(data["title"]).strip(),
            "description": str(data["description"]).strip(),
            "category": str(data["category"]).strip(),
            "date": str(data["date"]).strip(),
            "time": str(data["time"]).strip(),
            "location": str(data["location"]).strip(),
            "address": str(data["address"]).strip(),
            "capacity": int(data["capacity"]),
            "imageUrl": str(data["imageUrl"]).strip(),
            "organizer": str(data["organizer"]).strip(),
            "organizerId": str(data["organizerId"]).strip(),
            "isPublic": bool(data["isPublic"]),
        }

        save_event_to_excel(cleaned_data)

        return jsonify({
            "success": True,
            "message": "Event saved successfully.",
            "event": cleaned_data
        }), 201

    except Exception as e:
        print("Server error:", str(e))
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500


if __name__ == "__main__":
    initialize_excel()
    app.run(host="0.0.0.0", port=4000, debug=False)