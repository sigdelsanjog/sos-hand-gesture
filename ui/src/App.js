import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CameraCapture from "./components/CameraCapture";
import VideoUpload from "./components/VideoUpload";
import PredictionResult from "./components/PredictionResult";

const App = () => {
    const [videoUrl, setVideoUrl] = useState(null);

    return (
        <div className="container mt-5 text-center">
            <h2 className="mb-3">Hand Gesture Stress Detection</h2>
            
            {/* Camera Capture Component */}
            <CameraCapture setVideoUrl={setVideoUrl} />

            {/* Show Upload Component if a video is recorded */}
            {videoUrl && <VideoUpload videoUrl={videoUrl} />}

            {/* Prediction Results */}
            <PredictionResult />
        </div>
    );
};

export default App;
