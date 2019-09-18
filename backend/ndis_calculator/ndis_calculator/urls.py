"""ndis_calculator URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from budgeting.views import (
    Authentication,
    DefaultView,
    ParticipantView,
    PlanCategoryViewSet,
    PlanItemView,
    PlanViewSet,
    RegistrationGroupViewSet,
    SupportGroupViewSet,
    SupportItemGroupViewSet,
    SupportItemViewSet,
)
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt import views as jwt_views

plan_list = PlanViewSet.as_view({"get": "list", "post": "create"})
plan_detail = PlanViewSet.as_view(
    {
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }
)

support_group_list = SupportGroupViewSet.as_view({"get": "list"})

support_item_list = SupportItemViewSet.as_view({"get": "list"})
support_item_group_list = SupportItemGroupViewSet.as_view({"get": "list"})
registration_group_list = RegistrationGroupViewSet.as_view({"get": "list"})

api_patterns = [
    # JWT
    path(
        "auth/login",
        jwt_views.TokenObtainPairView.as_view(),
        name="auth_login",
    ),
    path(
        "auth/refresh",
        jwt_views.TokenRefreshView.as_view(),
        name="auth_refresh",
    ),
    path("auth/register", Authentication.register, name="auth_register"),
    path(
        "participants/current-user",
        ParticipantView.current_user,
        name="participant_current_user",
    ),
    path(
        "participant/<int:pk>",
        ParticipantView.update,
        name="participant_update",
    ),
    path("support-groups", support_group_list, name="support_group_list"),
    path("support-items", support_item_list, name="support_items_list"),
    path(
        "support-item-groups",
        support_item_group_list,
        name="support_item_group_list",
    ),
    path(
        "participants/<int:participantID>/plan-categories/<int:planCategoryID>/plan-items",
        PlanItemView.create,
        name="plan_item_create",
    ),
    path("plan", plan_list, name="plan_list"),
    path("plan/<int:pk>", plan_detail, name="plan_detail"),
    path(
        "plan/category/create",
        PlanCategoryViewSet.create,
        name="plan_category_create",
    ),
    path(
        "registration-groups",
        registration_group_list,
        name="registration_group_list",
    ),
]

urlpatterns = [
    # Django admin
    path("admin", admin.site.urls),
    # API
    path("api/v1/", include(api_patterns)),
    # Health Check
    path("healthCheck", DefaultView.as_view(), name="healthCheck"),
    # App
    path("", DefaultView.as_view(), name="landing"),
    # url(r'^api-auth/', include('rest_framework.urls'))
]
