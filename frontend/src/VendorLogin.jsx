import { useState } from "react";
import Cookies from "js-cookie";
import "./VendorLogin.css";

function VendorLogin({ onLogin, onSignup, onBack }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        setError("");

        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);

        fetch("http://localhost:8000/api/csrf/", {
            credentials: "include"
        })
            .then(() => {
                const csrfToken = Cookies.get("csrftoken");

                return fetch(
                    "http://localhost:8000/api/vendor/login/",
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

                onLogin(data.username);
            });
    };

    return (
        <div className="vendor-login-container">
            <header className="vendor-login-header">
                <div className="vendor-login-brand">
                    <div className="vendor-login-brand-icon">
                        A
                    </div>

                    <div className="vendor-login-brand-text">
                        <strong>Aquaculture</strong>
                        <span>Feed Recommendation System</span>
                    </div>
                </div>
            </header>

            <main className="vendor-login-main">
                <section className="vendor-login-intro">
                    <span className="vendor-login-label">
                        VENDOR PORTAL
                    </span>

                    <h1>
                        Vendor
                        <br />
                        Login
                    </h1>

                    <p>
                        Sign in to manage your available food resources
                        and contribute them to the aquaculture
                        recommendation system.
                    </p>
                </section>

                <section className="vendor-login-box">
                    <div className="vendor-login-box-header">
                        <span>ACCOUNT ACCESS</span>
                        <span>01</span>
                    </div>

                    <div className="vendor-login-form">
                        <label htmlFor="vendor-username">
                            Username
                        </label>

                        <input
                            id="vendor-username"
                            className="vendor-login-input"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />

                        <label htmlFor="vendor-password">
                            Password
                        </label>

                        <input
                            id="vendor-password"
                            className="vendor-login-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                        {error && (
                            <p className="vendor-login-error">
                                {error}
                            </p>
                        )}

                        <button
                            className="vendor-login-button"
                            onClick={handleLogin}
                        >
                            Login
                            <span>→</span>
                        </button>

                        <div className="vendor-login-divider">
                            <span>NEW VENDOR?</span>
                        </div>

                        <button
                            className="vendor-signup-button"
                            onClick={onSignup}
                        >
                            Create Account
                        </button>
                    </div>
                </section>

                <button
                    className="vendor-back-button"
                    onClick={onBack}
                >
                    ← Back to Home
                </button>
            </main>
        </div>
    );
}

export default VendorLogin;