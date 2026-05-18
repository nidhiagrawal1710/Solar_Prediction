

from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from datetime import datetime
import requests
from .aqi_calculator import calculate_current_aqi
from .ml_model import predict_solar_irradiance
from .Forecasting import get_openmeteo_forecast
import pandas as pd

API_KEY = settings.API_KEY


# ---------------- HELPER FUNCTIONS ----------------

# 1. Get weather data
def get_weather(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}"
    data = requests.get(url).json()
    try:
        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        pressure = data["main"]["pressure"]
        wind_speed = data["wind"]["speed"]
        temp_min = data["main"]["temp_min"]
        temp_max = data["main"]["temp_max"]
        precipitation = data.get("rain", {}).get("1h", 0.0)
    except KeyError:
        return None
    return {
        "temperature": temp,
        "humidity": humidity,
        "pressure": pressure,
        "wind_speed": wind_speed,
        "temp_min": temp_min,
        "temp_max": temp_max,
        "precipitation": precipitation,
    }

# 2. Get AQI data
def get_aqi(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    data = requests.get(url).json()
    try:
        aqi = data["list"][0]["main"]["aqi"]
        PM2_5 = data["list"][0]["components"]["pm2_5"]
        PM10 = data["list"][0]["components"]["pm10"]
        NO2 = data["list"][0]["components"]["no2"]
        SO2 = data["list"][0]["components"]["so2"]
        CO = data["list"][0]["components"]["co"]
        Ozone = data["list"][0]["components"]["o3"]
    except (KeyError, IndexError):
        return None
    return {
        "aqi": aqi,
        "PM2_5": PM2_5,
        "PM10": PM10,
        "NO2": NO2,
        "SO2": SO2,
        "CO": CO,
        "Ozone": Ozone,
    }

# 3. Calculate solar energy
def calculate_solar_energy(solar_irradiance, panel_area, efficiency=0.18):
    return solar_irradiance * panel_area * efficiency


def calculate_co2_offset(solar_energy, emission_factor=0.82):
    """
    Calculate CO2 offset from solar energy.
    
    Parameters:
    - solar_energy_kwh_per_m2: Solar energy received per m² per day (kWh/m²/day)
    - panel_area_m2: Total area of solar panels in m²
    - emission_factor: Grid emission factor in kg CO2/kWh (default 0.82)
    
    Returns:
    - CO2 offset in kg/day
    """

    co2_saved = solar_energy * emission_factor
    return co2_saved


def get_7day_daily_solar_forecast(request):
    try:
        lat = float(request.GET.get("lat"))
        lon = float(request.GET.get("lon"))
        panel_area = float(request.GET.get("panel_area"))
    except (TypeError, ValueError):
        return JsonResponse(
            {"error": "Invalid or missing lat/lon/panel_area"},
            status=400
        )

    # ---------------- STEP 1 → GET DAILY AVERAGED WEATHER ---------------- #
    weather_df = get_openmeteo_forecast(lat, lon)

    if weather_df is None or weather_df.empty:
        return JsonResponse(
            {"error": "Could not fetch forecast weather"},
            status=500
        )

    # ---------------- STEP 2 → GET CURRENT AQI ---------------- #
    air = get_aqi(lat, lon)
    if not air:
        return JsonResponse({"error": "Could not fetch AQI data"}, status=500)

    aqi_result = calculate_current_aqi(air)
    current_aqi = aqi_result["AQI"]

    # ---------------- STEP 3 → DAILY PREDICTION ---------------- #
    results = []
    total_energy = 0

    for _, row in weather_df.iterrows():

        date_obj = pd.to_datetime(row["date"])

        record = {
            "Year": date_obj.year,
            "Month": date_obj.month,
            "Day": date_obj.day,
            "Humidity": row["humidity"],
            "Precipitation": row["precipitation"],
            "Temprature": row["temperature"],
            "MAX_Temp": row["temp_max"],
            "MIN_Temp": row["temp_min"],
            "Pressure": row["pressure"],
            "Wind_Speed": row["wind_speed"],
            "AQI": current_aqi
        }

        solar_irradiance = predict_solar_irradiance(record)
        solar_energy = calculate_solar_energy(solar_irradiance, panel_area)
        co2_offset = calculate_co2_offset(solar_energy)

        total_energy += solar_energy

        results.append({
            "date": date_obj.strftime("%Y-%m-%d"),
            "day": date_obj.strftime("%a"),   # Mon, Tue, Wed
            "solar_irradiance": round(solar_irradiance, 2),
            "solar_energy": round(solar_energy, 2),
            "co2_offset": round(co2_offset, 2)
        })

    # ---------------- STEP 4 → SUMMARY CALCULATIONS ---------------- #

    avg_daily_output = total_energy / len(results)

    peak_day_data = max(results, key=lambda x: x["solar_energy"])

    response_data = {
        "daily_forecast": results,
        "summary": {
            "avg_daily_output": round(avg_daily_output, 2),
            "total_weekly_output": round(total_energy, 2),
            "peak_day": peak_day_data["day"],
            "peak_day_energy": peak_day_data["solar_energy"]
        }
    }

    return JsonResponse(response_data)
    # ---------------- FINAL RESPONSE ---------------- #
    return JsonResponse({
        "panel_area": panel_area,
        "efficiency": 0.18,
        "aqi_used_for_forecast": current_aqi,
        "forecast": results
    })



# ---------------- MAIN VIEW ----------------

def get_solar_prediction(request):
    try:
        # Get input params from user
        lat = float(request.GET.get("lat"))
        lon = float(request.GET.get("lon"))
        panel_area = float(request.GET.get("panel_area"))   # ✅ required
    except (TypeError, ValueError):
        return JsonResponse(
            {"error": "Invalid or missing lat/lon/panel_area"}, status=400
        )

    # --- Weather + AQI ---
    weather = get_weather(lat, lon)
    air = get_aqi(lat, lon)
    if not weather or not air:
        return JsonResponse({"error": "Could not fetch data"}, status=500)

    # --- AQI calculation ---
    aqi_result = calculate_current_aqi(air)

    # --- Prepare record for ML model ---
    now = datetime.now()
    record = {
        "Year": now.year,
        "Month": now.month,
        "Day": now.day,
        "Humidity": weather["humidity"],
        "Precipitation": weather["precipitation"],
        "Temprature": round(weather["temperature"], 2),
        "MAX_Temp": round(weather["temp_max"], 2),
        "MIN_Temp": round(weather["temp_min"], 2),
        "Pressure": weather["pressure"],
        "Wind_Speed": weather["wind_speed"],
        "AQI": aqi_result["AQI"],
    }

    # --- Predict solar irradiance using ML model ---
    solar_irradiance = predict_solar_irradiance(record)

    # --- Calculate solar energy (user panel area) ---
    solar_energy = calculate_solar_energy(solar_irradiance, panel_area)
    solar_energy =solar_energy
    co2_offset =calculate_co2_offset(solar_energy)

    # --- Return response as JSON ---
    return JsonResponse({
        "solar_irradiance": solar_irradiance,
        "solar_energy": solar_energy,
        "panel_area": panel_area,
        "efficiency": 0.18,
        "weather": weather,
        "aqi": aqi_result,
        "co2_offset": co2_offset
    })


