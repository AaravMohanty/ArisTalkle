from flask import Flask, request, jsonify
from Gemini import generate_debate_response, generate_rubric
from Text_To_Speech import text_to_speech
from fullSpeechToVideo import generate_video, poll_and_download
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

@app.route("/generate_debate", methods=["POST"])
def generate_debate():
    """Generates AI counterpoints for the debate."""
    data = request.json
    video_path = data.get("video_path")
    api_key = os.getenv("GOOGLE_GENAI_API_KEY")

    if not video_path:
        return jsonify({"error": "Missing video path"}), 400

    debate_text = generate_debate_response(api_key, video_path)
    return jsonify({"debate_response": debate_text})

@app.route("/text_to_speech", methods=["POST"])
def convert_text_to_speech():
    """Converts AI debate text to speech."""
    data = request.json
    text = data.get("text")
    api_key = os.getenv("CARTESIA_API_KEY")

    if not text:
        return jsonify({"error": "Missing text"}), 400

    audio_path = text_to_speech(api_key, text)
    return jsonify({"audio_path": audio_path})

@app.route("/generate_video", methods=["POST"])
def create_ai_video():
    """Generates an AI-driven lip-synced debate video."""
    data = request.json
    api_key = os.getenv("D_ID_API_KEY")
    video_url = data.get("video_url")
    audio_url = data.get("audio_url")

    if not video_url or not audio_url:
        return jsonify({"error": "Missing video or audio URL"}), 400

    job_id = generate_video(api_key, video_url, audio_url)
    if job_id:
        poll_and_download(api_key, job_id)
        return jsonify({"message": "AI video generated successfully", "video_path": "output/output_video.mp4"})

    return jsonify({"error": "Failed to generate video"}), 500

@app.route("/generate_rubric", methods=["POST"])
def evaluate_debate():
    """Evaluates the debate and generates a rubric PDF."""
    data = request.json
    video_path = data.get("video_path")
    api_key = os.getenv("GOOGLE_GENAI_API_KEY")

    if not video_path:
        return jsonify({"error": "Missing video path"}), 400

    rubric_pdf = generate_rubric(api_key, video_path)
    return jsonify({"rubric_pdf": rubric_pdf})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
