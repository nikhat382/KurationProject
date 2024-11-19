
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Abstract API credentials
ABSTRACT_API_KEY = "bd1053bd4265404eb89889554fc785ab"
ABSTRACT_API_URL = "https://companyenrichment.abstractapi.com/v2/"

@app.route('/api/enrich', methods=['POST'])
def enrich_lead():
    try:
        # Log incoming request
        print("Incoming request:", request.json)

        # Extract JSON data from the request
        data = request.get_json()
        company_name = data.get('companyName')
        website = data.get('website')

        # Validate inputs
        if not company_name or not website:
            return jsonify({"error": "Both companyName and website are required!"}), 400

        # Construct API URL
        api_url = f"{ABSTRACT_API_URL}?api_key={ABSTRACT_API_KEY}&domain={website}"
        print(f"Calling Abstract API: {api_url}")

        # Make GET request to Abstract API
        response = requests.get(api_url)

        # Handle API response
        if response.status_code == 200:
            enriched_data = response.json()
            print("Enriched Data:", enriched_data)
            return jsonify(enriched_data), 200
        elif response.status_code == 404:
            return jsonify({"error": "Company not found"}), 404
        else:
            return jsonify({"error": "Failed to fetch data from the enrichment API"}), response.status_code

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
