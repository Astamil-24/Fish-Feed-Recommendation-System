import { useEffect, useState } from "react";
import Home from "./Home";
import Cookies from "js-cookie";
import "./App.css";

import VendorLogin from "./VendorLogin";
import VendorSignup from "./VendorSignup";
import VendorStock from "./VendorStock";
import FishRecommendation from "./FishRecommendation";

function App() {

    const [page, setPage] = useState("home");
    const [showSignup, setShowSignup] = useState(false);
    const [loggedInVendor, setLoggedInVendor] = useState(null);

    useEffect(() => {

        fetch("http://localhost:8000/api/vendor/current/", {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {

                if (data.authenticated) {
                    setLoggedInVendor(data.username);
                    setPage("vendor");
                }

            });

    }, []);

    const handleLogout = () => {

        fetch("http://localhost:8000/api/csrf/", {
            credentials: "include"
        })
            .then(() => {

                const csrfToken = Cookies.get("csrftoken");

                return fetch(
                    "http://localhost:8000/api/vendor/logout/",
                    {
                        method: "POST",

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
                    return;
                }

                setLoggedInVendor(null);
                setPage("home");

            });

    };

    if (page === "home") {

        return (
            <Home
                onVendor={() => setPage("vendor")}
                onRecommendation={() => setPage("recommendation")}
            />
        );

    }

    if (page === "vendor") {

        if (loggedInVendor) {

            return (
                <div className="vendor-dashboard">

                    <div className="vendor-dashboard-header">

                        <div>
                            <h1>Vendor Dashboard</h1>

                            <p>
                                Welcome, {loggedInVendor}
                            </p>
                        </div>

                        <div className="vendor-dashboard-actions">

                            <button onClick={handleLogout}>
                                Logout
                            </button>

                            <button
                                onClick={() => setPage("home")}
                            >
                                Back to Home
                            </button>

                        </div>

                    </div>

                    <VendorStock
                        onSessionExpired={() => {
                            setLoggedInVendor(null);
                            setPage("vendor");
                        }}
                    />

                </div>
            );

        }

        if (showSignup) {

            return (
                <VendorSignup
                    onSignup={() => {
                        setShowSignup(false);
                    }}
                    onBack={() => {
                        setShowSignup(false);
                    }}
                />
            );

        }

        return (
            <VendorLogin
                onLogin={(username) => {
                    setLoggedInVendor(username);
                }}
                onSignup={() => {
                    setShowSignup(true);
                }}
                onBack={() => {
                    setShowSignup(false);
                    setPage("home");
                }}
            />
        );

    }

    if (page === "recommendation") {

        return (
            <FishRecommendation
                onBack={() => setPage("home")}
            />
        );

    }

}

export default App;