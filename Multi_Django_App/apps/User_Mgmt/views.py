from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages


def index(request):
    if not request.session.exists(request.session.session_key):
        request.session.create()
    print(request.session.get('logged_in'))
    if request.session.get('logged_in') == "True":
        return render(request, 'frontend/index.html')
    return render(request, 'first.html')


def login_function(request):
    if not request.session.exists(request.session.session_key):
        request.session.create()

    if request.method == 'POST':
        # if successful log-in,redirect to apps html page
        username = request.POST.get('username')
        pass1 = request.POST.get('pass1')

        user = authenticate(username=username, password=pass1)

        if user is not None:
            request.session['logged_in'] = "True"
            print(request.session.get('logged_in'))
            login(request, user)

        return render(request, "frontend/index.html")
    return render(request, "login.html")


def logout_function(request):
    request.session.pop('logged_in')
    logout(request)
    messages.success(request, "Successfully logged out!")


def signup(request):
    if request.method == 'POST':
        # if successful registration , redirects to login page
        username = request.POST.get('username')
        fname = request.POST.get('fname')
        lname = request.POST.get('lname')
        email = request.POST.get('email')
        pass1 = request.POST.get('pass1')
        pass2 = request.POST.get('pass2')

        if User.objects.filter(username=username):
            messages.error(request, "This username is already taken!!")
            return redirect('/')

        if User.objects.filter(email=email):
            messages.error(request, "This Email is already taken")
            return redirect('/')

        if pass1 != pass2:
            messages.error(
                request, "You entered different passwords for password1 and password2")
            return redirect('/')

        if User.objects.filter(email=email):
            messages.error(request, "The E-mail you entered is already taken")
            return redirect('/')

        user = User.objects.create_user(
            username=username,
            password=pass1,
            email=email
        )

        user.first_name = fname
        user.last_name = lname
        user.save()

        return redirect('/login')
    return render(request, 'signup.html')


def activate_account():
    pass
