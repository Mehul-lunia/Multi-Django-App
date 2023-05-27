from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


def index(request):
    return render(request,'first.html')

def login(request):
    if request.method == 'POST':
        #if successful log-in , redirects to app's html page
        pass
    return render(request,'login.html')

def logout(request):
    pass

def signup(request):
    if request.method == 'POST':
        #if successful sign-up , redirects to app's html page
        pass
    return render(request,'signup.html')

def activate_account():
    pass
