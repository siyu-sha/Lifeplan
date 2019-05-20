from django.contrib.auth.models import AbstractUser
from django.db import models
from ndis_calculator import settings
# Create your models here.


class CustomUser(AbstractUser):
    # add additional fields here
    postcode = models.IntegerField()
    birth_year = models.IntegerField()


class Category(models.Model):
    name = models.CharField(max_length=255)


class SupportItem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    cost = models.DecimalField(max_digits=15, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)


class Plan(models.Model):
    start_time = models.DateField()
    end_time = models.DateField()
    total_funds = models.IntegerField()
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ManyToManyField(SupportItem, through='Budgeting')


class Budgeting(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    item = models.ForeignKey(SupportItem, on_delete=models.CASCADE)
    num_item = models.IntegerField()
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
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
