from django.db import models
from django.contrib.auth.models import User

class ChoiceResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    choice = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    previous_choices = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s choice"


class GeneratedImage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.TextField()
    image = models.ImageField(upload_to='generated_images')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s choice"
