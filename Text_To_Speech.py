import os
from cartesia import Cartesia

def text_to_speech(api_key, text, output_path="output/response_audio.wav"):
    """
    Converts text to speech using Sonic.ai and saves as a WAV file.
    """
    client = Cartesia(api_key=api_key)

    # Generate speech from text
    audio_data = client.tts.bytes(
        model_id="sonic",
        transcript=text,
        voice_id="8d110413-2f14-44a2-8203-2104db4340e9",
        output_format={"container": "wav", "encoding": "pcm_f32le", "sample_rate": 44100},
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(audio_data)

    return output_path
