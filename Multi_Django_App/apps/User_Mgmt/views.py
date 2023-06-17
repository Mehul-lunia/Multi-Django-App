import base64
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from allauth.socialaccount.models import SocialAccount
from allauth.account.signals import user_signed_up
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from .models import UserProfile



def index(request):
    if not request.session.exists(request.session.session_key):
        request.session.create()
    print(request.session.get('logged_in'))
    if request.session.get('logged_in') == "True":
        return redirect('/app')
    return render(request, 'first.html')


@login_required
def app_view(request):
    return render(request, 'frontend/index.html')


@api_view(['GET'])
def test(request):
    user = request.user
    is_social = user.socialaccount_set.exists()
    if is_social:
        social_account = SocialAccount.objects.get(user=user)
        extra_data = social_account.extra_data
        if extra_data is not None:
            print(extra_data)
            return Response(extra_data, status=status.HTTP_200_OK)
        return Response({"msg": "not working"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"msg":"not social"},status=status.HTTP_404_NOT_FOUND)


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

        return redirect('/app')
    return render(request, "login.html")

@api_view(['GET'])
def logout_function(request):
    if not request.session.exists(request.session.session_key):
        request.session.create()
    if request.session.get('logged_in'):
        request.session.pop('logged_in')
    logout(request)
    return Response({"msg":"logged out"},status=status.HTTP_200_OK)


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
        if 'profilePic'  in request.FILES :
            image_file = request.FILES["profilePic"]
            image_file_binary = image_file.read()
        else:
            content = open('static/images/th.jpeg','rb')
            image_file_binary = content.read()
            content.close()
            
                
                


        
        user_profile_object = UserProfile()
        user_profile_object.user_username = username
        user_profile_object.profile_picture = image_file_binary
        user_profile_object.save()

        user = User.objects.create_user(
            username=username,
            password=pass1,
            email=email
        )

        user.first_name = fname
        user.last_name = lname
        user.save()

        return redirect('/')
    return render(request, 'signup.html')


def activate_account():
    pass



@api_view(['GET'])
def get_user_details_view(request):
    print(request.user.username)
    curr_user = User.objects.get(username=request.user.username)
    if curr_user is not None:
        username = curr_user.username

        curr_userProfile_object = UserProfile.objects.filter(user_username=username)
        if curr_userProfile_object.exists():
            userProfile_object = curr_userProfile_object[0]
                
            profile_pic_binary = userProfile_object.profile_picture  
            b64 = base64.b64encode(profile_pic_binary).decode('utf-8')
            return Response({"msg":b64,"username":username},status=status.HTTP_200_OK)
        with open('static/images/th.jpeg','rb') as fp:
            profile_pic_binary = fp.read()
        b64 = base64.b64encode(profile_pic_binary).decode('utf-8')
        return Response({"msg":b64,"username":username},status=status.HTTP_200_OK)

    return Response({"msg":"cannot find anything in User Model corresponding to the request"},status=status.HTTP_400_BAD_REQUEST)
