from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    # add additional fields here
    address = models.CharField(max_length=255)  # change address to postcode, but table disappeared??
    birthday = models.DateField()  # change birthday to yearOfBirth, but table disappeared??

class Plan(models.Model):
    start_time = models.DateField()
    end_time = models.DateField()
    total_funds = models.IntegerField()

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    cost = models.DecimalField(max_digits=15,decimal_places=2)

class Category(models.Model):
    name = models.CharField(max_length=255)

class Goal(models.Model):
    description = models.TextField()