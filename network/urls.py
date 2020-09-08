
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("following", views.following, name="following"),

    # API Routes
    path("userIDAPI", views.getUserID, name="getUserID"),
    path("followAPI", views.follow, name="follow"),
    path("posts", views.newpost, name="newpost"),
    path("posts/<int:post_id>", views.post, name="post"),
    path("posts/user/<int:user_id>", views.get_posts, name="get_posts"),
    path("profileAPI/<int:user_id>", views.get_profile, name="get_profile"),
    path("api_update_post/<int:post_id>", views.api_update_post, name="api_update_post"),
    path("api_like_post/<int:post_id>", views.api_like_post, name="api_like_post")
]
