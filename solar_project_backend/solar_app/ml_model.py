import joblib
import pandas as pd


# ---------------- LOAD MODEL ---------------- #

model = joblib.load("solar_app/predicting_Solar_Irradiance_model_old.pkl")

FEATURE_COLUMNS = [
    "Year","Month","Day",
    "Humidity","Precipitation","Temprature",
    "MAX_Temp","MIN_Temp",
    "Pressure","Wind_Speed","AQI"
]


# ---------------- SINGLE RECORD PREDICTION ---------------- #

def predict_solar_irradiance(record: dict):
    df = pd.DataFrame([[record[col] for col in FEATURE_COLUMNS]],
                      columns=FEATURE_COLUMNS)
    prediction = model.predict(df)
    return prediction[0]


# ---------------- 7 DAY FORECAST PREDICTION ---------------- #

def predict_7day_forecast(hourly_forecast_df: pd.DataFrame, aqi_value: float):
    """
    hourly_forecast_df → DataFrame from Open-Meteo (final_df)
    aqi_value → Current AQI (since AQI forecast not available)

    Returns:
        DataFrame with hourly solar irradiance predictions
    """

    predictions = []

    for _, row in hourly_forecast_df.iterrows():

        record = {
            "Year": row["datetime"].year,
            "Month": row["datetime"].month,
            "Day": row["datetime"].day,

            "Humidity": row["humidity"],
            "Precipitation": row["precipitation"],
            "Temprature": row["temperature"],   # keep spelling same as training
            "MAX_Temp": row["temp_max"],
            "MIN_Temp": row["temp_min"],
            "Pressure": row["pressure"],
            "Wind_Speed": row["wind_speed"],
            "AQI": aqi_value
        }

        irradiance = predict_solar_irradiance(record)

        predictions.append({
            "datetime": row["datetime"],
            "solar_irradiance": irradiance
        })

    return pd.DataFrame(predictions)