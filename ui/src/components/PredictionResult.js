import React, { useState, useEffect } from "react";

const PredictionResult = () => {
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/predict/");
                if (!response.ok) {
                    throw new Error("Failed to fetch prediction");
                }
                const data = await response.json();
                setPrediction(data.result);
            } catch (error) {
                console.error("Error fetching prediction:", error);
            }
        };

        fetchPrediction();
    }, []);

    return (
        <div className="mt-4">
            <h4>Prediction Result:</h4>
            <p>{prediction ? prediction : "Waiting for prediction..."}</p>
        </div>
    );
};

export default PredictionResult;
