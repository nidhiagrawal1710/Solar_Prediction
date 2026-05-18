import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry

# ---------------- SETUP CLIENT ---------------- #
def get_openmeteo_forecast(lat, lon):
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    # ---------------- API PARAMETERS ---------------- #

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": lat,
        "longitude": lon,
        "forecast_days": 7,
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "surface_pressure",
            "wind_speed_10m",
            "precipitation"
        ],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min"
        ],
        "wind_speed_unit": "ms",
        "timezone": "auto"
    }

    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]

    # ---------------- HOURLY DATA ---------------- #

    hourly = response.Hourly()

    hourly_df = pd.DataFrame({
        "datetime": pd.date_range(
            start=pd.to_datetime(hourly.Time() + response.UtcOffsetSeconds(), unit="s", utc=True),
            end=pd.to_datetime(hourly.TimeEnd() + response.UtcOffsetSeconds(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive="left"
        ),
        "temperature": hourly.Variables(0).ValuesAsNumpy(),
        "humidity": hourly.Variables(1).ValuesAsNumpy(),
        "pressure": hourly.Variables(2).ValuesAsNumpy(),
        "wind_speed": hourly.Variables(3).ValuesAsNumpy(),
        "precipitation": hourly.Variables(4).ValuesAsNumpy()
    })

    # Extract date
    hourly_df["date"] = hourly_df["datetime"].dt.date

    # ---------------- DAILY AVERAGE CALCULATION ---------------- #

    daily_avg_df = hourly_df.groupby("date").agg({
        "temperature": "mean",
        "humidity": "mean",
        "pressure": "mean",
        "wind_speed": "mean",
        "precipitation": "sum"   # Important → rainfall is cumulative
    }).reset_index()

    # ---------------- DAILY MAX/MIN FROM API ---------------- #

    daily = response.Daily()

    daily_df = pd.DataFrame({
        "date": pd.date_range(
            start=pd.to_datetime(daily.Time() + response.UtcOffsetSeconds(), unit="s", utc=True),
            end=pd.to_datetime(daily.TimeEnd() + response.UtcOffsetSeconds(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=daily.Interval()),
            inclusive="left"
        ).date,
        "temp_max": daily.Variables(0).ValuesAsNumpy(),
        "temp_min": daily.Variables(1).ValuesAsNumpy()
    })

    # ---------------- MERGE ---------------- #

    final_df = daily_avg_df.merge(daily_df, on="date", how="left")

    # Sort by date
    final_df = final_df.sort_values("date")

    print("\nDaily Averaged ML Ready Data\n")
    print(final_df)
    return(final_df)