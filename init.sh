#!/bin/bash

# Create backend folders
mkdir -p backend/{models,processing,video_storage,frame_storage}
touch backend/{main.py,requirements.txt}
touch backend/processing/{video_processing.py,ml_pipeline.py}

# Create frontend folders
mkdir -p frontend/src
touch frontend/{package.json,App.js}

# Create shell script for easy execution
echo "Project structure created!"
