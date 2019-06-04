from django.contrib.auth.models import AbstractUser
from django.db import models


from ndis_calculator import settings


# Create your models here.


class CustomUser(AbstractUser):
    # add additional fields here
    postcode = models.IntegerField()
    birth_year = models.IntegerField()


class Goal(models.Model):
    description = models.TextField()


class CategoryList(models.Model):
    name = models.CharField(max_length=255)
    purpose = models.CharField(max_length=255)  # 3 purpose (core, capital, capacity)


class RegistrationGroup(models.Model):
    code = models.CharField(max_length=30)
    name = models.CharField(max_length=255)
    description = models.TextField()
    product_count = models.IntegerField()
    experience = models.TextField()
    professions = models.CharField(max_length=255)


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
    is_labour = models.BooleanField()
    unit_of_measurement = models.CharField(max_length=20, choices=UNIT_CHOICES)
    price_limit = models.DecimalField(max_digits=15, decimal_places=2)
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
    cost_per_unit = models.DecimalField(max_digits=15, decimal_places=2)
    quantity = models.IntegerField(blank=True, null=True)
    hours_weekday = models.DecimalField(max_digits=4, decimal_places=2)
    hours_weekend = models.DecimalField(max_digits=4, decimal_places=2)
    hours_holiday = models.DecimalField(max_digits=4, decimal_places=2)
    hours_holiday_after_hours = models.DecimalField(max_digits=4, decimal_places=2)
    goal = models.OneToOneField(Goal, on_delete=models.SET_NULL, blank=True, null=True)

