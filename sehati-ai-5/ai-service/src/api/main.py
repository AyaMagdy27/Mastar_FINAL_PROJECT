from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any
from src.prediction.predict import predict_diabetes, predict_heart_disease, predict_hypertension

app = FastAPI(
    title="Clinical Information System AI Service",
    description="Production-ready API for Clinical Machine Learning Models",
    version="1.0.0"
)

class PredictRequest(BaseModel):
    features: Dict[str, Any] = Field(
        ..., 
        description="Dictionary of patient features for the model.",
        example={"Age": 45, "BMI": 28.5, "HbA1c": 6.2, "Family_History": "Yes"}
    )

@app.post("/predict/diabetes", summary="Predict Diabetes Risk")
async def api_predict_diabetes(req: PredictRequest):
    try:
        return predict_diabetes(req.features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/heart", summary="Predict Heart Disease Risk")
async def api_predict_heart(req: PredictRequest):
    try:
        return predict_heart_disease(req.features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/hypertension", summary="Predict Hypertension Risk")
async def api_predict_hypertension(req: PredictRequest):
    try:
        return predict_hypertension(req.features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health", summary="Health Check")
def health_check():
    return {"status": "healthy", "service": "clinical-ai-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
