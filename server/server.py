from flask import Flask, request, jsonify
from flask_cors import CORS
from openpyxl import Workbook, load_workbook
import os

app = Flask(__name__)
CORS(app)

EXCEL_FILE = "events.xlsx"
SHEET_NAME = "Events"


def initialize_excel():
    if not os.path.exists(EXCEL_FILE):
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = SHEET_NAME
        sheet.append([
            "Title",
            "Date",
            "Time",
            "Location",
            "Category",
            "Description",
            "Organizer",
            "Price",
            "Capacity"
        ])
        workbook.save(EXCEL_FILE)


def save_event_to_excel(event_data):
    initialize_excel()

    workbook = load_workbook(EXCEL_FILE)
    sheet = workbook[SHEET_NAME]

    sheet.append([
        event_data.get("title", ""),
        event_data.get("date", ""),
        event_data.get("time", ""),
        event_data.get("location", ""),
        event_data.get("category", ""),
        event_data.get("description", ""),
        event_data.get("organizer", ""),
        event_data.get("price", 0),
        event_data.get("capacity", 0)
    ])

    workbook.save(EXCEL_FILE)


@app.route("/api/events", methods=["POST"])
def create_event():
    try:
        data = request.get_json()

        required_fields = [
            "title",
            "date",
            "time",
            "location",
            "category",
            "description",
            "organizer",
            "price",
            "capacity"
        ]

        missing_fields = [field for field in required_fields if field not in data or data[field] == ""]

        if missing_fields:
            return jsonify({
                "success": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400

        save_event_to_excel(data)

        return jsonify({
            "success": True,
            "message": "Event saved successfully.",
            "event": data
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500


if __name__ == "__main__":
    initialize_excel()
    app.run(host="0.0.0.0", port=4000, debug=True)