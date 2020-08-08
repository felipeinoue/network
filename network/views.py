import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from .models import User, Follow, Like, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def newpost(request):

    # Postings a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check if content is not empty
    data = json.loads(request.body)
    if data.get('content') == '':
        return JsonResponse({
            "error": "Content should not be empty."
        }, status=412)

    # Create Post
    content = data.get('content')
    user = request.user
    post = Post(
        content = content,
        owner = user
    )
    post.save()

    return JsonResponse({"message": "Post saved successfully."}, status=201)

@login_required
def post(request, post_id):

    # Query for requested post
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Return post contents
    if request.method == "GET":
        return JsonResponse(post.serialize())

    # Post must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@login_required
def get_posts(request, user_id):

    # Get all the posts
    if user_id == 0:
        posts = Post.objects.all()
    # Filter posts returned by user
    elif user_id != 0:
        posts = Post.objects.filter(owner=user_id)
    else:
        return JsonResponse({"error": "Invalid mailbox."}, status=400)

    # Return posts in reverse chronologial order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

def profile(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user_dic = []
        user_dic.append(user.serialize())
        return render(request, "network/profile.html", {
            "first_name": user_dic[0]['first_name'],
            "following": user_dic[0]['following'],
            "followed_by": user_dic[0]['followed_by']
        })
    except:
        return HttpResponse('Error: Profile doesnt exist.')

@login_required
def get_profile(request, user_id):

    # Query for requested profile
    try:
        profile = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "Profile not found."}, status=404)

    # Return profile contents
    if request.method == "GET":
        return JsonResponse(profile.serialize())

    # Profile must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
