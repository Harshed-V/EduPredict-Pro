# EduPredict AI

This repository contains a student performance prediction application with a FastAPI backend and a Vite + React frontend.

## Backend

### Setup

1. Open a PowerShell terminal.
2. Navigate to the backend directory:

```powershell
cd "d:\ML project\edupredict-ai-backend"
```

3. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

4. Install backend dependencies:

```powershell
python -m pip install -r requirements.txt
```

> Note: `requirements.txt` has been updated to use versions compatible with Python 3.14, including `pandas==3.0.3` and `numpy==2.4.6`.

### Run the backend server

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

> Note: The backend runs on port 8001 (not 8000) due to Windows socket permission restrictions.

### Verify the backend

- Health endpoint: `http://127.0.0.1:8001/api/health`
- Prediction endpoint example:

```powershell
$body = @{StudyHours=10; Attendance=85; Motivation='High'; AssignmentCompletion=90; OnlineCourses=2; StressLevel=3} | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:8001/api/predict -Method Post -Body $body -ContentType 'application/json'
```

- Dataset download endpoint: `http://127.0.0.1:8001/api/dataset/download` (returns CSV file)

### Train the model

```powershell
cd "d:\ML project"
python edupredict-ai-backend\scripts\train_model.py
```

### Train with the standalone Python workflow

You can also train the model directly from the repository root using the standalone script:

```powershell
cd "d:\ML project"
python student_marks_prediction.py
```

This script loads `student_performance.csv`, trains a `RandomForestClassifier`, prints the model accuracy, and saves the trained model to `student_grade_model.pkl`.

The notebook `student_marks_prediction.ipynb` is available for interactive exploration and reporting, but the `.py` script is the preferred reproducible training workflow.

## API Documentation

### Available Endpoints

#### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies backend server status and model readiness
- **Response**: Returns model accuracy and readiness status

#### 2. Predict Student Performance
- **Endpoint**: `POST /api/predict`
- **Description**: Predicts student final grade based on input metrics
- **Request Body**:
  ```json
  {
    "StudyHours": 10,
    "Attendance": 85,
    "Motivation": "High",
    "AssignmentCompletion": 90,
    "OnlineCourses": 2,
    "StressLevel": 3
  }
  ```
- **Response**: Returns prediction with confidence level, peer percentile, and performance category
- **Example Response**:
  ```json
  {
    "predicted_class": 2,
    "predicted_class_label": "FinalGrade 2",
    "prediction": "GOOD PROGRESS",
    "predicted_score": 76,
    "confidence": 34.0,
    "peer_percentile": "Top 24%",
    "performance_category": "GOOD PROGRESS",
    "recommendation": "Small gains in regular study and active practice should continue to improve the forecast."
  }
  ```

#### 3. Get Model Metrics
- **Endpoint**: `GET /api/metrics`
- **Description**: Retrieves model performance metrics including accuracy, precision, and recall
- **Response**: Returns accuracy, precision, recall, F1-score, and confusion matrix

#### 4. Download Training Dataset
- **Endpoint**: `GET /api/dataset/download`
- **Description**: Downloads the training dataset in CSV format
- **Response**: Returns `student_performance.csv` file with 539,607 bytes containing student performance data
- **Usage**: Can be downloaded from the Analytics Dashboard in the web application
- **File Format**: CSV with headers including StudyHours, Attendance, Motivation, AssignmentCompletion, OnlineCourses, StressLevel, and FinalGrade

#### 5. FAQ Chatbot
- **Endpoint**: `POST /api/faq`
- **Description**: Processes FAQ queries using embeddings-based similarity search
- **Request Body**:
  ```json
  {
    "query": "How can I improve my grade?"
  }
  ```

## Frontend Features

### Pages

- **Analytics Dashboard** (`/analytics`): Overview of model performance and student statistics
- **Predict Score** (`/predict`): Interactive prediction form for student performance
- **Model Performance** (`/model-performance`): Detailed model metrics and dataset overview with download capability
- **About Project** (`/`): Project information and landing page

### Dataset Download

From the **Analytics Dashboard**, you can download the complete training dataset by clicking the "Download Dataset" button in the Dataset Overview section. This CSV file contains all training features and target variables used to train the model.

## Frontend

### Setup

1. Open a PowerShell terminal.
2. Navigate to the frontend directory:

```powershell
cd "d:\ML project\edupredict-ai-frontend"
```

3. Install npm dependencies:

```powershell
npm install
```

### Run the frontend

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

The app should be available at `http://127.0.0.1:5173/`.

### Notes

- The frontend is configured with a proxy from `/api` to `http://127.0.0.1:8001` in `vite.config.js`.
- Make sure the backend server is running on port 8001 before using the predict flow.
- The browser console warning in the frontend was fixed by ensuring React sidebar navigation items use unique keys.

## Troubleshooting

- If the backend fails on `pandas` installation, use Python 3.14 or a compatible version and re-run `python -m pip install -r requirements.txt`.
- If the frontend cannot reach the backend, confirm both services are running and that you are using the correct local ports:
  - backend: `127.0.0.1:8000`
  - frontend: `127.0.0.1:5173`
