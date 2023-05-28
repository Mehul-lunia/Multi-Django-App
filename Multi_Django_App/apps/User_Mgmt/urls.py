
from django.urls import path
from . views import *

urlpatterns = [
    path('', index, name="index"),
    path('login', login_function, name='login'),
    path('signup', signup, name='signup'),
    path('logout', logout_function, name='logout')

]
