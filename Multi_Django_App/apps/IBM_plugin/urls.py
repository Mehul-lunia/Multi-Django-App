
from django.urls import path
from . views import *

urlpatterns = [
    path("",index,name="index"),
    path('execute', execute, name="execute"),
    path('historical-translations',historicalTranslation,name="historical_translations")
]
