from fastapi import FastAPI, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
import cv2
from processing.video_processing import extract_frames_from_video  # Assuming you have a function for processing
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
FRAME_DIR = "frames"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(FRAME_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/frames", StaticFiles(directory=FRAME_DIR), name="frames")


# Function to get the next available filename for gesture video upload
def get_next_filename():
    existing_files = [f for f in os.listdir(UPLOAD_DIR) if f.startswith("gesture_") and f.endswith(".webm")]
    if not existing_files:
        return "gesture_1.webm"
    
    existing_ids = [int(f.split("_")[-1].split(".")[0]) for f in existing_files if f.split("_")[-1].split(".")[0].isdigit()]
    next_id = max(existing_ids, default=0) + 1
    return f"gesture_{next_id}.webm"

def extract_frames(video_path, fps, duration):
    """Extract frames from the video at a specific FPS and duration."""
    os.makedirs(FRAME_DIR, exist_ok=True)

    # Open the video file
    video = cv2.VideoCapture(video_path)
    if not video.isOpened():
        print(f"❌ ERROR: Cannot open video {video_path}")
        return []

    frame_rate = video.get(cv2.CAP_PROP_FPS)
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))

    # ❗ Debugging Logs
    print(f"📹 Video Path: {video_path}")
    print(f"ℹ️ Video FPS: {frame_rate}, Total Frames: {total_frames}")

    # Check for invalid frame count
    if total_frames <= 0:
        print(f"❌ ERROR: Invalid total frame count ({total_frames}). Retrying...")
        total_frames = 10 * frame_rate  # Estimate frames manually for 10 seconds

    if frame_rate is None or frame_rate <= 0:
        print(f"❌ ERROR: Could not determine FPS. Got {frame_rate}")
        return []

    frame_interval = max(1, int(frame_rate / fps))

    print(f"ℹ️ Extracting {fps} frames per second for {duration} seconds...")
    print(f"ℹ️ Frame interval: {frame_interval}")

    extracted_frames = []
    frame_count = 0
    saved_frames = 0

    while frame_count < total_frames:
        ret, frame = video.read()
        if not ret:
            print(f"⚠️ WARNING: Frame {frame_count} could not be read.")
            break

        if frame_count % frame_interval == 0:
            frame_filename = f"frame_{saved_frames}.jpg"
            frame_path = os.path.join(FRAME_DIR, frame_filename)
            cv2.imwrite(frame_path, frame)
            extracted_frames.append(frame_filename)
            print(f"✅ Frame saved: {frame_filename}")
            saved_frames += 1  

        frame_count += 1

        if saved_frames >= fps * duration:
            print(f"✅ Stopped at frame {frame_count}, extracted {saved_frames} frames.")
            break

    video.release()
    print(f"✅ Total Extracted Frames: {len(extracted_frames)}")
    return extracted_frames





@app.post("/upload-video/")
async def upload_video(video: UploadFile = File(...),  fps: int = Form(...), duration: int = Form(...)):
    try:
        # Generate a unique ID for the video to avoid conflicts
        video_id = str(uuid.uuid4())
        video_path = os.path.join(UPLOAD_DIR, f"{video_id}.webm")

        # ✅ Save the uploaded video file
        with open(video_path, "wb") as buffer:
            buffer.write(await video.read())

        print(f"✅ Video saved at: {video_path}")  # Debugging print


        # ✅ Extract frames from the uploaded video
        extracted_frames = extract_frames(video_path, fps, duration)


        return {"message": "Video uploaded and frames extracted successfully", "frames": extracted_frames}
    
    except Exception as e:
        return {"error": str(e)}


@app.get("/frames/{filename}")
async def get_frame(filename: str):
    """Serve a frame image to the frontend."""
    frame_path = os.path.join(FRAME_DIR, filename)
    if os.path.exists(frame_path):
        return FileResponse(frame_path)
    return JSONResponse(status_code=404, content={"message": "Frame not found"})

@app.get("/videos")
def list_videos():
    try:
        # List all videos in the uploads folder
        videos = [f for f in os.listdir(UPLOAD_DIR) if f.endswith(".webm")]
        return videos
    except Exception as e:
        return {"error": str(e)}


@app.post("/predict/")
async def predict():
    try:
        # Find the latest processed sequence (gesture video folder)
        latest_video = sorted(os.listdir(FRAME_DIR))[-1]
        video_sequence = [os.path.join(FRAME_DIR, latest_video, f) for f in sorted(os.listdir(os.path.join(FRAME_DIR, latest_video)))]

        # Predict the gesture using your machine learning model
        gesture = predict_gesture(video_sequence)
        return {"gesture": f"Predicted SOS Gesture {gesture}"}
    
    except Exception as e:
        return {"error": str(e)}
