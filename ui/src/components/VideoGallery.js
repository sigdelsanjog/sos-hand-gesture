import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const VideoGallery = () => {
    const [videos, setVideos] = useState([]); // Ensure videos is always an array

    useEffect(() => {
        fetch("http://127.0.0.1:8000/videos")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setVideos(data);
                } else {
                    setVideos([]); // Handle case where response is not an array
                }
            })
            .catch((error) => {
                console.error("Error fetching videos:", error);
                setVideos([]); // Ensure videos is always an array
            });
    }, []);

    return (
        <div className="mt-4">
            <h3>Uploaded Videos</h3>
            <div className="d-flex flex-wrap justify-content-center">
                {videos.length > 0 ? (
                    videos.map((video, index) => (
                        <div key={index} className="m-2 text-center">
                            <video
                                src={`http://127.0.0.1:8000/uploads/${video}`}
                                width="200"
                                controls
                            />
                            <p className="mt-1">{video}</p>
                        </div>
                    ))
                ) : (
                    <p>No videos uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default VideoGallery;
