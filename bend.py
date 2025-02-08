import google.generativeai as genai
from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

# Set your Gemini API key
GEMINI_API_KEY = "AIzaSyD9rxV9yupKAruFqyWYy7slQkFrE4clVg0"
genai.configure(api_key=GEMINI_API_KEY)

def fetch_sustainability_data(lat, lon):
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
            "address": "Approximate location"
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
        model = genai.GenerativeModel("gemini-pro")  # Use Gemini Pro Model
        response = model.generate_content(prompt)

        chat_response = response.text
        sustainability_data = json.loads(chat_response)  # Convert response to JSON

        # Save JSON to a file
        with open("location_sustainability.json", "w") as json_file:
            json.dump(sustainability_data, json_file, indent=4)

        return sustainability_data

    except Exception as e:
        return {"error": str(e)}

@app.route('/')
def home():
    return "Sustainability API is running!"


@app.route('/generate_json', methods=['POST'])
def generate_json():
    """API to receive location data and return sustainability assessment"""
    request_data = request.get_json()
    lat = request_data.get('latitude')
    lon = request_data.get('longitude')

    if lat is None or lon is None:
        return jsonify({"error": "Invalid coordinates"}), 400

    json_data = fetch_sustainability_data(lat, lon)
    return jsonify(json_data)

if __name__ == '__main__':
    app.run(debug=True)