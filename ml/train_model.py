import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix , classification_report

data = pd.read_csv("dataset/ml_training_data.csv")
fish_list = [ "Rohu", "Catla", "Mrigal", "Common Carp", "Grass Carp", "Silver Carp", "Tilapia", "Pangasius", "Magur", "Murrel", "Koi", "Kalbasu", "Bata", "Asian Seabass", "Milkfish", "Grey Mullet", "Pearlspot", "Red Snapper", "Grouper", "Cobia" ]
vegetable_list = [ "Onion", "Cabbage", "Tomato", "Carrot", "Pumpkin", "Cauliflower", "Beans", "Beetroot", "Lady's Finger", "Bitter Gourd", "Spinach", "Potato", "Sweet Potato", "Cucumber", "Bottle Gourd", "Ridge Gourd", "Brinjal", "Green Peas", "Corn", "Radish" ]
fruit_list = [ "Banana", "Apple", "Papaya", "Watermelon", "Mango", "Guava", "Orange", "Pineapple", "Pomegranate", "Grapes", "Jackfruit", "Muskmelon", "Pear", "Sapota", "Custard Apple", "Kiwi", "Strawberry", "Dragon Fruit", "Fig", "Avocado" ]
food_list = vegetable_list + fruit_list

fish_info = { "Rohu": ["Freshwater", "Omnivorous"], "Catla": ["Freshwater", "Zooplankton feeder"], 
            "Mrigal": ["Freshwater", "Detritus feeder"], "Common Carp": ["Freshwater", "Omnivorous"], 
            "Grass Carp": ["Freshwater", "Herbivorous"], "Silver Carp": ["Freshwater", "Phytoplankton feeder"],
            "Tilapia": ["Freshwater", "Omnivorous"], "Pangasius": ["Freshwater", "Omnivorous"],
            "Magur": ["Freshwater", "Carnivorous/Omnivorous"], "Murrel": ["Freshwater", "Carnivorous"],
            "Koi": ["Freshwater", "Omnivorous"], "Kalbasu": ["Freshwater", "Omnivorous"],
            "Bata": ["Freshwater", "Omnivorous"], "Asian Seabass": ["Brackishwater", "Carnivorous"],
            "Milkfish": ["Brackishwater", "Herbivorous/Omnivorous"], "Grey Mullet": ["Brackishwater", "Omnivorous/Detritivorous"], 
            "Pearlspot": ["Brackishwater", "Omnivorous"], "Red Snapper": ["Marine", "Carnivorous"], 
            "Grouper": ["Marine", "Carnivorous"], "Cobia": ["Marine", "Carnivorous"] }


food_info = {}

for vegetable in vegetable_list: 
    food_info[vegetable] = "Vegetable"

for fruit in fruit_list:
    food_info[fruit] = "Fruit"


rows = []

for fish in fish_list:
    for food in food_list:

        water_type = fish_info[fish][0]
        feeding_type = fish_info[fish][1]
        food_type = food_info[food]
        
        if feeding_type == "Herbivorous":
            if food_type == "Vegetable":
                suitability = "Suitable"
            else:
                suitability = "Not Suitable"

        elif feeding_type in ["Omnivorous","Carnivorous/Omnivorous","Herbivorous/Omnivorous","Omnivorous/Detritivorous"]:
            suitability = "Suitable"

        else:
            suitability = "Not Suitable"
        rows.append([fish,food_type,food,water_type,feeding_type,suitability])

data = pd.DataFrame(rows, columns=["fish_name","food_type","food_name","water_type","feeding_type","suitability"])
print("Total rows:", len(data))

print("\nDataset:")
print(data)

print("\nSuitability count:")
print(data["suitability"].value_counts())

X = data[["water_type","feeding_type","food_type"]]
X = pd.get_dummies(X)
y = data["suitability"]
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
model = LinearDiscriminantAnalysis()
model.fit(X_train, y_train)

joblib.dump(model, "ml/trained_model.pkl")
print("Model saved successfully!")

print("\nFeature Names:")
print(X.columns)

print("\nModel Coefficients:")
print(model.coef_)

print("\nModel Intercept:")
print(model.intercept_)

y_pred = model.predict(X_test)

new_data = pd.DataFrame([
    {
        "water_type": "Freshwater",
        "feeding_type": "Carnivorous",
        "food_type": "Vegetable"
    }
])

new_data = pd.get_dummies(new_data)

new_data = new_data.reindex(
    columns=X.columns,
    fill_value=0
)

prediction = model.predict(new_data)

print("\nNew Prediction:")
print(prediction)

decision = model.decision_function(new_data)

print("\nDecision Score:")
print(decision)
print("\nModel Classes:")
print(model.classes_)

accuracy = accuracy_score(y_test , y_pred)
print("Accuracy:", accuracy)

cm = confusion_matrix(y_test , y_pred)
print(cm)

print(classification_report(y_test , y_pred))

print("Model training completed!")
print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)

data.to_csv("dataset/ml_training_data.csv", index=False)
print("\nDataset saved successfully!")