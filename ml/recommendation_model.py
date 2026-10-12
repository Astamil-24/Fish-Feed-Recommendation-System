import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "trained_model.pkl")
model = joblib.load(model_path)

def predict_suitability(water_type, feeding_type, food_type):

    new_data = pd.DataFrame([
        {
            "water_type": water_type,
            "feeding_type": feeding_type,
            "food_type": food_type
        }
    ])

    new_data = pd.get_dummies(new_data)

    new_data = new_data.reindex(
        columns=model.feature_names_in_,
        fill_value=0
    )

    prediction = model.predict(new_data)

    return prediction[0]
