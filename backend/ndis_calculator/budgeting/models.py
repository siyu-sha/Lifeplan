from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class CustomUser(AbstractUser):
    # add additional fields here
    address = models.CharField(max_length=255)  # change address to postcode, but table disappeared??
    birthday = models.DateField()  # change birthday to yearOfBirth, but table disappeared??

class Category(models.Model):
    name = models.CharField(max_length=255)


class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    cost = models.DecimalField(max_digits=15, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)


class Plan(models.Model):
    start_time = models.DateField()
    end_time = models.DateField()
    total_funds = models.IntegerField()
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    item = models.ManyToManyField(Item, through='Budgeting')


class Budgeting(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    count = models.IntegerField()
    cost_per_unit = models.IntegerField()
    weekday_7_7 = models.DecimalField(max_digits=15, decimal_places=2)
    after_hour_weekend = models.DecimalField(max_digits=15, decimal_places=2)
    holiday_7_7 = models.DecimalField(max_digits=15, decimal_places=2)
    holiday_after_hour = models.DecimalField(max_digits=15, decimal_places=2)


class Goal(models.Model):
    type = models.CharField(max_length=255)
    description = models.TextField()
    how_to_achieve = models.TextField()
    how_to_support = models.TextField()
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

