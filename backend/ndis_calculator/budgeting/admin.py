from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Category, SupportItem, Plan, Budgeting, Goal


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'first_name', 'last_name', 'postcode', 'birth_year']


admin.site.register(CustomUser, CustomUserAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']


admin.site.register(Category, CategoryAdmin)


class SupportItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'cost']


admin.site.register(SupportItem, SupportItemAdmin)


class PlanAdmin(admin.ModelAdmin):
    list_display = ['customer', 'start_time', 'end_time', 'total_funds']


admin.site.register(Plan, PlanAdmin)


class BudgetingAdmin(admin.ModelAdmin):
    list_display = ['num_item', 'cost_per_unit', 'weekday_7_7',
                    'after_hour_weekend', 'holiday_7_7', 'holiday_after_hour']


admin.site.register(Budgeting, BudgetingAdmin)


class GoalAdmin(admin.ModelAdmin):
    list_display = ['customer', 'type', 'description',
                    'how_to_achieve', 'how_to_support']


admin.site.register(Goal, GoalAdmin)
