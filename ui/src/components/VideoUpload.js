import React from "react";

const VideoUpload = ({ videoUrl }) => {
    const uploadVideo = async () => {
        if (!videoUrl) return;

        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("video", blob, "gesture_video.webm");

        try {
            const uploadResponse = await fetch("http://127.0.0.1:8000/upload-video/", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }
            alert("Video uploaded successfully!");
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
                <button className="btn btn-primary" onClick={uploadVideo}>
                    Upload Video
                </button>
            </div>
        </div>
    );
};

export default VideoUpload;
