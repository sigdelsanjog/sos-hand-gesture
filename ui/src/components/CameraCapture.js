import React, { useRef, useEffect, useState } from "react";

const CameraCapture = ({ setVideoUrl }) => {
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const videoRef = useRef(null);

    useEffect(() => {
        const getCameraAccess = async () => {
            try {
                const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(userStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = userStream;
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };
        getCameraAccess();
    }, []);

    const startRecording = () => {
        if (!stream) return;

        recordedChunks.current = [];
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(recordedChunks.current, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div>
            {/* Camera Box */}
            <div className="border border-dark rounded p-2 mx-auto" style={{ width: "500px", height: "300px" }}>
                <video ref={videoRef} autoPlay playsInline className="w-100 h-100" />
            </div>

            {/* Start/Stop Buttons */}
            <div className="mt-3">
                {!recording ? (
                    <button className="btn btn-success" onClick={startRecording}>
                        Start Recording
                    </button>
                ) : (
                    <button className="btn btn-danger" onClick={stopRecording}>
                        Stop Recording
                    </button>
                )}
            </div>
        </div>
    );
};

export default CameraCapture;
