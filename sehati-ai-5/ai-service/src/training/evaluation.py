import mlflow
import json
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)
import logging

logger = logging.getLogger(__name__)

def evaluate_and_log_model(model_name: str, y_true, y_pred, y_prob):
    """
    9. Compare model performance
    11. Evaluate using Accuracy, Precision, Recall, F1 Score, ROC-AUC
    12. Generate confusion matrix
    13. Save metrics to MLflow
    """
    metrics = {
        'accuracy': accuracy_score(y_true, y_pred),
        'precision': precision_score(y_true, y_pred, zero_division=0),
        'recall': recall_score(y_true, y_pred, zero_division=0),
        'f1': f1_score(y_true, y_pred, zero_division=0),
        'roc_auc': roc_auc_score(y_true, y_prob) if len(np.unique(y_true)) > 1 else 0.0
    }
    
    cm = confusion_matrix(y_true, y_pred).tolist()
    
    logger.info(f"[{model_name}] Evaluation Metrics:")
    for k, v in metrics.items():
        logger.info(f"  {k}: {v:.4f}")
    logger.info(f"  confusion_matrix: {cm}")
    
    # 13. Save metrics to MLflow
    try:
        with mlflow.start_run(run_name=model_name, nested=True):
            mlflow.log_metrics(metrics)
            mlflow.log_dict({"confusion_matrix": cm}, f"{model_name}_cm.json")
    except Exception as e:
        logger.warning(f"Could not log to MLflow (is tracking URI set?): {e}")
        
    return metrics, cm
