import dropbox
import time
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pyngrok import ngrok
from Gemini import generate_debate_response, generate_rubric
from Text_To_Speech import text_to_speech
from fullSpeechToVideo import generate_video, poll_and_download

app = Flask(__name__)
CORS(app, origins=["*"])  # Allow all origins

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Start ngrok and expose port 5000
public_url = public_url = ngrok.connect(5000).public_url
print(f"Publicly accessible URL: {public_url}")

@app.route("/")
def home():
    return jsonify({"message": "AI Debate API is running!", "public_url": public_url})

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
    """Serves the generated audio file so it can be accessed via ngrok."""
    return send_from_directory(OUTPUT_FOLDER, filename)

@app.route("/video/<filename>")
def serve_video(filename):
    """Serves the generated AI video file so it can be accessed via ngrok."""
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
    debate_text = generate_debate_response(api_key, video_path)

    print("Running text_to_speech")
    audio_filename = "response_audio.wav"
    local_audio_path = os.path.join(OUTPUT_FOLDER, audio_filename)
    text_to_speech(os.getenv("CARTESIA_API_KEY"), debate_text, local_audio_path)

    print("Generating AI Video")
    # Generate public URL for the local audio file via ngrok
    audio_url = f"{public_url}/audio/{audio_filename}"
    print(f"Public Audio URL: {audio_url}")

    ai_video_filename = "output_video.mp4"
    ai_video_path = os.path.join(OUTPUT_FOLDER, ai_video_filename)

    job_id = generate_video(os.getenv("SYNC_API_KEY"), 
                            "https://lfldehquopamazavycth.supabase.co/storage/v1/object/public/sync-public/david_demo_shortvid.mp4?t=2023-10-12T08%3A14%3A44.537Z",
                            audio_url)  # ✅ Use ngrok public URL for the audio

    if job_id:
        poll_and_download(os.getenv("SYNC_API_KEY"), job_id)

        # ✅ Expose the AI video via a public ngrok URL
        ai_video_url = f"{public_url}/video/{ai_video_filename}"
        print(f"Public AI Video URL: {ai_video_url}")

        return jsonify({"message": "AI video generated successfully", "video_url": ai_video_url})

    return jsonify({"error": "Failed to generate video"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
