from django.db import models

class UserProfile(models.Model):
    user_username = models.CharField(max_length=50)
    profile_picture = models.BinaryField()
