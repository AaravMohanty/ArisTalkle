import os
import time
import json
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS

# Import functions for AI logic and video processing
from Gemini import generate_debate_response, generate_rubric, extract_scores_from_tex
from Text_To_Speech import text_to_speech
from fullSpeechToVideo import generate_video, poll_and_download

# Import Supabase client for handling audio uploads
from supabase import create_client, Client

from dotenv import load_dotenv
# Load environment variables from the .env file
load_dotenv()

# Access environment variables for API keys and Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
GOOGLE_GENAI_API_KEY = os.getenv("GOOGLE_GENAI_API_KEY")
CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")
SYNC_API_KEY = os.getenv("SYNC_API_KEY")

# Initialize Flask application
app = Flask(__name__)
# Enable CORS for all origins
CORS(app, origins=["*"])

# Define directories for file uploads and outputs
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Define the Supabase storage bucket name
BUCKET_NAME = "audio-bucket"  # Ensure this bucket exists and is publicly readable in Supabase

# Create a Supabase client instance
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def upload_to_supabase(local_path: str, remote_filename: str) -> str:
    """Uploads a file to Supabase storage and returns the public URL."""
    response = supabase.storage.from_("audio-bucket").upload(
        remote_filename,
        local_path,
    )
    print("Upload response:", response)
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{remote_filename}"
    return public_url

@app.route("/")
def home():
    """Endpoint to verify that the API is running."""
    return jsonify({"message": "AI Debate API is running!"})

@app.route("/upload", methods=["POST"])
def upload_video():
    """Receives a video file from the frontend and saves it locally."""
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    file = request.files["video"]
    video_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(video_path)

    return jsonify({"message": "Video uploaded successfully", "video_path": video_path})

@app.route("/process_video", methods=["POST"])
def process_video_endpoint():
    """Processes the uploaded video, generates AI responses, and serves the MP4 locally."""
    data = request.json
    video_path = data.get("video_path")
    if not video_path:
        return jsonify({"error": "Missing video path"}), 400

    if not GOOGLE_GENAI_API_KEY or not CARTESIA_API_KEY or not SYNC_API_KEY:
        return jsonify({"error": "Missing one or more required API keys"}), 500

    print("Generating Debate Response...")
    debate_text = generate_debate_response(GOOGLE_GENAI_API_KEY, video_path)

    print("Running text_to_speech...")
    audio_filename = "response_audio.wav"
    local_audio_path = os.path.join(OUTPUT_FOLDER, audio_filename)
    text_to_speech(CARTESIA_API_KEY, debate_text, local_audio_path)

    # Upload the audio file to Supabase
    audio_remote_name = f"audio_{int(time.time())}.wav"
    try:
        audio_url = upload_to_supabase(local_audio_path, audio_remote_name)
        print(f"Public Audio URL: {audio_url}")
    except ValueError as e:
        return jsonify({"error": f"Failed to upload audio to Supabase: {str(e)}"}), 500

    # Generate AI video
    print("Generating AI Video...")
    ai_video_filename = "output_video.mp4"
    local_ai_video_path = os.path.join(OUTPUT_FOLDER, ai_video_filename)

    job_id = generate_video(SYNC_API_KEY,
        "https://www.dropbox.com/scl/fi/ac4321y0somt6nkqk14n8/person_talking.mp4.mp4?rlkey=6sf3u7o4s4s4dr4uvbyt98qqp&st=8l6yipox&raw=1",
        audio_url
    )
    if not job_id:
        return jsonify({"error": "Failed to initiate video generation"}), 500

    # Wait for AI video to be processed and downloaded
    poll_and_download(SYNC_API_KEY, job_id)

    # Serve the generated MP4 video locally
    print(f"Video processing complete. Serving locally at /video/{ai_video_filename}")

    return jsonify({
        "message": "AI video generated successfully",
        "audio_url": audio_url,
        "video_url": f"http://127.0.0.1:5000/video/{ai_video_filename}"  # Local video serving URL
    })

@app.route("/video/<filename>")
def serve_video(filename):
    """Serves the generated AI video locally."""
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=False)

@app.route("/download_rubric", methods=["GET"])
def download_rubric():
    """Generates and serves the rubric LaTeX file to the frontend."""
    ai_video_filename = "output_video.mp4"
    video_path = os.path.join(OUTPUT_FOLDER, ai_video_filename)

    try:
        rubric_path = generate_rubric(os.getenv("GOOGLE_GENAI_API_KEY"), video_path)
        if os.path.exists(rubric_path):
            return send_file(rubric_path, as_attachment=True)
        return jsonify({"error": "Rubric file not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to generate rubric: {str(e)}"}), 500

@app.route("/extract_scores", methods=["GET"])
def extract_scores():
    """Extracts scores from the generated rubric and returns them as JSON."""
    tex_file_path = "output/rubric.tex"
    json_file_path = "output/scores.json"

    try:
        extract_scores_from_tex(tex_file_path, json_file_path)

        # Load the extracted scores from the JSON file
        with open(json_file_path, "r", encoding="utf-8") as f:
            scores_data = json.load(f)

        print("Extracted Scores:", scores_data)  # Log extracted scores
        return jsonify(scores_data)
    except Exception as e:
        return jsonify({"error": f"Failed to extract scores: {str(e)}"}), 500

if __name__ == "__main__":
    # Run the Flask application in debug mode on port 5000
    app.run(debug=True, port=5000)
