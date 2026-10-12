import "./Home.css";

function Home({ onVendor, onRecommendation }) {
    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="home-brand">
                    <div className="brand-icon">A</div>

                    <div className="brand-text">
                        <strong>Aquaculture</strong>
                        <span>Feed Recommendation System</span>
                    </div>
                </div>

                <div className="home-nav">
                    <button
                        type="button"
                        onClick={() => scrollToSection("home-section")}
                    >
                        Home
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("about-section")}
                    >
                        About System
                    </button>
                </div>
            </header>

            <main>
                <section
                    id="home-section"
                    className="hero-section"
                >
                    <div className="hero-content">
                        <span className="hero-label">
                            AQUACULTURE TECHNOLOGY
                        </span>

                        <h1>
                            Smarter feed decisions
                            <br />
                            for better aquaculture.
                        </h1>

                        <p>
                            A machine learning based system that helps identify
                            suitable food options for fish by combining fish
                            characteristics with available food resources.
                        </p>

                        <div className="hero-actions">
                            <button
                                className="primary-button"
                                onClick={onRecommendation}
                            >
                                Fish Recommendation
                                <span>→</span>
                            </button>

                            <button
                                className="secondary-button"
                                onClick={onVendor}
                            >
                                Vendor Portal
                            </button>
                        </div>
                    </div>

                    <div className="hero-panel">
                        <div className="panel-header">
                            <span>SYSTEM OVERVIEW</span>
                            <span>01</span>
                        </div>

                        <div className="panel-content">
                            <div className="panel-item">
                                <span>01</span>
                                <div>
                                    <strong>Fish Selection</strong>
                                    <p>
                                        Select the fish species for analysis.
                                    </p>
                                </div>
                            </div>

                            <div className="panel-item">
                                <span>02</span>
                                <div>
                                    <strong>Food Analysis</strong>
                                    <p>
                                        Evaluate available food categories.
                                    </p>
                                </div>
                            </div>

                            <div className="panel-item">
                                <span>03</span>
                                <div>
                                    <strong>ML Recommendation</strong>
                                    <p>
                                        Classify food suitability using the
                                        trained model.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="about-section"
                    className="about-section"
                >
                    <div className="about-heading">
                        <span>ABOUT THE SYSTEM</span>

                        <h2>
                            Connecting fish,
                            <br />
                            food and data.
                        </h2>
                    </div>

                    <div className="about-content">
                        <p>
                            Efficient feed management is an important part of
                            successful fish farming. This system provides a
                            technology-based approach for identifying suitable
                            food resources based on the feeding characteristics
                            of the selected fish.
                        </p>

                        <p>
                            The platform also connects registered vendors with
                            the recommendation system, allowing available food
                            resources to become part of the overall aquaculture
                            workflow.
                        </p>
                    </div>
                </section>

                <section className="system-section">
                    <div className="system-header">
                        <div>
                            <span>SYSTEM WORKFLOW</span>
                            <h2>From data to recommendation.</h2>
                        </div>
                    </div>

                    <div className="workflow">
                        <div className="workflow-item">
                            <span>01</span>
                            <strong>Fish</strong>
                            <p>Species and feeding characteristics</p>
                        </div>

                        <div className="workflow-line"></div>

                        <div className="workflow-item">
                            <span>02</span>
                            <strong>Food</strong>
                            <p>Vegetable and fruit resources</p>
                        </div>

                        <div className="workflow-line"></div>

                        <div className="workflow-item">
                            <span>03</span>
                            <strong>Machine Learning</strong>
                            <p>Suitability classification</p>
                        </div>

                        <div className="workflow-line"></div>

                        <div className="workflow-item">
                            <span>04</span>
                            <strong>Recommendation</strong>
                            <p>Suitable food options</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <div>
                    <strong>Aquaculture System</strong>
                    <span>Fish Feed Recommendation Platform</span>
                </div>

                <span>© 2026</span>
            </footer>
        </div>
    );
}

export default Home;