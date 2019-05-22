from django.contrib.auth.models import AbstractUser
from django.db import models


from ndis_calculator import settings


# Create your models here.


class CustomUser(AbstractUser):
    # add additional fields here
    postcode = models.IntegerField(default=3000)
    birth_year = models.IntegerField(default=2019)


class Goal(models.Model):
    description = models.TextField()


class CategoryList(models.Model):
    name = models.CharField(max_length=255)
    purpose = models.CharField(max_length=255)  # 3 purpose (core, capital, capacity)


class RegistrationGroup(models.Model):
    rg_code = models.CharField(max_length=30)
    rg_name = models.CharField(max_length=255)
    rg_description = models.TextField()
    product_count = models.IntegerField()
    registration_experience = models.TextField()
    registration_professions = models.CharField(max_length=255)


class SupportItemList(models.Model):
    UNIT_CHOICES = (
        ('Each', 'Each'),
        ('Hour', 'Hour'),
        ('Daily', 'Daily'),
        ('Week', 'Week'),
        ('Month', 'Month'),
        ('Annual', 'Annual')
    )

    ref_no = models.IntegerField()
    name = models.CharField(max_length=300)
    isLabour = models.BooleanField()
    unit_of_measurement = models.CharField(max_length=20, choices=UNIT_CHOICES)
    price_limit = models.IntegerField()
    outcome = models.CharField(max_length=255)  # 8 outcomes(Daily living; home; health...)
    category = models.ForeignKey(CategoryList, on_delete=models.CASCADE)
    registration_group = models.ForeignKey(RegistrationGroup, on_delete=models.CASCADE)


class Plan(models.Model):
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    goals = models.ForeignKey(Goal, on_delete=models.SET_NULL, blank=True, null=True)
    categories = models.ManyToManyField(CategoryList, through='PlanContainsCategories')
    support_items = models.ManyToManyField(SupportItemList, through='PlanContainsItems')


class PlanContainsCategories(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    category = models.ForeignKey(CategoryList, on_delete=models.CASCADE)
    amount = models.IntegerField()


class PlanContainsItems(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    support_item = models.ForeignKey(SupportItemList, on_delete=models.CASCADE)
    cost_per_unit = models.IntegerField()
    quantity = models.IntegerField(blank=True, null=True)
    hours_weekday = models.IntegerField(blank=True, null=True)
    hours_weekend = models.IntegerField(blank=True, null=True)
    hours_holiday = models.IntegerField(blank=True, null=True)
    hours_holiday_after_hours = models.IntegerField(blank=True, null=True)
    goal = models.OneToOneField(Goal, on_delete=models.SET_NULL, blank=True, null=True)

