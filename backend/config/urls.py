"""
URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URL configuration
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

try:
    from ..app import views
except (ImportError, ModuleNotFoundError):
    from app import views

urlpatterns = [
    # Django admin page
    path('admin/', admin.site.urls),

    # API endpoints
    path('', views.index),
    path('locales/', views.get_locales),
    path(r"eviction/<id>", views.get_eviction_by_id),
    path(r"evictions/", views.get_evictions),
    path(r"evictions/<locale>", views.get_evictions),
    path(r"details/<town>", views.get_eviction_details),
    path(r"statistics/totals", views.get_stats_totals),
    path(r"statistics", views.get_stats_for_tracts),
    path("geodata", views.get_geodata),
]
