# EduPredict AI

EduPredict AI is a student performance prediction project with a FastAPI backend and a Vite + React frontend.
**LiveDemo**https://edu-predict-pro.vercel.app/ 

## What It Does

- Predicts student performance from study and behavior inputs
- Shows live model metrics and dataset insights
- Provides an FAQ chatbot for quick guidance
- Shows live AI engine status in the UI
- Lets you search, filter, refresh, and review dataset entries

## Project Structure

- `edupredict-ai-backend/` - FastAPI API, prediction logic, metrics, FAQ service, and dataset download route
- `edupredict-ai-frontend/` - React UI for the landing page, prediction form, analytics dashboard, and dataset review drawer
- `student_performance.csv` - training dataset
- `student_marks_prediction.py` - standalone training workflow
- `student_marks_prediction.ipynb` - notebook version of the training workflow

## Backend Setup

1. Open a PowerShell terminal.
2. Move to the backend folder:

```powershell
cd "D:\ML project\edupredict-ai-backend"
```

3. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

4. Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

5. Start the API server:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

## Frontend Setup

1. Open another PowerShell terminal.
2. Move to the frontend folder:

```powershell
cd "D:\ML project\edupredict-ai-frontend"
```

3. Install dependencies:

```powershell
npm install
```

4. Start the frontend:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

## Useful URLs

- Frontend: `http://127.0.0.1:5173/`
- Backend health: `http://127.0.0.1:8001/api/health`
- Dataset download: `http://127.0.0.1:8001/api/dataset/download`

## Key Features

### Predict Page

- Interactive sliders and inputs for study hours, attendance, motivation, assignments, courses, and stress
- Prediction result card with confidence and recommendations
- AI engine badge that turns offline when the browser is offline or the backend health check fails

### Analytics Page

- Live search bar for dataset rows
- Working filter menu for status-based views
- Refresh button that re-downloads the dataset
- Dataset preview drawer with a close control and the full dataset review

### Dataset Overview Page

- Model metrics, feature importance, and confusion matrix visualization
- Profile card with editable name and role

### FAQ Chatbot

- Friendly assistant bubble with formatted replies
- Suggested prompts and quick actions

## API Endpoints

- `GET /api/health` - backend/model health check
- `POST /api/predict` - predict student performance
- `GET /api/metrics` - model metrics
- `GET /api/dataset/download` - download the training CSV
- `POST /api/faq` - FAQ assistant queries

## Training Workflow

You can retrain the model with either workflow:

```powershell
cd "D:\ML project"
python edupredict-ai-backend\scripts\train_model.py
```

or

```powershell
cd "D:\ML project"
python student_marks_prediction.py
```

The notebook `student_marks_prediction.ipynb` is available if you prefer an interactive workflow.

## Notes

- The frontend proxies `/api` requests to `http://127.0.0.1:8001`
- The project favicon is located at `edupredict-ai-frontend/public/favicon.svg`
- Generated build output is not required in source control; rebuild it with `npm run build` when needed
