import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, LSTM, Dense, TimeDistributed
import cv2
import os

MODEL_PATH = "backend/models/sos_model.h5"

def load_sequence(video_frames):
    sequence = []
    for frame_path in video_frames:
        img = cv2.imread(frame_path)
        img = cv2.resize(img, (64, 64))
        img = img / 255.0
        sequence.append(img)
    return np.array(sequence)

def train_model():
    model = Sequential([
        TimeDistributed(Conv2D(32, (3,3), activation='relu'), input_shape=(None, 64, 64, 3)),
        TimeDistributed(MaxPooling2D((2,2))),
        TimeDistributed(Flatten()),
        LSTM(64, return_sequences=False),
        Dense(3, activation='softmax')  # Assume 3 stress gestures
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    model.save(MODEL_PATH)

def predict_gesture(video_sequence):
    model = tf.keras.models.load_model(MODEL_PATH)
    X = load_sequence(video_sequence)
    X = np.expand_dims(X, axis=0)
    prediction = model.predict(X)
    return np.argmax(prediction)
