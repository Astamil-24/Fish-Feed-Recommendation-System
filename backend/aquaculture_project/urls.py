"""
URL configuration for aquaculture_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
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
from aquaculture import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/csrf/',views.csrf_token,name='csrf_token'),
    path('api/vendor/login/',views.vendor_login,name='vendor_login'),
    path('api/vendor/logout/',views.vendor_logout,name='vendor_logout'),
    path('api/vendor/current/',views.current_vendor,name='current_vendor'),
    path('api/vendor/signup/',views.vendor_signup,name='vendor_signup'),
    path('api/recommend/', views.recommend, name='recommend'),
    path('api/fish/', views.fish_list, name='fish_list'),
    path('api/food/', views.food_list, name='food_list'),
    path('api/available-food/',views.available_food_list,name='available_food_list'),
    path('api/add-food-waste/',views.add_food_waste,name='add_food_waste'),
    path('api/delete-food-waste/<int:food_waste_id>/',views.delete_food_waste,name='delete_food_waste'),
    path('api/update-food-waste/<int:food_waste_id>/',views.update_food_waste,name='update_food_waste'),
]
