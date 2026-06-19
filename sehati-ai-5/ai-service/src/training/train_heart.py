import os
import joblib
import pandas as pd
import numpy as np
import logging
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from src.preprocessing.pipeline import create_preprocessing_pipeline, load_and_clean_data
from src.training.evaluation import evaluate_and_log_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("train_heart")

def train():
    disease_name = "heart"
    logger.info(f"Starting Heart Disease Model Training Pipeline")
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    data_path = os.path.join(base_dir, f'data/{disease_name}_disease.csv')
    
    if not os.path.exists(data_path):
        logger.warning(f"Mocking data for {disease_name} since no CSV exists.")
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        np.random.seed(42)
        df_mock = pd.DataFrame({
            'Cholesterol': np.random.normal(200, 40, 500),
            'Blood_Pressure': np.random.normal(120, 15, 500),
            'Age': np.random.randint(40, 90, 500),
            'Smoking_Status': np.random.choice(['Yes', 'No', 'Former'], 500),
            'target': np.random.randint(0, 2, 500)
        })
        df_mock.to_csv(data_path, index=False)

    df = load_and_clean_data(data_path, target_col='target')
    
    X = df.drop(columns=['target'])
    y = df['target']
    
    num_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    cat_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
    
    preprocessor = create_preprocessing_pipeline(num_cols, cat_cols)
    
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
    
    X_train_prep = preprocessor.fit_transform(X_train)
    X_val_prep = preprocessor.transform(X_val)
    X_test_prep = preprocessor.transform(X_test)
    
    models = {
        'LogisticRegression': LogisticRegression(max_iter=1000),
        'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42),
        'XGBoost': XGBClassifier(eval_metric='logloss', random_state=42)
    }
    
    best_model = None
    best_roc = -1
    best_name = ""
    
    for name, model in models.items():
        logger.info(f"Training {disease_name} using {name}...")
        model.fit(X_train_prep, y_train)
        
        y_val_pred = model.predict(X_val_prep)
        y_val_prob = model.predict_proba(X_val_prep)[:, 1]
        
        metrics, cm = evaluate_and_log_model(f"{disease_name}_{name}", y_val, y_val_pred, y_val_prob)
        
        if metrics['roc_auc'] > best_roc:
            best_roc = metrics['roc_auc']
            best_model = model
            best_name = name
            
    logger.info(f"Best model selected: {best_name} (ROC AUC: {best_roc:.4f})")
    
    y_test_pred = best_model.predict(X_test_prep)
    y_test_prob = best_model.predict_proba(X_test_prep)[:, 1]
    test_metrics, test_cm = evaluate_and_log_model(f"{disease_name}_{best_name}_TEST", y_test, y_test_pred, y_test_prob)
    
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(preprocessor, os.path.join(models_dir, f'{disease_name}_pipeline.joblib'))
    joblib.dump(best_model, os.path.join(models_dir, f'{disease_name}_model.joblib'))
    logger.info(f"Successfully saved {disease_name} pipeline and model.")

if __name__ == "__main__":
    train()
