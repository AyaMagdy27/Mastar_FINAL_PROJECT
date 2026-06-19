# AI Systems & Predictive Modeling

## Artificial Intelligence Overview

A central pillar of the graduation project is merging complex multi-dimensional analysis with standard EMR structures. Sehati AI introduces predictive overlays, directly calculating disease probability without interrupting clinical duties.

## Inference Algorithms

The underlying structure features a distinct, scalable Python environment hosting mathematically intensive predictive models.

1. **Scikit-learn Base Classifiers (Logistic Regression, Random Forests):** Used to draw clear, interpretable probabilistic lines when observing straight-forward biological markers.
2. **XGBoost Framework:** Leveraged for advanced vector analysis where complex, non-linear relationships exist between disparate features (such as how cholesterol interacts drastically differently based on the specific age and gender curves of the evaluated patient).

## Predictive Modules

### 1. Diabetes Risk Model

- **Analysis Factors:** Hemoglobin A1c percentage, Fasting Blood Sugar stability, BMI, family predispositions, and systemic age inputs.
- **Output Formats:** A direct probability calculation (e.g., typically indicating the % chance of developing formal Type 2 limits in a designated span).

### 2. Hypertension Risk Assessment

- **Analysis Factors:** Historical arrays of Systolic and Diastolic pressure, estimated sodium intake, resting heart rates.
- **Output Formats:** Categorical Risk Stratification mapped to clinical bands (e.g., Elevated, Stage 1, Stage 2, Crisis alert).

### 3. Cardiovascular (Heart Disease) Model

- **Analysis Factors:** Total Serum Cholesterol bounds (LDL/HDL correlations), ECG abnormality representations, generalized chest pain markers, and demographic details.
- **Output Formats:** Comprehensive severity output intended to recommend or avert immediate clinical intervention constraints.

## User Interface Implementation

The frontend surfaces these powerful models intelligently to avoid user exhaustion:

1. **Predictive Forms Engine:** Direct reactive sliders and visual widgets enable a doctor to "what-if" test the parameters dynamically on the dashboard, observing real-time feedback.
2. **Global Alert Thresholds:** By processing all actively loaded metrics through the models, the system consolidates a **High-Risk Patients Alert** array, instantly placing the most compromised individuals at the exact top of the user's dashboard view.
