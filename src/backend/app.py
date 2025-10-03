from flask import Flask, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)  # allow React to access this API

API_URL = "https://azmiproductions.com/restazp/"
HEADERS = {"Content-Type": "application/json"}
CREDENTIALS = {
    "user": "azmiprod_smartfarmuser",
    "pass": "SMARTfarm123.",
    "db": "azmiprod_smartfarm",
}

def fetch_table(table):
    payload = {**CREDENTIALS, "table": table}
    res = requests.get(API_URL, headers=HEADERS, data=json.dumps(payload))
    res.raise_for_status()
    return res.json()

@app.route("/moisture")
def get_moisture():
    return jsonify(fetch_table("moisture"))

@app.route("/dht22")
def get_dht():
    return jsonify(fetch_table("dht22"))

if __name__ == "__main__":
    app.run(port=5001, debug=True)
