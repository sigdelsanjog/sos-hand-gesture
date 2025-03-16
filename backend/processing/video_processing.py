import cv2
import os

def extract_frames_from_video(video_path, fps, frame_dir):
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    
    # Get video information
    video_fps = cap.get(cv2.CAP_PROP_FPS)  # Actual FPS of the video
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_duration = total_frames / video_fps  # Total video duration in seconds
    
    frames_to_extract = fps * total_duration  # Total frames to extract based on FPS and video duration
    frame_interval = video_fps / fps  # Interval between frames to extract
    
    extracted_frames = []
    count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        if count % frame_interval < 1:  # Only extract frame at the specified interval
            frame_name = f"gesture_{int(count)}.jpg"
            frame_path = os.path.join(frame_dir, frame_name)
            cv2.imwrite(frame_path, frame)  # Save frame as an image
            extracted_frames.append(frame_name)
        
        count += 1

    cap.release()
    return extracted_frames
