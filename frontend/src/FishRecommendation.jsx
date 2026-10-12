import { useEffect, useState } from "react";
import "./FishRecommendation.css";

function FishRecommendation({ onBack }) {
    const [fish, setFish] = useState([]);
    const [selectedFish, setSelectedFish] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/fish/")
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }

                setFish(data);
            });
    }, []);

    const getRecommendation = () => {
        setError("");
        setResult(null);

        if (!selectedFish) {
            setError("Please select a fish");
            return;
        }

        fetch(
            `http://localhost:8000/api/recommend/?fish=${selectedFish}`
        )
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }

                setResult(data);
            });
    };

    return (
        <div className="recommendation-container">

            <header className="recommendation-header">
                <div className="recommendation-brand">
                    <div className="recommendation-brand-icon">
                        A
                    </div>

                    <div className="recommendation-brand-text">
                        <strong>Aquaculture</strong>
                        <span>Feed Recommendation System</span>
                    </div>
                </div>
            </header>

            <section className="recommendation-title">
                <span className="recommendation-label">
                    AQUACULTURE TECHNOLOGY
                </span>

                <h1>
                    Fish Feed
                    <br />
                    Recommendation
                </h1>

                <p>
                    Select a fish species to identify suitable food waste
                    resources and artificial feed options based on the
                    recommendation system.
                </p>
            </section>

            <div className="fish-selection">
                <h2>Select Fish</h2>

                <select
                    value={selectedFish}
                    onChange={(event) => {
                        setSelectedFish(event.target.value);
                    }}
                >
                    <option value="">
                        Select a fish
                    </option>

                    {fish.map(item => (
                        <option
                            key={item.id}
                            value={item.fish_name}
                        >
                            {item.fish_name}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={getRecommendation}>
                Get Recommendation
            </button>

            {error && (
                <p className="recommendation-error">
                    {error}
                </p>
            )}

            {result && (
                <div className="recommendation-results">

                    {!result.vendor_stock_available && (
                        <p className="recommendation-info">
                            No vendor food stock is currently available.
                        </p>
                    )}

                    <h2>Available Food Waste</h2>

                    {result.suitable_vendors &&
                    result.suitable_vendors.length > 0 ? (
                        <div>

                            <p>
                                Available from{" "}
                                {result.suitable_vendors.length} vendor
                                {result.suitable_vendors.length > 1
                                    ? "s"
                                    : ""}
                            </p>

                            <div className="vendor-grid">

                                {result.suitable_vendors.map(vendor => (
                                    <div
                                        key={vendor.vendor}
                                        className="vendor-card"
                                    >
                                        <h3>
                                            Vendor Name: {vendor.vendor}
                                        </h3>

                                        <p>
                                            Location:{" "}
                                            {vendor.collection_location}
                                        </p>

                                        <p>
                                            Contact:{" "}
                                            {vendor.phone_number}
                                        </p>

                                        <div className="vendor-food-list">

                                            <h4>Vegetables</h4>

                                            {vendor.foods.filter(
                                                food =>
                                                    food.food_type ===
                                                    "Vegetable"
                                            ).length > 0 ? (
                                                vendor.foods
                                                    .filter(
                                                        food =>
                                                            food.food_type ===
                                                            "Vegetable"
                                                    )
                                                    .map(food => (
                                                        <p
                                                            key={food.id}
                                                            className="vendor-food"
                                                        >
                                                            {food.food_name} —{" "}
                                                            {food.quantity_kg} kg
                                                        </p>
                                                    ))
                                            ) : (
                                                <p>
                                                    No suitable vegetables
                                                    available.
                                                </p>
                                            )}

                                            <h4>Fruits</h4>

                                            {vendor.foods.filter(
                                                food =>
                                                    food.food_type ===
                                                    "Fruit"
                                            ).length > 0 ? (
                                                vendor.foods
                                                    .filter(
                                                        food =>
                                                            food.food_type ===
                                                            "Fruit"
                                                    )
                                                    .map(food => (
                                                        <p
                                                            key={food.id}
                                                            className="vendor-food"
                                                        >
                                                            {food.food_name} —{" "}
                                                            {food.quantity_kg} kg
                                                        </p>
                                                    ))
                                            ) : (
                                                <p>
                                                    No suitable fruits
                                                    available.
                                                </p>
                                            )}

                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                    ) : (
                        <p>
                            No suitable food waste is currently available.
                        </p>
                    )}

                    <h3>Artificial Feeds</h3>

                    {result.artificial_feeds &&
                    result.artificial_feeds.length > 0 ? (
                        <div className="artificial-feed-grid">

                            {result.artificial_feeds.map(item => (
                                <div
                                    key={item.feed_name}
                                    className="artificial-feed-card"
                                >
                                    <h4>
                                        {item.feed_name}
                                    </h4>

                                    <p>
                                        Feeding Type:{" "}
                                        <strong>
                                            {item.feeding_type}
                                        </strong>
                                    </p>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <p>
                            No suitable artificial feeds available.
                        </p>
                    )}

                </div>
            )}

            <button
                className="recommendation-back-button"
                onClick={onBack}
            >
                Back to Home
            </button>

        </div>
    );
}

export default FishRecommendation;