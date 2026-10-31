from django.contrib import admin
from django.urls import path , include
from Travel import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('', include('Travel.urls')),
    path("accounts/", include("allauth.urls")),
]