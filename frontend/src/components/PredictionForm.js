import React, { useState } from "react";

// City cluster mapping for the UX dropdown
const CITY_CLUSTERS = [
  { label: "Mumbai (Maharashtra)", value: 0 },
  { label: "Delhi NCR", value: 1 },
  { label: "Bengaluru (Karnataka)", value: 2 },
  { label: "Hyderabad (Telangana)", value: 3 },
  { label: "Pune / Chennai", value: 4 },
];

const INITIAL_STATE = {
  "number of bathrooms": "",
  "waterfront present": 0,
  "number of views": "",
  "condition of the house": 3,
  "grade of the house": 7,
  living_area_renov: "",
  lot_area_renov: "",
  "Total Area": "",
  House_age: "",
  Renovated: 0,
  Location_cluster_0: 1,
  Location_cluster_1: 0,
  Location_cluster_2: 0,
  Location_cluster_3: 0,
  Location_cluster_4: 0,
};

const VALIDATION_RULES = {
  "Total Area": { min: 100, max: 50000, label: "Total Area" },
  "number of bathrooms": { min: 1, max: 20, label: "Bathrooms" },
  House_age: { min: 0, max: 200, label: "House Age" },
  living_area_renov: { min: 0, max: 50000, label: "Renovated Living Area" },
  lot_area_renov: { min: 0, max: 200000, label: "Renovated Lot Area" },
  "number of views": { min: 0, max: 10, label: "Number of Views" },
};

export default function PredictionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [selectedCluster, setSelectedCluster] = useState(0);
  const [errors, setErrors] = useState({});

  // ── Handlers ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleRangeChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClusterChange = (e) => {
    const clusterIndex = parseInt(e.target.value, 10);
    setSelectedCluster(clusterIndex);
    const clusterFields = {};
    for (let i = 0; i < 5; i++) {
      clusterFields[`Location_cluster_${i}`] = i === clusterIndex ? 1 : 0;
    }
    setFormData((prev) => ({ ...prev, ...clusterFields }));
  };

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    Object.entries(VALIDATION_RULES).forEach(([key, rule]) => {
      const val = parseFloat(formData[key]);
      if (formData[key] === "" || isNaN(val)) {
        newErrors[key] = `${rule.label} is required.`;
      } else if (val < rule.min) {
        newErrors[key] = `${rule.label} must be at least ${rule.min}.`;
      } else if (val > rule.max) {
        newErrors[key] = `${rule.label} cannot exceed ${rule.max}.`;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Build payload with numeric values
    const payload = {};
    Object.entries(formData).forEach(([key, val]) => {
      payload[key] = parseFloat(val);
    });
    onSubmit(payload);
  };

  // ── Grade helpers ──────────────────────────────────────────────────
  const gradeLabels = {
    1: "Very Poor", 2: "Poor", 3: "Below Avg", 4: "Fair", 5: "Average",
    6: "Good", 7: "Very Good", 8: "Excellent", 9: "Superior",
    10: "Luxury", 11: "Premium", 12: "Ultra Premium", 13: "Mansion"
  };

  const conditionLabels = {
    1: "Very Poor", 2: "Poor", 3: "Fair", 4: "Good", 5: "Excellent"
  };

  const gradeVal = parseInt(formData["grade of the house"]);
  const condVal = parseInt(formData["condition of the house"]);
  const gradePct = ((gradeVal - 1) / 12) * 100;
  const condPct = ((condVal - 1) / 4) * 100;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="card">
        {/* ── Card Header ── */}
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">🏠</div>
            Property Details
          </div>
          <p className="card-subtitle">Fill in the details below to get an instant price estimate</p>
        </div>

        <div className="card-body">
          {/* ── Section 1: Core Dimensions ── */}
          <div className="form-section">
            <div className="form-section-label">📐 Area & Size</div>
            <div className="form-grid">
              {/* Total Area */}
              <div className="field">
                <label className="field-label" htmlFor="totalArea">
                  <span className="label-icon">📏</span> Total Area (sq ft)
                </label>
                <p className="field-hint">Combined living + basement area</p>
                <input
                  id="totalArea"
                  type="number"
                  name="Total Area"
                  value={formData["Total Area"]}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  min="100"
                  className={`field-input${errors["Total Area"] ? " has-error" : ""}`}
                />
                {errors["Total Area"] && <span className="field-error">⚠ {errors["Total Area"]}</span>}
              </div>

              {/* Renovated Living Area */}
              <div className="field">
                <label className="field-label" htmlFor="livingAreaRenov">
                  <span className="label-icon">🛋️</span> Renovated Living Area (sq ft)
                </label>
                <p className="field-hint">Interior area post-renovation</p>
                <input
                  id="livingAreaRenov"
                  type="number"
                  name="living_area_renov"
                  value={formData.living_area_renov}
                  onChange={handleChange}
                  placeholder="e.g. 1800"
                  min="0"
                  className={`field-input${errors.living_area_renov ? " has-error" : ""}`}
                />
                {errors.living_area_renov && <span className="field-error">⚠ {errors.living_area_renov}</span>}
              </div>

              {/* Lot Area Renovation */}
              <div className="field">
                <label className="field-label" htmlFor="lotAreaRenov">
                  <span className="label-icon">🌳</span> Renovated Lot Area (sq ft)
                </label>
                <p className="field-hint">Total plot area post-renovation</p>
                <input
                  id="lotAreaRenov"
                  type="number"
                  name="lot_area_renov"
                  value={formData.lot_area_renov}
                  onChange={handleChange}
                  placeholder="e.g. 4000"
                  min="0"
                  className={`field-input${errors.lot_area_renov ? " has-error" : ""}`}
                />
                {errors.lot_area_renov && <span className="field-error">⚠ {errors.lot_area_renov}</span>}
              </div>
            </div>
          </div>

          {/* ── Section 2: Property Info ── */}
          <div className="form-section">
            <div className="form-section-label">🏗️ Property Info</div>
            <div className="form-grid">
              {/* Bathrooms */}
              <div className="field">
                <label className="field-label" htmlFor="bathrooms">
                  <span className="label-icon">🚿</span> Number of Bathrooms
                </label>
                <input
                  id="bathrooms"
                  type="number"
                  name="number of bathrooms"
                  value={formData["number of bathrooms"]}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  min="1"
                  max="20"
                  className={`field-input${errors["number of bathrooms"] ? " has-error" : ""}`}
                />
                {errors["number of bathrooms"] && <span className="field-error">⚠ {errors["number of bathrooms"]}</span>}
              </div>

              {/* House Age */}
              <div className="field">
                <label className="field-label" htmlFor="houseAge">
                  <span className="label-icon">📅</span> House Age (years)
                </label>
                <p className="field-hint">Current year minus year built</p>
                <input
                  id="houseAge"
                  type="number"
                  name="House_age"
                  value={formData.House_age}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  min="0"
                  className={`field-input${errors.House_age ? " has-error" : ""}`}
                />
                {errors.House_age && <span className="field-error">⚠ {errors.House_age}</span>}
              </div>

              {/* Number of Views */}
              <div className="field">
                <label className="field-label" htmlFor="views">
                  <span className="label-icon">👁️</span> Number of Views
                </label>
                <p className="field-hint">Property visits / viewings</p>
                <input
                  id="views"
                  type="number"
                  name="number of views"
                  value={formData["number of views"]}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  min="0"
                  max="10"
                  className={`field-input${errors["number of views"] ? " has-error" : ""}`}
                />
                {errors["number of views"] && <span className="field-error">⚠ {errors["number of views"]}</span>}
              </div>

              {/* Waterfront Toggle */}
              <div className="field">
                <label className="field-label">
                  <span className="label-icon">🌊</span> Waterfront Property
                </label>
                <p className="field-hint">Does the property face a waterfront?</p>
                <div className="toggle-row">
                  <button
                    type="button"
                    id="waterfront-no"
                    className={`toggle-btn${formData["waterfront present"] === 0 ? " active" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, "waterfront present": 0 }))}
                  >No</button>
                  <button
                    type="button"
                    id="waterfront-yes"
                    className={`toggle-btn${formData["waterfront present"] === 1 ? " active" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, "waterfront present": 1 }))}
                  >Yes</button>
                </div>
              </div>

              {/* Renovated Toggle */}
              <div className="field">
                <label className="field-label">
                  <span className="label-icon">🔨</span> Previously Renovated
                </label>
                <p className="field-hint">Has the property been renovated before?</p>
                <div className="toggle-row">
                  <button
                    type="button"
                    id="renovated-no"
                    className={`toggle-btn${formData.Renovated === 0 ? " active" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, Renovated: 0 }))}
                  >No</button>
                  <button
                    type="button"
                    id="renovated-yes"
                    className={`toggle-btn${formData.Renovated === 1 ? " active" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, Renovated: 1 }))}
                  >Yes</button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3: Grade & Condition Sliders ── */}
          <div className="form-section">
            <div className="form-section-label">⭐ Quality Ratings</div>
            <div className="form-grid cols-2">
              {/* Grade Slider */}
              <div className="field">
                <label className="field-label">
                  <span className="label-icon">🏅</span> Grade of House
                </label>
                <div className="range-wrapper">
                  <div className="range-header">
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>1 – 13 scale</span>
                    <span className="range-value">{gradeVal} – {gradeLabels[gradeVal]}</span>
                  </div>
                  <input
                    type="range"
                    className="field-range"
                    name="grade of the house"
                    min="1"
                    max="13"
                    value={gradeVal}
                    style={{ "--range-pct": `${gradePct}%` }}
                    onChange={(e) => handleRangeChange("grade of the house", e.target.value)}
                  />
                  <div className="range-labels">
                    <span>Very Poor</span>
                    <span>Average</span>
                    <span>Mansion</span>
                  </div>
                </div>
              </div>

              {/* Condition Slider */}
              <div className="field">
                <label className="field-label">
                  <span className="label-icon">🔧</span> Condition of House
                </label>
                <div className="range-wrapper">
                  <div className="range-header">
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>1 – 5 scale</span>
                    <span className="range-value">{condVal} – {conditionLabels[condVal]}</span>
                  </div>
                  <input
                    type="range"
                    className="field-range"
                    name="condition of the house"
                    min="1"
                    max="5"
                    value={condVal}
                    style={{ "--range-pct": `${condPct}%` }}
                    onChange={(e) => handleRangeChange("condition of the house", e.target.value)}
                  />
                  <div className="range-labels">
                    <span>Very Poor</span>
                    <span>Fair</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Location ── */}
          <div className="form-section">
            <div className="form-section-label">📍 Location</div>
            <div className="field">
              <label className="field-label" htmlFor="locationCluster">
                <span className="label-icon">🏙️</span> City / Metro Area
              </label>
              <p className="field-hint">Select the closest metro market for this property</p>
              <div className="select-wrapper">
                <select
                  id="locationCluster"
                  className="field-select"
                  value={selectedCluster}
                  onChange={handleClusterChange}
                >
                  {CITY_CLUSTERS.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            id="predict-btn"
            type="submit"
            className="btn-predict"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                <span className="btn-predict-text">Calculating...</span>
              </>
            ) : (
              <span className="btn-predict-text">✨ Predict House Price</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
