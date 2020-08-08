from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    content = models.CharField(max_length=5000)
    timestamp = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")

    def serialize(self):
        likes = Like.objects.filter(post=self.id).count()
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%B %d"),
            "owner_id": self.owner.id,
            "owner_name": self.owner.first_name,
            "likes": likes
        }

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followed")

    def __str__(self):
        return f"{self.follower.first_name} -> {self.followed.first_name}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post")

    def __str__(self):
        return f"{self.user.first_name} liked the post [{self.post.id}] from {self.post.owner.first_name}"