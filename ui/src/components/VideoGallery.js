import React, { useEffect, useState } from "react";
import VideoUpload from "./VideoUpload";

const VideoGallery = () => {
    const [videos, setVideos] = useState([]);
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/videos");
                const data = await response.json();
                setVideos(data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };
        fetchVideos();
    }, []);

    // Select the first video to display its frames
    const selectVideo = (video) => {
        setVideoUrl(`http://127.0.0.1:8000/uploads/${video}`);
    };

    return (
        <div className="mt-4">
            <h5>Video Gallery:</h5>
            <div className="video-gallery">
                {videos.map((video, index) => (
                    <div key={index} className="video-item" onClick={() => selectVideo(video)}>
                        <video width="200" controls>
                            <source src={`http://127.0.0.1:8000/uploads/${video}`} type="video/webm" />
                            Your browser does not support the video tag.
                        </video>
                        <p>{video}</p>
                    </div>
                ))}
            </div>

            {/* Show selected video and frames */}
            {videoUrl && <VideoUpload videoUrl={videoUrl} />}
        </div>
    );
};

export default VideoGallery;
