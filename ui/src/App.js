import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CameraCapture from "./components/CameraCapture";
import VideoUpload from "./components/VideoUpload";
import PredictionResult from "./components/PredictionResult";
import VideoGallery from "./components/VideoGallery";


const App = () => {
    const [videoUrl, setVideoUrl] = useState(null);

    // Function to refresh the page
    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className="container mt-5 text-center">
            {/* Home Button */}
            <button className="btn btn-primary mb-3" onClick={refreshPage}>
                🏠 Home
            </button>

            <h2 className="mb-3">Hand Gesture Detection</h2>
            
            {/* Camera Capture Component */}
            <CameraCapture setVideoUrl={setVideoUrl} />

            {/* Show Upload Component if a video is recorded */}
            {videoUrl && <VideoUpload videoUrl={videoUrl} />}

            {/* Prediction Results */}
            <PredictionResult />

            {/* Video Gallery */}
            <VideoGallery />
            
        </div>
    );
};

export default App;
