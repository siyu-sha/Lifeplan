from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    # add additional fields here
    address = models.CharField(max_length=255)
    birthday = models.DateField()

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    cost = models.DecimalField(decimal_places=15,max_digits=2)
