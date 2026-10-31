from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path("itinerary/", views.itinerary, name="itinerary"),
    path("MyTrip/", views.my_trips, name="my_trips"),
    path("favorites/", views.favorites, name="favorites"),
    path("destinations/", views.destinations, name="destinations"),
    path("reports/", views.reports, name="reports"),
    path("budget/", views.budget, name="budget"),
    path("settings/", views.settings, name="settings"),
    path("expense/", views.expense, name="expense"),
    path("admin-dashboard/", views.admin_dashboard, name="admin_dashboard"),
    path("register/", views.register, name="register"),
    path("help/", views.help_support, name="help_support"),
    path("profile/", views.profile, name="profile"),
    path("notifications/", views.notifications, name="notifications"),
]