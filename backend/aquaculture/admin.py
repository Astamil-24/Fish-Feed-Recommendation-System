from django.contrib import admin
from .models import Fish, Food, FoodWaste, ArtificialFeed , VendorProfile

# Register your models here.

admin.site.register(Fish)
admin.site.register(Food)
admin.site.register(FoodWaste)
admin.site.register(ArtificialFeed)
admin.site.register(VendorProfile)