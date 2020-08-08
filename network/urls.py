
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("posts", views.newpost, name="newpost"),
    path("posts/<int:post_id>", views.post, name="post"),
    path("posts/user/<int:user_id>", views.get_posts, name="get_posts")
]
