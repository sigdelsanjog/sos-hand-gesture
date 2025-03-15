from fastapi import FastAPI, File, UploadFile
from fastapi.staticfiles import StaticFiles
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
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Function to get the next available filename
def get_next_filename():
    existing_files = [f for f in os.listdir(UPLOAD_DIR) if f.startswith("gesture_") and f.endswith(".webm")]
    if not existing_files:
        return "gesture_1.webm"
    
    existing_ids = [int(f.split("_")[-1].split(".")[0]) for f in existing_files if f.split("_")[-1].split(".")[0].isdigit()]
    next_id = max(existing_ids, default=0) + 1
    return f"gesture_{next_id}.webm"

@app.post("/upload-video/")
async def upload_video(video: UploadFile = File(...)):
    try:
        video_path = os.path.join(UPLOAD_DIR, get_next_filename())

        # ✅ Save the uploaded video file
        with open(video_path, "wb") as buffer:
                buffer.write(await video.read())


        return {"message": "Video uploaded successfully", "file_path": video_path}
    
    except Exception as e:
        return {"error": str(e)}


@app.get("/videos")
def list_videos():
    try:
        videos = [f for f in os.listdir(UPLOAD_DIR) if f.endswith(".webm")]
        return videos
    except Exception as e:
        return {"error": str(e)}


@app.post("/predict/")
async def predict():
    # Find latest processed sequence
    latest_video = sorted(os.listdir(FRAME_DIR))[-1]
    video_sequence = [os.path.join(FRAME_DIR, latest_video, f) for f in sorted(os.listdir(os.path.join(FRAME_DIR, latest_video)))]

    gesture = predict_gesture(video_sequence)
    return {"gesture": f"Predicted SOS Gesture {gesture}"}
