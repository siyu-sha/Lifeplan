from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    # add additional fields here
    address = models.CharField(max_length=255)
    birthday = models.DateField()
