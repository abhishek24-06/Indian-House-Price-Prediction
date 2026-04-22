import React, { useState } from "react";
import axios from "axios";
import PredictionForm from "./components/PredictionForm";
import ResultCard from "./components/ResultCard";
import "./index.css";

const API_URL = "http://127.0.0.1:5000/predict";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(res.data.prediction);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Could not reach the prediction server. Make sure the Flask backend is running on port 5000.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* ── Hero ── */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">🏠 AI-Powered Real Estate</div>
          <h1 className="hero-title">House Price Predictor</h1>
          <p className="hero-subtitle">
            Get instant ML-powered property valuations tailored to India's major
            real estate markets
          </p>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main-content">
        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-chip">
            <span className="stat-chip-value">5</span>
            <span className="stat-chip-label">Metro Cities</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-value">R² &gt; 0.85</span>
            <span className="stat-chip-label">Model Accuracy</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-value">&lt; 200ms</span>
            <span className="stat-chip-label">Response Time</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-value">INR ₹</span>
            <span className="stat-chip-label">Currency</span>
          </div>
        </div>

        {/* Form */}
        <PredictionForm onSubmit={handlePredict} loading={loading} />

        {/* Error */}
        {error && (
          <div className="error-banner" role="alert">
            ❌ {error}
          </div>
        )}

        {/* Result */}
        {result !== null && <ResultCard price={result} />}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>
          © 2025 House Price Predictor &nbsp;·&nbsp; Powered by Machine
          Learning &nbsp;·&nbsp; For informational purposes only
        </p>
      </footer>
    </div>
  );
}
