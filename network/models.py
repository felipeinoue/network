from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    content = models.CharField(max_length=5000)
    timestamp = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "owner_id": self.owner.id
        }

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followed")

    def __str__(self):
        return f"{self.follower} is following {self.followed}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post")

    def __str__(self):
        return f"{self.user} liked the {self.post.id}"