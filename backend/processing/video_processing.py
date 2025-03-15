import cv2
import os

FRAME_DIR = "backend/frame_storage"

def process_video(video_path):
    os.makedirs(FRAME_DIR, exist_ok=True)
    
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    video_name = os.path.basename(video_path).split('.')[0]
    sequence_dir = os.path.join(FRAME_DIR, video_name)

    os.makedirs(sequence_dir, exist_ok=True)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_filename = os.path.join(sequence_dir, f"frame_{frame_count:04d}.jpg")
        cv2.imwrite(frame_filename, frame)
        frame_count += 1

    cap.release()
