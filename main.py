from Gemini import generate_debate_response
from Gemini import generate_rubric
from Text_To_Speech import text_to_speech
from fullSpeechToVideo import generate_video
from fullSpeechToVideo import poll_and_download
import os
import certifi
import ssl
import requests

session = requests.Session()
session.verify = certifi.where()
def main():
    # API keys
    #GEMINI_API_KEY = "your-gemini-api-key"
    #SONIC_API_KEY = "your-sonic-api-key"
    #D_ID_API_KEY = "your-d-id-api-key"

    # User uploaded video path
    user_video_path = "video.mp4"
    

    # Step 1: Generate AI counterpoints
    debate_text = generate_debate_response(os.getenv("GOOGLE_GENAI_API_KEY"), user_video_path)
    print(f"Debate Response:\n{debate_text}")

    # Step 2: Convert AI response to speech
    audio_path = text_to_speech(os.getenv("CARTESIA_API_KEY"), debate_text)
    print(f"Audio generated at: {audio_path}")

    #step 3: make the video
    api_key = "sk-bsCWymbQTGOdz8pDgXfUzw.bLxkLeJ_tHxhifLXgw7WQynJ4FmnjOjJ"  # Replace with your actual API key
    video_url = "https://lfldehquopamazavycth.supabase.co/storage/v1/object/public/sync-public/david_demo_shortvid.mp4?t=2023-10-12T08%3A14%3A44.537Z"
    audio_url = "https://www.dropbox.com/scl/fi/ikb0mu6rz30rnexd7c3ct/response_audio.wav?rlkey=6sdxkqi4cczejv2c094yvikz5&st=h6wa40jq&raw=1"

    job_id = generate_video(api_key, video_url, audio_url)

    if job_id:
        print("Reached poll and download.")
        poll_and_download(api_key, job_id)

    # Step 4: Generate debate rubric & evaluation
    rubric_pdf_path = generate_rubric(os.getenv("GOOGLE_GENAI_API_KEY"), user_video_path)
    print(f"Rubric PDF generated at: {rubric_pdf_path}")
if __name__ == "__main__":
    main()
