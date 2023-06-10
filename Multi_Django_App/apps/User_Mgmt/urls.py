
from django.urls import path
from . views import *

urlpatterns = [
    # path('', index, name="index"),
    path('', login_function, name='login'),
    path('signup', signup, name='signup'),
    path('logout', logout_function, name='logout'),
    path('app', app_view, name="app_view"),
    path('app/speech',app_view),
    path('app/ecomm',app_view),
    path('app/about',app_view),
    path('test', test, name="test"),

]
