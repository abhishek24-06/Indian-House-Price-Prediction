# Indian House Price Prediction

A full-stack web application for predicting house prices in India using machine learning. The project includes data analysis, a trained model, a Flask backend API, and a React frontend interface.

## Features

- **Data Analysis**: Jupyter notebook with exploratory data analysis of the Indian house price dataset
- **Machine Learning Model**: Trained regression model for price prediction
- **REST API**: Flask backend serving predictions via HTTP endpoints
- **Web Interface**: React frontend with user-friendly prediction form
- **CORS Support**: Seamless communication between frontend and backend

## Project Structure

```
Indian-House-Price-Prediction/
├── Data__Analysis.ipynb          # Jupyter notebook for data exploration
├── House Price India.csv         # Dataset used for training
├── backend/                      # Flask API server
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── model/                    # Trained model files
│   │   ├── house_price_model.pkl # Serialized ML model
│   │   └── features.pkl          # Feature list for model input
│   └── templates/                # HTML templates (if used)
├── frontend/                     # React web application
│   ├── public/                   # Static assets
│   ├── src/                      # React source code
│   │   ├── components/           # React components
│   │   │   ├── PredictionForm.js # Input form component
│   │   │   └── ResultCard.js     # Prediction display component
│   │   └── App.js                # Main React app
│   ├── package.json              # Node.js dependencies and scripts
│   └── README.md                 # Frontend-specific documentation
└── README.md                     # This file
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The web app will be available at `http://localhost:3000`

## Usage

1. Ensure both backend and frontend servers are running
2. Open your browser and go to `http://localhost:3000`
3. Fill in the house features in the prediction form
4. Click "Predict" to get the estimated house price

## API Endpoints

### GET /health
Check if the model is loaded and get expected features.

**Response:**
```json
{
  "status": "ok",
  "features": ["feature1", "feature2", ...]
}
```

### POST /predict
Make a price prediction.

**Request Body:**
```json
{
  "feature1": value1,
  "feature2": value2,
  ...
}
```

**Response:**
```json
{
  "prediction": 1234567.89,
  "formatted": "₹1,234,568"
}
```

## Model Details

- **Algorithm**: Likely a regression model (based on the use of `np.expm1` for inverse log transformation)
- **Features**: Various house attributes (area, location, amenities, etc.)
- **Target**: House price in Indian Rupees (₹)
- **Training Data**: House Price India.csv dataset

## Development

### Running Data Analysis
Open `Data__Analysis.ipynb` in Jupyter Notebook or JupyterLab to explore the data analysis process.

### Model Training
The model training code is in the data analysis notebook. To retrain:
1. Run the notebook cells
2. Save the new model to `backend/model/`

### Adding New Features
1. Update the model and features.pkl
2. Modify the frontend form in `PredictionForm.js`
3. Update the backend validation in `app.py`

## Troubleshooting

### Backend Issues
- **Model not loading**: Check that `house_price_model.pkl` and `features.pkl` exist in `backend/model/`
- **CORS errors**: Ensure Flask-CORS is installed and configured
- **Port conflicts**: Change the port in `app.py` if 5000 is in use

### Frontend Issues
- **API connection failed**: Verify backend is running on port 5000
- **Build errors**: Run `npm install` to ensure all dependencies are installed
- **Port conflicts**: React dev server defaults to 3000, change if needed

### Common Errors
- **Missing features**: Ensure all required features are provided in the prediction request
- **Invalid data types**: All feature values must be numeric

## Technologies Used

- **Backend**: Flask, scikit-learn, pandas, numpy, joblib
- **Frontend**: React, Axios
- **Data Analysis**: Jupyter Notebook, matplotlib, seaborn
- **Deployment**: Ready for containerization with Docker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Please check the license file for details.