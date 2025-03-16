import React, { useState } from "react";

const VideoUpload = ({ videoUrl }) => {
    const [fps, setFps] = useState([]); // Default FPS
    const [duration, setDuration] = useState([]); // Default Duration in seconds
    const [frames, setFrames] = useState([]); // Initialize frames as an empty array

    const uploadVideo = async () => {
        if (!videoUrl) return;

        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("video", blob, "gesture_video.webm");
        formData.append("fps", fps);
        formData.append("duration", duration);

        try {
            const uploadResponse = await fetch("http://127.0.0.1:8000/upload-video/", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }

            const result = await uploadResponse.json();
            setFrames(result.frames || []);  // Set frames, default to empty array if not found
            alert("Video uploaded and frames extracted successfully!");
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <div className="mt-4">
            <h5>Captured Video:</h5>
            <video controls width="400">
                <source src={videoUrl} type="video/webm" />
                Your browser does not support the video tag.
            </video>
            <div className="mt-3">
                <label>Frames per second: </label>
                <input
                    type="number"
                    value={fps}
                    onChange={(e) => setFps(e.target.value)}
                    min="1"
                    max="10"
                />
                <label> Duration (seconds): </label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="60"
                />
                <button className="btn btn-primary" onClick={uploadVideo}>
                    Upload Video
                </button>
            </div>

            <div className="mt-5">
                <h5>Extracted Frames:</h5>
                <div className="frame-gallery">
                    {frames.length > 0 ? (
                        frames.map((frame, index) => (
                            <div key={index} className="frame-item">
                                <img
                                    src={`http://127.0.0.1:8000/frames/${frame}`}
                                    alt={`frame ${index + 1}`}
                                    width="200"
                                />
                                <p>{frame}</p>
                            </div>
                        ))
                    ) : (
                        <p>No frames available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoUpload;
