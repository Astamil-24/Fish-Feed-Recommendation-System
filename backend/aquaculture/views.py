from django.http import JsonResponse
from .models import Fish, Food , FoodWaste , ArtificialFeed ,  VendorProfile
from django.contrib.auth import authenticate, login ,logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
import os
import sys
import re
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ml.recommendation_model import predict_suitability
# Create your views here.
def recommend(request):

    fish_name = request.GET.get("fish")

    if not fish_name:
        return JsonResponse({
            "error": "Fish is required"
        })

    try:
        fish = Fish.objects.get(fish_name=fish_name)

    except Fish.DoesNotExist:
        return JsonResponse({
            "error": "Fish not found"
        })

    available_foods = FoodWaste.objects.select_related("food","vendor")

    suitable_foods = []
    not_suitable_foods = []

    vendors = {}

    artificial_feeds = ArtificialFeed.objects.filter(
        feeding_type=fish.feeding_type
    )

    recommended_feeds = []

    for feed in artificial_feeds:
        recommended_feeds.append({
            "feed_name": feed.feed_name,
            "feeding_type": feed.feeding_type
        })

    for item in available_foods:

        result = predict_suitability(
            fish.water_type,
            fish.feeding_type,
            item.food.food_type
        )

        food_data = {
            "id": item.id,
            "food_name": item.food.food_name,
            "food_type": item.food.food_type,
            "quantity_kg": item.quantity_kg,
            "vendor": item.vendor.username if item.vendor else "Unknown",
             "phone_number": (
                item.vendor.vendorprofile.phone_number
                if hasattr(item.vendor, "vendorprofile")
                else "Not available"
            ),
            "collection_location": item.collection_location,
        }

        if result == "Suitable":
            vendor_name = item.vendor.username if item.vendor else "Unknown"

            if vendor_name not in vendors:
                vendors[vendor_name] = {
                    "vendor": vendor_name,
                    "phone_number": (
                        item.vendor.vendorprofile.phone_number
                        if hasattr(item.vendor, "vendorprofile")
                        else "Not available"
                    ),
                    "collection_location": item.collection_location,
                    "foods": []
                }

            vendors[vendor_name]["foods"].append({
                "id": item.id,
                "food_name": item.food.food_name,
                "food_type": item.food.food_type,
                "quantity_kg": item.quantity_kg
            })

    return JsonResponse({
        "fish": fish.fish_name,
        "water_type": fish.water_type,
        "feeding_type": fish.feeding_type,
        "suitable_vendors": list(vendors.values()),
        "not_suitable_foods": not_suitable_foods,
        "artificial_feeds": recommended_feeds,
        "vendor_stock_available": available_foods.exists()
    })
@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({
        "message": "CSRF cookie set"
    })
def vendor_login(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "Only POST method is allowed"
        }, status=405)

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({
            "error": "Username and password are required"
        }, status=400)

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return JsonResponse({
            "error": "Invalid username or password"
        }, status=401)

    login(request, user)

    return JsonResponse({
        "message": "Login successful",
        "username": user.username
    })

def vendor_logout(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "Only POST method is allowed"
        }, status=405)

    logout(request)

    return JsonResponse({
        "message": "Logout successful"
    })

def current_vendor(request):

    if not request.user.is_authenticated:
        return JsonResponse({
            "authenticated": False
        })

    return JsonResponse({
        "authenticated": True,
        "username": request.user.username
    })

def vendor_signup(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "Only POST method is allowed"
        }, status=405)

    username = request.POST.get("username")
    password = request.POST.get("password")
    confirm_password = request.POST.get("confirm_password")
    phone_number = request.POST.get("phone_number")

    # Check whether all fields are filled
    if not username or not password or not confirm_password or not phone_number:
        return JsonResponse({
            "error": "All fields are required"
        }, status=400)

    # Check whether passwords match
    if password != confirm_password:
        return JsonResponse({
            "error": "Passwords do not match"
        }, status=400)

    # Validate phone number
    if not re.fullmatch(r"[6-9]\d{9}", phone_number):
        return JsonResponse({
            "error": "Enter a valid 10-digit phone number"
        }, status=400)

    # Check whether username already exists
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            "error": "Username already exists"
        }, status=400)

    # Create Django user
    user = User.objects.create_user(
        username=username,
        password=password
    )

    # Create vendor profile and store phone number
    VendorProfile.objects.create(
        user=user,
        phone_number=phone_number
    )

    return JsonResponse({
        "message": "Vendor account created successfully",
        "username": user.username
    }, status=201)

def fish_list(request):

    fish = Fish.objects.all()

    data = []

    for item in fish:
        data.append({
            "id": item.id,
            "fish_name": item.fish_name,
            "water_type": item.water_type,
            "feeding_type": item.feeding_type
        })

    return JsonResponse(data, safe=False)

def food_list(request):
    
    food = Food.objects.all()
    data = []
    for item in food:
        data.append({
            "id": item.id,
            "food_name": item.food_name,
            "food_type": item.food_type
        })
    return JsonResponse(data, safe=False)

def available_food_list(request):

    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "Authentication required"
        }, status=401)
    food_waste = FoodWaste.objects.filter(vendor=request.user).select_related("food")

    data = []

    for item in food_waste:
        data.append({
            "id": item.id,
            "food_name": item.food.food_name,
            "food_type": item.food.food_type,
            "quantity_kg": item.quantity_kg,
            "collection_location": item.collection_location
        })

    return JsonResponse(data, safe=False)

def add_food_waste(request):

    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "Authentication required"
        }, status=401)

    if request.method != "POST":
        return JsonResponse({
            "error": "Only POST method is allowed"
        }, status=405)

    food_id = request.POST.get("food_id")
    quantity_kg = request.POST.get("quantity_kg")
    collection_location = request.POST.get("collection_location")

    if not food_id or not quantity_kg or not collection_location:
        return JsonResponse({
            "error": "Food and quantity and collection location are required"
        }, status=400)

    try:
        food = Food.objects.get(id=food_id)

    except Food.DoesNotExist:
        return JsonResponse({
            "error": "Food not found"
        }, status=404)

    try:
        quantity_kg = float(quantity_kg)

    except ValueError:
        return JsonResponse({
            "error": "Quantity must be a number"
        }, status=400)

    if quantity_kg <= 0:
        return JsonResponse({
            "error": "Quantity must be greater than 0"
        }, status=400)

    food_waste = FoodWaste.objects.create(
        vendor=request.user,
        food=food,
        quantity_kg=quantity_kg,
        collection_location=collection_location
    )

    return JsonResponse({
        "message": "Food stock added successfully",
        "food_name": food_waste.food.food_name,
        "food_type": food_waste.food.food_type,
        "quantity_kg": food_waste.quantity_kg,
        "collection_location": food_waste.collection_location
    }, status=201)

def delete_food_waste(request, food_waste_id):

    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "Authentication required"
        }, status=401)

    if request.method != "DELETE":
        return JsonResponse({
            "error": "Only DELETE method is allowed"
        }, status=405)

    try:
        food_waste = FoodWaste.objects.get(
            id=food_waste_id,
            vendor=request.user
        )
    except FoodWaste.DoesNotExist:
        return JsonResponse({
            "error": "Food stock not found"
        }, status=404)

    food_waste.delete()

    return JsonResponse({
        "message": "Food stock deleted successfully"
    })

def update_food_waste(request, food_waste_id):

    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "Authentication required"
        }, status=401)

    if request.method != "POST":
        return JsonResponse({
            "error": "Only POST method is allowed"
        }, status=405)

    try:
        food_waste = FoodWaste.objects.get(
            id=food_waste_id,
            vendor=request.user
        )
    except FoodWaste.DoesNotExist:
        return JsonResponse({
            "error": "Food stock not found"
        }, status=404)

    quantity_kg = request.POST.get("quantity_kg")
    collection_location = request.POST.get("collection_location")

    if not quantity_kg or not collection_location:
        return JsonResponse({
            "error": "Quantity and collection location are required"
        }, status=400)

    try:
        quantity_kg = float(quantity_kg)
    except ValueError:
        return JsonResponse({
            "error": "Quantity must be a number"
        }, status=400)

    if quantity_kg <= 0:
        return JsonResponse({
            "error": "Quantity must be greater than 0"
        }, status=400)

    food_waste.quantity_kg = quantity_kg
    food_waste.collection_location = collection_location

    food_waste.save()

    return JsonResponse({
        "message": "Food stock updated successfully"
    })  