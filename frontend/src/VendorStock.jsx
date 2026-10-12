import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./VendorStock.css";

function VendorStock({ onSessionExpired }) {
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [stock, setStock] = useState([]);
    const [location, setLocation] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editQuantity, setEditQuantity] = useState("");
    const [editLocation, setEditLocation] = useState("");

    const loadFoods = () => {
        fetch("http://localhost:8000/api/food/", {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                setFoods(data);
            });
    };

    const loadStock = () => {
        fetch("http://localhost:8000/api/available-food/", {
            credentials: "include"
        })
            .then(response => {
                if (response.status === 401) {
                    onSessionExpired();
                    return null;
                }

                return response.json();
            })
            .then(data => {
                if (!data) {
                    return;
                }

                if (data.error) {
                    setError(data.error);
                    return;
                }

                setStock(data);
            });
    };

    useEffect(() => {
        loadFoods();
        loadStock();
    }, []);

    const handleAddFood = () => {
        setMessage("");
        setError("");

        if (!selectedFood || !quantity || !location) {
            setError(
                "Please select food and enter quantity and collection location"
            );
            return;
        }

        const formData = new URLSearchParams();

        formData.append("food_id", selectedFood);
        formData.append("quantity_kg", quantity);
        formData.append("collection_location", location);

        fetch("http://localhost:8000/api/csrf/", {
            credentials: "include"
        })
            .then(() => {
                const csrfToken = Cookies.get("csrftoken");

                return fetch(
                    "http://localhost:8000/api/add-food-waste/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded",
                            "X-CSRFToken": csrfToken
                        },
                        credentials: "include",
                        body: formData
                    }
                );
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }

                setMessage(`${data.food_name} added successfully`);

                setSelectedFood("");
                setQuantity("");
                setLocation("");

                loadStock();
            });
    };

    const handleDeleteStock = (foodWasteId) => {
        setMessage("");
        setError("");

        fetch("http://localhost:8000/api/csrf/", {
            credentials: "include"
        })
            .then(() => {
                const csrfToken = Cookies.get("csrftoken");

                return fetch(
                    `http://localhost:8000/api/delete-food-waste/${foodWasteId}/`,
                    {
                        method: "DELETE",
                        headers: {
                            "X-CSRFToken": csrfToken
                        },
                        credentials: "include"
                    }
                );
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }

                setMessage(data.message);

                loadStock();
            });
    };

    const handleEditStock = (item) => {
        setEditingId(item.id);
        setEditQuantity(item.quantity_kg);
        setEditLocation(item.collection_location);
    };

    const handleUpdateStock = (foodWasteId) => {
        setMessage("");
        setError("");

        if (!editQuantity || !editLocation) {
            setError(
                "Please enter quantity and collection location"
            );
            return;
        }

        const formData = new URLSearchParams();

        formData.append("quantity_kg", editQuantity);
        formData.append(
            "collection_location",
            editLocation
        );

        fetch("http://localhost:8000/api/csrf/", {
            credentials: "include"
        })
            .then(() => {
                const csrfToken = Cookies.get("csrftoken");

                return fetch(
                    `http://localhost:8000/api/update-food-waste/${foodWasteId}/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded",
                            "X-CSRFToken": csrfToken
                        },
                        credentials: "include",
                        body: formData
                    }
                );
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }

                setMessage(data.message);

                setEditingId(null);
                setEditQuantity("");
                setEditLocation("");

                loadStock();
            });
    };

    return (
        <div className="vendor-stock-container">
            <header className="vendor-stock-header">
                <div className="vendor-stock-brand">
                    <div className="vendor-stock-brand-icon">
                        A
                    </div>

                    <div className="vendor-stock-brand-text">
                        <strong>Aquaculture</strong>
                        <span>Feed Recommendation System</span>
                    </div>
                </div>
            </header>

            <main className="vendor-stock-main">
                <section className="vendor-stock-intro">
                    <span className="vendor-stock-label">
                        VENDOR PORTAL
                    </span>

                    <h1>
                        Manage Food
                        <br />
                        Stock
                    </h1>

                    <p>
                        Add available food resources, update stock
                        quantities and manage collection locations for
                        the aquaculture recommendation system.
                    </p>
                </section>

                <section className="add-stock-section">
                    <div className="section-heading">
                        <div>
                            <span>STOCK MANAGEMENT</span>
                            <h2>Add Food Stock</h2>
                        </div>

                        <span className="section-number">
                            01
                        </span>
                    </div>

                    <div className="add-stock-form">
                        <div className="stock-field">
                            <label htmlFor="stock-food">
                                Food
                            </label>

                            <select
                                id="stock-food"
                                value={selectedFood}
                                onChange={(event) =>
                                    setSelectedFood(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select food
                                </option>

                                {foods.map(item => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.food_name} (
                                        {item.food_type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="stock-field">
                            <label htmlFor="stock-quantity">
                                Quantity
                            </label>

                            <input
                                id="stock-quantity"
                                type="number"
                                placeholder="Quantity in kg"
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="stock-field">
                            <label htmlFor="stock-location">
                                Collection Location
                            </label>

                            <input
                                id="stock-location"
                                type="text"
                                placeholder="Enter collection location"
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <button
                            className="add-food-button"
                            onClick={handleAddFood}
                        >
                            Add Food
                            <span>+</span>
                        </button>
                    </div>
                </section>

                {message && (
                    <p className="vendor-stock-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="vendor-stock-error">
                        {error}
                    </p>
                )}

                <section className="current-stock-section">
                    <div className="section-heading">
                        <div>
                            <span>INVENTORY</span>
                            <h2>My Current Stock</h2>
                        </div>

                        <span className="section-number">
                            02
                        </span>
                    </div>

                    {stock.length > 0 ? (
                        <div className="stock-grid">
                            {stock.map(item => (
                                <div
                                    key={item.id}
                                    className="stock-card"
                                >
                                    {editingId === item.id ? (
                                        <div className="stock-edit-form">
                                            <div className="stock-card-top">
                                                <span>
                                                    EDIT STOCK
                                                </span>

                                                <span>
                                                    {item.food_name}
                                                </span>
                                            </div>

                                            <h3>
                                                {item.food_name}
                                            </h3>

                                            <label>
                                                Quantity in kg
                                            </label>

                                            <input
                                                type="number"
                                                value={
                                                    editQuantity
                                                }
                                                onChange={(event) => {
                                                    setEditQuantity(
                                                        event.target
                                                            .value
                                                    );
                                                }}
                                            />

                                            <label>
                                                Collection Location
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    editLocation
                                                }
                                                onChange={(event) => {
                                                    setEditLocation(
                                                        event.target
                                                            .value
                                                    );
                                                }}
                                            />

                                            <div className="stock-edit-buttons">
                                                <button
                                                    className="stock-save-button"
                                                    onClick={() =>
                                                        handleUpdateStock(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Save Changes
                                                </button>

                                                <button
                                                    className="stock-cancel-button"
                                                    onClick={() =>
                                                        setEditingId(
                                                            null
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="stock-card-content">
                                            <div className="stock-card-top">
                                                <span>
                                                    FOOD STOCK
                                                </span>

                                                <span>
                                                    {item.food_type}
                                                </span>
                                            </div>

                                            <h3>
                                                {item.food_name}
                                            </h3>

                                            <div className="stock-details">
                                                <div>
                                                    <span>
                                                        QUANTITY
                                                    </span>

                                                    <strong>
                                                        {
                                                            item.quantity_kg
                                                        }{" "}
                                                        kg
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        COLLECTION LOCATION
                                                    </span>

                                                    <strong>
                                                        {
                                                            item.collection_location
                                                        }
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="stock-card-buttons">
                                                <button
                                                    className="stock-edit-button"
                                                    onClick={() =>
                                                        handleEditStock(
                                                            item
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="stock-delete-button"
                                                    onClick={() =>
                                                        handleDeleteStock(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-stock">
                            <span>NO STOCK RECORDS</span>

                            <p>
                                No food stock is currently available.
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default VendorStock;