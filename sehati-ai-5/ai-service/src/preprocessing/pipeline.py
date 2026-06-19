import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import logging

logger = logging.getLogger(__name__)

def create_preprocessing_pipeline(num_cols, cat_cols):
    """
    Creates a scikit-learn ColumnTransformer that handles missing values,
    normalizes numerical features, and encodes categorical variables.
    """
    # 3. Handle missing values & 6. Normalize numerical features
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # 3. Handle missing values & 5. Encode categorical variables
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, num_cols),
            ('cat', categorical_transformer, cat_cols)
        ])
    return preprocessor

def load_and_clean_data(file_path: str, target_col: str = 'target'):
    """
    1. Load dataset
    2. Validate data
    4. Remove duplicates
    """
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise

    if df.empty:
        raise ValueError("Data file is empty.")
        
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' is missing from the dataset.")

    # 4. Remove duplicates
    initial_len = len(df)
    df = df.drop_duplicates()
    logger.info(f"Removed {initial_len - len(df)} duplicate rows.")
    
    return df
