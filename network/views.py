import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import User, Follow, Like, Post


def index(request):
    try:
        user = User.objects.get(pk=request.user.id).serialize()
        return render(request, "network/index.html", {
            "user_json": user,
            "actual_page": 'all'
        })
    except:
        return render(request, "network/index.html", {
            "actual_page": 'all'
        })


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
def api_update_post(request, post_id):

    # Update a post must be via PUT
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    # Query for requested post
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Check if user is the owner of the post
    if post.owner.id != request.user.id:
        return JsonResponse({"error": "Cannot edit. User is not the owner of this post."}, status=403)

    # Update post
    data = json.loads(request.body)
    post.content = data["content"]
    post.save()
    return JsonResponse({"message": "Post updated successfully."}, status=201)


@login_required
def api_like_post(request, post_id):

    # Like a post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
        
    # User should not have liked this post already
    try:
        like = Like.objects.get(user=request.user.id, post=post_id)
        like.delete()
        return JsonResponse({"message": "Like deleted successfully."}, status=201)
    except Like.DoesNotExist:
        pass

    # Check if post exists
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post doesn't exist."}, status=404)

    # Like the post
    like = Like(
        user = request.user,
        post = post
    )
    like.save()
    return JsonResponse({"message": "Like saved successfully."}, status=201)


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


def get_posts(request, user_id):

    # Get all the posts
    if request.GET.get("method") == "all":
        objects = Post.objects.all()
    # Filter posts returned by user profile
    elif request.GET.get("method") == "profile":
        objects = Post.objects.filter(owner=user_id)
    # Filter posts returned by user following
    elif request.GET.get("method") == "following":
        ls = []
        user = User.objects.get(pk=user_id).serialize()
        for follow in user['following']:
            ls.append(follow)
        
        objects = Post.objects.filter(owner__in=ls)
    else:
        return JsonResponse({"error": "Invalid user id."}, status=400)

    # Return posts in reverse chronologial order
    objects = objects.order_by("-timestamp").all()
    p = Paginator(objects, 10)
    posts = p.page(request.GET.get("page")).object_list

    return JsonResponse(
        {
            "count": 0,
            "next": "",
            "previous": "",
            "total": p.num_pages,
            "results": [post.serialize() for post in posts]
        }, 
        safe=False)


def profile(request, user_id):
    try:
        user_json = User.objects.get(pk=request.user.id).serialize()
        user = User.objects.get(pk=user_id)
        user_dic = []
        user_dic.append(user.serialize())
        return render(request, "network/profile.html", {
            "user_json": user_json,
            "first_name": user_dic[0]['first_name'],
            "following_count": len(user_dic[0]['following']),
            "followers_count": len(user_dic[0]['followers']),
            "actual_page": 'profile'
        })
    except:
        return HttpResponse('Error: Profile doesnt exist.')


def get_profile(request, user_id):

    # Query for requested profile
    try:
        profile = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "Profile not found."}, status=404)

    # Return profile contents
    if request.method == "GET":
        return JsonResponse(profile.serialize(), status=200)

    # Profile must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


def getUserID(request):
    if request.user.is_authenticated:
        return JsonResponse({"id": request.user.id}, status=200)
    else:
        return JsonResponse({"error": "user not found."}, status=404)


@login_required
def follow(request):
    data = json.loads(request.body)

    if request.method == "POST":
        try:
            follow = Follow.objects.get(
                follower=data.get("follower"), 
                followed=data.get("followed")
            )
            return JsonResponse({"message": "Can not follow. User is already following this profile."}, status=400)
        except:
            follower = User.objects.get(pk=data.get("follower"))
            followed = User.objects.get(pk=data.get("followed"))
            follow = Follow(
                follower=follower,
                followed=followed
            )
            follow.save()
            return JsonResponse({"message": "Following action done successfully."}, status=201)
    elif request.method == "DELETE":
        try:
            follow = Follow.objects.get(
                follower=data.get("follower"), 
                followed=data.get("followed")
            )
            follow.delete()
            return JsonResponse({"message": "Stop following action done successfully."}, status=201)
        except:
            return JsonResponse({"message": "Can not stop following. User is not following this profile."}, status=400)


@login_required
def following(request):
    user = User.objects.get(pk=request.user.id).serialize()
    return render(request, "network/following.html", {
        "user_json": user,
        "actual_page": 'following'
    })
