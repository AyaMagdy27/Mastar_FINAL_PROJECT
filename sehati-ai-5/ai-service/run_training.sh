#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)

echo "--- Generating datasets and training ---"

echo "[1/3] Training Diabetes Model..."
python src/training/train_diabetes.py

echo "[2/3] Training Heart Disease Model..."
python src/training/train_heart.py

echo "[3/3] Training Hypertension Model..."
python src/training/train_hypertension.py

echo "--- All training pipelines completed successfully ---"
