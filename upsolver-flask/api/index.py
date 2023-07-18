from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return "Hello, World!"


@app.route("/multiply", methods=["POST"])
def multiply():
    data = request.get_json()
    x = data["x"]
    y = data["y"]
    return jsonify({"result": x * y})


@app.route("/html", methods=["POST"])
def html():
    data = request.get_json()
    url = data["url"]
    response = requests.get(url)
    return response.text


if __name__ == "__main__":
    app.run()
