from django.core.management.base import BaseCommand
from aquaculture.models import Fish , Food , ArtificialFeed


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        fish_data = [
            ("Rohu", "Freshwater", "Omnivorous"),
            ("Catla", "Freshwater", "Zooplankton feeder"),
            ("Mrigal", "Freshwater", "Detritus feeder"),
            ("Common Carp", "Freshwater", "Omnivorous"),
            ("Grass Carp", "Freshwater", "Herbivorous"),
            ("Silver Carp", "Freshwater", "Phytoplankton feeder"),
            ("Tilapia", "Freshwater", "Omnivorous"),
            ("Pangasius", "Freshwater", "Omnivorous"),
            ("Magur", "Freshwater", "Carnivorous/Omnivorous"),
            ("Murrel", "Freshwater", "Carnivorous"),
            ("Koi", "Freshwater", "Omnivorous"),
            ("Kalbasu", "Freshwater", "Omnivorous"),
            ("Bata", "Freshwater", "Omnivorous"),
            ("Asian Seabass", "Brackishwater", "Carnivorous"),
            ("Milkfish", "Brackishwater", "Herbivorous/Omnivorous"),
            ("Grey Mullet", "Brackishwater", "Omnivorous/Detritivorous"),
            ("Pearlspot", "Brackishwater", "Omnivorous"),
            ("Red Snapper", "Marine", "Carnivorous"),
            ("Grouper", "Marine", "Carnivorous"),
            ("Cobia", "Marine", "Carnivorous"),
            ]

        for fish_name, water_type, feeding_type in fish_data:
            Fish.objects.get_or_create(
                fish_name=fish_name,
                water_type=water_type,
                feeding_type=feeding_type
            )
        food_data = [
            ("Onion", "Vegetable"),
            ("Cabbage", "Vegetable"),
            ("Tomato", "Vegetable"),
            ("Carrot", "Vegetable"),
            ("Pumpkin", "Vegetable"),
            ("Cauliflower", "Vegetable"),
            ("Beans", "Vegetable"),
            ("Beetroot", "Vegetable"),
            ("Lady's Finger", "Vegetable"),
            ("Bitter Gourd", "Vegetable"),
            ("Spinach", "Vegetable"),
            ("Potato", "Vegetable"),
            ("Sweet Potato", "Vegetable"),
            ("Cucumber", "Vegetable"),
            ("Bottle Gourd", "Vegetable"),
            ("Ridge Gourd", "Vegetable"),
            ("Brinjal", "Vegetable"),
            ("Green Peas", "Vegetable"),
            ("Corn", "Vegetable"),
            ("Radish", "Vegetable"),

            ("Banana", "Fruit"),
            ("Apple", "Fruit"),
            ("Papaya", "Fruit"),
            ("Watermelon", "Fruit"),
            ("Mango", "Fruit"),
            ("Guava", "Fruit"),
            ("Orange", "Fruit"),
            ("Pineapple", "Fruit"),
            ("Pomegranate", "Fruit"),
            ("Grapes", "Fruit"),
            ("Jackfruit", "Fruit"),
            ("Muskmelon", "Fruit"),
            ("Pear", "Fruit"),
            ("Sapota", "Fruit"),
            ("Custard Apple", "Fruit"),
            ("Kiwi", "Fruit"),
            ("Strawberry", "Fruit"),
            ("Dragon Fruit", "Fruit"),
            ("Fig", "Fruit"),
            ("Avocado", "Fruit"),
        ]

        for food_name, food_type in food_data:
            Food.objects.get_or_create(
                food_name=food_name,
                food_type=food_type
            )
        feed_data = [
            "Pellet Feed",
            "Floating Feed",
            "Sinking Feed",
            "Fish Meal",
            "Soybean Meal",
            "Rice Bran",
            "Wheat Bran",
            "Corn Meal",
            "Shrimp Meal",
            "Blood Meal",
        ]

        for feed_name in feed_data:
            ArtificialFeed.objects.get_or_create(
                feed_name=feed_name
            )

        self.stdout.write(
            self.style.SUCCESS("All initial data loaded successfully!")
        )

        self.stdout.write(
            self.style.SUCCESS("Fish data loaded successfully!")
        )