from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from processing.video_processing import process_video
from processing.ml_pipeline import predict_gesture

app = FastAPI()

# ✅ Allow requests from frontend (React) to backend (FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if using a different frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-video/")
async def upload_video(video: UploadFile = File(...)):
    try:
        video_path = os.path.join(UPLOAD_DIR, video.filename)

        # ✅ Save the uploaded video file
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        return {"message": "Video uploaded successfully", "file_path": video_path}
    
    except Exception as e:
        return {"error": str(e)}


@app.post("/predict/")
async def predict():
    # Find latest processed sequence
    latest_video = sorted(os.listdir(FRAME_DIR))[-1]
    video_sequence = [os.path.join(FRAME_DIR, latest_video, f) for f in sorted(os.listdir(os.path.join(FRAME_DIR, latest_video)))]

    gesture = predict_gesture(video_sequence)
    return {"gesture": f"Predicted SOS Gesture {gesture}"}
