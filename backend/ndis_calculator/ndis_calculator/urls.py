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
from django.contrib import admin
from django.urls import path
from django.urls import re_path
from django.urls import include
from rest_framework_simplejwt import views as jwt_views
from budgeting import views

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # JWT
    path('api/auth/login/', jwt_views.TokenObtainPairView.as_view(), name='auth_login'),
    path('api/auth/refresh/', jwt_views.TokenRefreshView.as_view(), name='auth_refresh'),

    # App
    path('hello/', views.HelloView.as_view(), name='hello'),
    # re_path(r'api-auth/', include('rest_framework.urls')),
]
