from django.db import models
from django.contrib.auth.models import User

class VendorProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE
    )
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return self.user.username
class Fish(models.Model):
    fish_name = models.CharField(max_length=100)
    water_type = models.CharField(max_length=50)
    feeding_type = models.CharField(max_length=100)
    def __str__(self):
        return self.fish_name

class Food(models.Model):
    food_name = models.CharField(max_length=100)
    food_type = models.CharField(max_length=50)
    def __str__(self):
        return self.food_name

class FoodWaste(models.Model):
    vendor = models.ForeignKey(User,on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity_kg = models.FloatField()
    collection_location = models.CharField(
        max_length=255,
        default="")
    def __str__(self):
        return f"{self.food} - {self.quantity_kg} kg"

class ArtificialFeed(models.Model):
    feed_name = models.CharField(max_length=100)
    feeding_type = models.CharField(max_length=100 ,  default="")
    def __str__(self):
        return self.feed_name
