import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CameraCapture from "./components/CameraCapture";
import VideoUpload from "./components/VideoUpload";
import PredictionResult from "./components/PredictionResult";
import VideoGallery from "./components/VideoGallery";

const App = () => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [videos, setVideos] = useState([]);

    // Function to refresh video gallery
    const refreshGallery = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/videos/");
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    // Load videos on app load
    useEffect(() => {
        refreshGallery();
    }, []);

    return (
        <div className="container mt-5 text-center">
            {/* Home Button */}
            <button className="btn btn-primary mb-3" onClick={refreshGallery}>
                🏠 Home
            </button>

            <h2 className="mb-3">Hand Gesture Detection</h2>

            {/* Camera Capture Component */}
            <CameraCapture setVideoUrl={setVideoUrl} />

            {/* Show Upload Component if a video is recorded */}
            {videoUrl && <VideoUpload videoUrl={videoUrl} refreshGallery={refreshGallery} />}

            {/* Prediction Results */}
            <PredictionResult />

            {/* Video Gallery */}
            <VideoGallery videos={videos} />
        </div>
    );
};

export default App;
