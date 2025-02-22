import os
import subprocess
from cartesia import Cartesia
from Gemini import get_response_text

# Retrieve the Cartesia API key from environment variables
API_KEY = os.environ.get("CARTESIA_API_KEY")
if not API_KEY:
    raise ValueError("CARTESIA_API_KEY is not set. Please set it as an environment variable.")

# Initialize the Cartesia client
client = Cartesia(api_key=API_KEY)

# Get the response text from gemini.py
response_text = get_response_text()

try:
    # Generate audio from the response text
    audio_data = client.tts.bytes(
        model_id="sonic",  # Ensure this model ID is valid for your Cartesia account
        transcript=response_text,
        voice_id="694f9389-aac1-45b6-b726-9d9369183238",  # Example: Barbershop Man
        output_format={
            "container": "mp3",
            "encoding": "pcm_f32le",
            "sample_rate": 44100,
        },
    )
    
    # Save the audio to a file
    output_file = "sonic_output.mp3"
    with open(output_file, "wb") as f:
        f.write(audio_data)

    print(f"Audio file saved as {output_file}")

    # Play the audio file using ffplay (requires ffmpeg)
    subprocess.run(["ffplay", "-autoexit", "-nodisp", output_file])

except Exception as e:
    print("Error occurred during TTS generation:", e)
