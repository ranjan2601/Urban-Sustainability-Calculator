import google.generativeai as genai
from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS  # ✅ Import CORS
import requests

app = Flask(__name__)
CORS(app)

# Set your Gemini API key
GEMINI_API_KEY = "AIzaSyD9rxV9yupKAruFqyWYy7slQkFrE4clVg0"
genai.configure(api_key=GEMINI_API_KEY)

import json
import google.generativeai as genai

def get_address_from_coordinates(lat, lon):
    """Reverse geocode coordinates using OpenStreetMap's Nominatim API"""
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"

    headers = {
        "User-Agent": "UrbanSustainabilityApp/1.0 (samridh@gmail.com)"  # ✅ Set a valid User-Agent
    }

    try:
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            print(data)
            return data.get("display_name", "Address not found")
        elif response.status_code == 403:
            return "Error 403: Access Forbidden - You may have exceeded the request limit."
        else:
            return f"Error {response.status_code}: Could not retrieve address."
    
    except requests.RequestException as e:
        return f"Request error: {e}"

def fetch_sustainability_data(lat, lon):
    address = get_address_from_coordinates(lat,lon)
    """Fetch sustainability data using Google Gemini API"""
    prompt = f"""
    Provide a sustainability assessment for the location at latitude {lat} and longitude {lon}.
    Include:
    - Environmental Impact (Carbon Footprint, Air & Water Quality, Green Spaces, Waste Management)
    - Economic Sustainability (Job Creation, Infrastructure, Affordability)
    - Social Impact (Noise Pollution, Health & Safety, Community Well-being)

    Give specific details like energy consumption, public transport impact, expected carbon emissions, green space availability, and housing affordability.

    Format the response in JSON like this:
    {{
        "location": {{
            "latitude": {lat},
            "longitude": {lon},
            "address": {address}
        }},
        "sustainability_score": {{
            "environmental_impact": {{
                "carbon_footprint": "...",
                "air_water_quality": "...",
                "green_space_biodiversity": "...",
                "waste_circular_economy": "..."
            }},
            "economic_sustainability": {{
                "job_creation_local_economy": "...",
                "infrastructure_transport": "...",
                "affordability_social_equity": "..."
            }},
            "social_impact": {{
                "noise_light_pollution": "...",
                "health_safety": "...",
                "community_well_being": "..."
            }}
        }},
        "final_score": {{
            "value": "...",
            "zone": "...",
            "recommendations": ["...", "...", "..."]
        }}
    }}
    """

    try:
        model = genai.GenerativeModel("gemini-pro")  # ✅ Use Gemini Pro Model
        response = model.generate_content(prompt)

        if not response.text:
            raise ValueError("Empty response from Gemini API")

        chat_response = response.text.strip()

        # ✅ Try converting to JSON
        try:
            sustainability_data = json.loads(chat_response)
        except json.JSONDecodeError:
            print("⚠️ Invalid JSON response received. Attempting to fix...")
            chat_response = chat_response.replace("```json", "").replace("```", "").strip()  # Remove code block formatting
            try:
                sustainability_data = json.loads(chat_response)
            except json.JSONDecodeError:
                return {"error": "Failed to parse Gemini API response into JSON"}

        # ✅ Save JSON to a file
        with open("location_sustainability.json", "w", encoding="utf-8") as json_file:
            json.dump(sustainability_data, json_file, indent=4)

        print("✅ Sustainability Data:", json.dumps(sustainability_data, indent=4))
        return sustainability_data

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"error": str(e)}

def fetch_construction_sustainability_data(lat, lon, construction_plans):
    address = get_address_from_coordinates(lat,lon)
    """Fetch sustainability data for construction plans using Google Gemini API"""
    prompt = f"""
    Provide a sustainability assessment for the construction of {construction_plans} at latitude {lat} and longitude {lon}.
    Include:
    - Environmental Impact (Carbon Footprint, Air & Water Quality, Green Spaces, Waste Management)
    - Economic Sustainability (Job Creation, Infrastructure, Affordability)
    - Social Impact (Noise Pollution, Health & Safety, Community Well-being)

    Give specific details like energy consumption, public transport impact, expected carbon emissions, green space availability, and housing affordability.

    Format the response in JSON like this:
    {{
        "location": {{
            "latitude": {lat},
            "longitude": {lon},
            "address": {address}
        }},
        "sustainability_score": {{
            "environmental_impact": {{
                "carbon_footprint": "...",
                "air_water_quality": "...",
                "green_space_biodiversity": "...",
                "waste_circular_economy": "..."
            }},
            "economic_sustainability": {{
                "job_creation_local_economy": "...",
                "infrastructure_transport": "...",
                "affordability_social_equity": "..."
            }},
            "social_impact": {{
                "noise_light_pollution": "...",
                "health_safety": "...",
                "community_well_being": "..."
            }}
        }},
        "final_score": {{
            "value": "...",
            "zone": "...",
            "recommendations": ["...", "...", "..."]
        }}
    }}
    """

    try:
        model = genai.GenerativeModel("gemini-pro")  # ✅ Use Gemini Pro Model
        response = model.generate_content(prompt)

        if not response.text:
            raise ValueError("Empty response from Gemini API")

        chat_response = response.text.strip()

        # ✅ Try converting to JSON
        try:
            sustainability_data = json.loads(chat_response)
        except json.JSONDecodeError:
            print("⚠️ Invalid JSON response received. Attempting to fix...")
            chat_response = chat_response.replace("```json", "").replace("```", "").strip()  # Remove code block formatting
            try:
                sustainability_data = json.loads(chat_response)
            except json.JSONDecodeError:
                return {"error": "Failed to parse Gemini API response into JSON"}

        # ✅ Save JSON to a file
        with open("construction_sustainability.json", "w", encoding="utf-8") as json_file:
            json.dump(sustainability_data, json_file, indent=4)

        print("✅ Sustainability Data:", json.dumps(sustainability_data, indent=4))
        return sustainability_data

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"error": str(e)}

@app.route('/')
def home():
    return "Sustainability API is running!"

@app.route('/generate_json', methods=['POST', 'GET'])
def generate_json():
    """API to receive location data and return sustainability assessment"""
    request_data = request.get_json()
    lat = request_data.get('latitude')
    lon = request_data.get('longitude')
    print(f"Received request for coordinates: {lat}, {lon}")

    if lat is None or lon is None:
        return jsonify({"error": "Invalid coordinates"}), 400

    json_data = fetch_sustainability_data(lat, lon)
    return jsonify(json_data)

@app.route('/construction_json', methods=['POST'])
def construction_json():
    """API to receive construction plans and return sustainability assessment"""
    request_data = request.get_json()
    lat = request_data.get('latitude')
    lon = request_data.get('longitude')
    construction_plans = request_data.get('construction_plans')

    if lat is None or lon is None or construction_plans is None:
        return jsonify({"error": "Invalid coordinates or construction plans"}), 400

    json_data = fetch_construction_sustainability_data(lat, lon, construction_plans)
    return jsonify(json_data)

if __name__ == '__main__':
    app.run(debug=True,port=5000)