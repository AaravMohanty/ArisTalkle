# Text_To_Speech.py
import os
import sys
import subprocess
from cartesia import Cartesia
from Gemini import get_response_text

def main():
    # Make sure we got an MP4 file
    if len(sys.argv) < 2:
        print("Usage: python Text_To_Speech.py <video_file.mp4>")
        sys.exit(1)

    # We won't actually use mp4_file_path directly here, because Gemini.py
    # will pick up sys.argv[1]. But let's read it to ensure the user passed it.
    mp4_file_path = sys.argv[1]

    # Initialize Cartesia TTS
    API_KEY = os.environ.get("CARTESIA_API_KEY")
    if not API_KEY:
        raise ValueError("CARTESIA_API_KEY is not set. Please set it as an environment variable.")

    client = Cartesia(api_key=API_KEY)

    # Once imported, Gemini.py has already executed and saved its output.
    # We just call get_response_text() to get the debate response.
    response_text = get_response_text()

    os.makedirs("output", exist_ok=True)

    # Generate audio
    try:
        audio_data = client.tts.bytes(
            model_id="sonic",  # Adjust if needed
            transcript=response_text,
            voice_id="694f9389-aac1-45b6-b726-9d9369183238",
            output_format={
                "container": "mp3",
                "encoding": "pcm_f32le",
                "sample_rate": 44100,
            },
        )

        # Save the audio to a file
        output_file = os.path.join("output", "sonic_output.wav")
        with open(output_file, "wb") as f:
            f.write(audio_data)

        print(f"Audio file saved as {output_file}")

    except Exception as e:
        print("Error occurred during TTS generation:", e)

if __name__ == "__main__":
    main()
