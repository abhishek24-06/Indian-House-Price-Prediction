from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend to talk to Flask

# ── Load Model ──────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "house_price_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "model", "features.pkl")

try:
    model = joblib.load(MODEL_PATH)
    features = joblib.load(FEATURES_PATH)
    print(f"[OK] Model loaded. Expected features: {features}")
except Exception as e:
    model = None
    features = []
    print(f"[ERROR] Failed to load model: {e}")


# ── Health Check ──────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    status = "ok" if model is not None else "model_load_failed"
    return jsonify({"status": status, "features": features}), 200


# ── Home ──────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"message": "House Price Prediction API is running.", "status": "ok"})


# ── Predict ───────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model is not loaded. Please check the server."}), 500

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received."}), 400

    # Validate and build input
    input_data = {}
    missing = []
    for feature in features:
        if feature not in data:
            missing.append(feature)
        else:
            try:
                input_data[feature] = float(data[feature])
            except (ValueError, TypeError):
                return jsonify({"error": f"Invalid value for '{feature}'. Expected a number."}), 400

    if missing:
        return jsonify({"error": f"Missing required features: {missing}"}), 400

    try:
        df = pd.DataFrame([input_data])[features]
        pred_log = model.predict(df)
        pred = float(np.expm1(pred_log[0]))

        # Format for display
        pred_rounded = round(pred, 2)

        return jsonify({
            "prediction": pred_rounded,
            "formatted": f"₹{pred_rounded:,.0f}"
        })
    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        return jsonify({"error": "Prediction failed. Please check your inputs."}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)