from django.urls import path
from . import views

urlpatterns = [
    # Combined Solar + Financial API
    # path('api/solar-financials/', views.get_financials, name='solar_financials'),

    # Optional: keep separate solar prediction API if needed
    path('api/solar-prediction/', views.get_solar_prediction, name='solar_prediction'),
    path('api/forecasting-prediction/', views.get_7day_daily_solar_forecast, name='forecasting_prediction'),
]
