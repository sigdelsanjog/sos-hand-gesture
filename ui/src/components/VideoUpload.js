import React, { useState } from "react";

const VideoUpload = ({ videoUrl, refreshGallery }) => {
    const [notification, setNotification] = useState(null);

    const uploadVideo = async () => {
        if (!videoUrl) return;

        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("video", blob, "gesture_video.webm");

            const uploadResponse = await fetch("http://127.0.0.1:8000/upload-video/", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }

            setNotification({ type: "success", message: "Video uploaded successfully!" });

            if (typeof refreshGallery === "function") {
                refreshGallery(); // Refresh video list after upload
            }

            // Auto-hide notification after 10s
            setTimeout(() => setNotification(null), 10000);
        } catch (error) {
            console.error("Error uploading video:", error);
            setNotification({ type: "error", message: "Failed to upload video. Try again." });
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

            {/* Notification */}
            {notification && (
                <div className={`alert alert-${notification.type} position-fixed bottom-0 end-0 m-3`}>
                    {notification.message}
                    <button type="button" className="btn-close ms-2" onClick={() => setNotification(null)}></button>
                </div>
            )}
        </div>
    );
};

export default VideoUpload;
