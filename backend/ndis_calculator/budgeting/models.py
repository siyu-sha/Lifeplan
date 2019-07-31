from django.contrib.auth.models import AbstractUser
from django.db import models
from .validators import *
from ndis_calculator import settings


# Create your models here.


class Participant(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    postcode = models.CharField(max_length=4, validators=[validate_postcode])
    birth_year = models.IntegerField(validators=[validate_birth_year])
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('id',)


# a static table stores all groups, e.g. Core.
# Participants cannot manipulate data in this table, but they can retrieve data
class SupportGroup(models.Model):
    name = models.CharField(max_length=255)


class SupportCategory(models.Model):
    support_group = models.ForeignKey(SupportGroup, on_delete=models.PROTECT)

    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)


class SupportItem(models.Model):
    EACH = 'EA'
    HOUR = 'H'
    DAY = 'D'
    WEEK = 'WK'
    MONTH = 'MON'
    YEAR = 'YR'

    UNIT_CHOICES = [
        (EACH, 'each'),
        (HOUR, 'hour'),
        (DAY, 'day'),
        (WEEK, 'week'),
        (MONTH, 'month'),
        (YEAR, 'year'),
    ]

    support_category = models.ForeignKey(SupportCategory, on_delete=models.PROTECT)
    registration_group = models.ForeignKey('RegistrationGroup', on_delete=models.PROTECT)

    name = models.CharField(max_length=255)
    number = models.CharField(max_length=255, unique=True)
    description = models.TextField(default="No description provided")
    unit = models.CharField(max_length=3, choices=UNIT_CHOICES)
    price_NA_SA_TAS_WA = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    price_ACT_NSW_QLD_VIC = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    price_national = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    price_remote = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    price_very_remote = models.DecimalField(max_digits=10, decimal_places=2, null=True)


class RegistrationGroup(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)


class Plan(models.Model):
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)

    start_date = models.DateField()
    end_date = models.DateField()
    generated = models.BooleanField(default=False)

    goals = models.ManyToManyField('Goal', through='PlanGoal')
    support_categories = models.ManyToManyField(SupportCategory, through='PlanCategory')


class Goal(models.Model):
    description = models.TextField()


class PlanGoal(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)

    priority = models.IntegerField(default=0)


class PlanCategory(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    support_category = models.ForeignKey(SupportCategory, on_delete=models.PROTECT)

    budget = models.DecimalField(max_digits=10, decimal_places=2)


class PlanItem(models.Model):
    plan_category = models.ForeignKey(PlanCategory, on_delete=models.CASCADE)
    support_item = models.ForeignKey(SupportItem, on_delete=models.PROTECT)
    plan_goal = models.ForeignKey(PlanGoal, on_delete=models.SET_NULL, null=True)

    quantity = models.DecimalField(max_digits=10, decimal_places=1)
    price_actual = models.DecimalField(max_digits=10, decimal_places=2)
