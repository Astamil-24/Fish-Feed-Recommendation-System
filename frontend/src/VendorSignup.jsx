import { useState } from "react";
import Cookies from "js-cookie";
import "./VendorSignup.css";

function VendorSignup({ onSignup, onBack }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = () => {
        setError("");
        setSuccess("");

        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);
        formData.append("confirm_password", confirmPassword);
        formData.append("phone_number", phoneNumber);

        fetch("http://localhost:8000/api/csrf/", {
            credentials: "include"
        })
            .then(() => {
                const csrfToken = Cookies.get("csrftoken");

                return fetch(
                    "http://localhost:8000/api/vendor/signup/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
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

                setSuccess(data.message);

                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setPhoneNumber("");

                setTimeout(() => {
                    onSignup();
                }, 2000);
            });
    };

    return (
        <div className="vendor-signup-container">
            <header className="vendor-signup-header">
                <div className="vendor-signup-brand">
                    <div className="vendor-signup-brand-icon">
                        A
                    </div>

                    <div className="vendor-signup-brand-text">
                        <strong>Aquaculture</strong>
                        <span>Feed Recommendation System</span>
                    </div>
                </div>
            </header>

            <main className="vendor-signup-main">
                <section className="vendor-signup-intro">
                    <span className="vendor-signup-label">
                        VENDOR PORTAL
                    </span>

                    <h1>
                        Create Vendor
                        <br />
                        Account
                    </h1>

                    <p>
                        Register your vendor account to make available
                        food resources part of the aquaculture
                        recommendation system.
                    </p>
                </section>

                <section className="vendor-signup-box">
                    <div className="vendor-signup-box-header">
                        <span>ACCOUNT REGISTRATION</span>
                        <span>01</span>
                    </div>

                    <div className="vendor-signup-form">
                        <label htmlFor="vendor-signup-username">
                            Username
                        </label>

                        <input
                            id="vendor-signup-username"
                            className="vendor-signup-input"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />

                        <label htmlFor="vendor-signup-phone">
                            Phone Number
                        </label>

                        <input
                            id="vendor-signup-phone"
                            className="vendor-signup-input"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(event) =>
                                setPhoneNumber(event.target.value)
                            }
                        />

                        <label htmlFor="vendor-signup-password">
                            Password
                        </label>

                        <input
                            id="vendor-signup-password"
                            className="vendor-signup-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                        <label htmlFor="vendor-signup-confirm-password">
                            Confirm Password
                        </label>

                        <input
                            id="vendor-signup-confirm-password"
                            className="vendor-signup-input"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                        />

                        {error && (
                            <p className="vendor-signup-error">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="vendor-signup-success">
                                {success}
                            </p>
                        )}

                        <button
                            className="vendor-signup-button"
                            onClick={handleSignup}
                        >
                            Create Account
                            <span>→</span>
                        </button>
                    </div>
                </section>

                <button
                    className="vendor-signup-back-button"
                    onClick={onBack}
                >
                    ← Back to Login
                </button>
            </main>
        </div>
    );
}

export default VendorSignup;