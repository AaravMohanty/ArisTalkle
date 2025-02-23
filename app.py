from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from Gemini import generate_debate_response, generate_rubric
from Text_To_Speech import text_to_speech
from fullSpeechToVideo import generate_video, poll_and_download
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow Next.js frontend to access Flask backend

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return jsonify({"message": "AI Debate API is running!"})

@app.route("/upload", methods=["POST"])
def upload_video():
    """Handles video upload from Next.js frontend."""
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files["video"]
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    return jsonify({"message": "Video uploaded successfully", "video_path": video_path})

@app.route("/audio/<filename>")
def serve_audio(filename):
    """Serves the generated audio file so it can be accessed via a URL."""
    return send_from_directory(OUTPUT_FOLDER, filename)

@app.route("/process_video", methods=["POST"])
def process_video():
    """Processes the uploaded video to generate AI response."""
    data = request.json
    video_path = data.get("video_path")
    api_key = os.getenv("GOOGLE_GENAI_API_KEY")

    if not video_path:
        return jsonify({"error": "Missing video path"}), 400

    print("Generating Debate Response")
    # Step 1: Generate AI counterpoints
    debate_text = generate_debate_response(api_key, video_path)

    print("Running text_to_speech")
    # Step 2: Convert AI response to speech
    audio_filename = "response_audio.wav"
    audio_path = text_to_speech(os.getenv("CARTESIA_API_KEY"), debate_text, os.path.join(OUTPUT_FOLDER, audio_filename))

    print("Generating AI Video")
    # Step 3: Use localhost URL for the generated audio file
    audio_url = f"http://127.0.0.1:5000/audio/{audio_filename}"

    print("audio_url: " + audio_url)
    job_id = generate_video(os.getenv("SYNC_API_KEY"), 
                            "https://lfldehquopamazavycth.supabase.co/storage/v1/object/public/sync-public/david_demo_shortvid.mp4?t=2023-10-12T08%3A14%3A44.537Z",
                            audio_url)

    if job_id:
        poll_and_download(os.getenv("SYNC_API_KEY"), job_id)
        ai_video_path = os.path.join(OUTPUT_FOLDER, "output_video.mp4")
        return jsonify({"message": "AI video generated successfully", "video_url": ai_video_path})

    return jsonify({"error": "Failed to generate video"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
