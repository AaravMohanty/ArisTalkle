from google import genai
import time
from IPython.display import Markdown


client = genai.Client(api_key="AIzaSyCiC8PLJZI-KSyJSNPH-tjui06OKRFc7II")
'''
The level of difficulty chosen in a dropdown: 
beginner, middle schooler, high schooler, collegiate, professional

Let the user input from dropdown the side they want the AI to take (affirmative or negation)
'''
difficulty = "High School"
side = "Negation"
print("Uploading file...")
video_file = client.files.upload(file="PXL_20250222_055516937.mp4")
print(f"Completed upload: {video_file.uri}")

while video_file.state.name == "PROCESSING":
    print('.', end='')
    time.sleep(1)
    video_file = client.files.get(name=video_file.name)

if video_file.state.name == "FAILED":
  raise ValueError(video_file.state.name)

print('Done')

response = client.models.generate_content(
    model="gemini-2.0-flash", contents=[video_file, 
    "You are debating this speaker. Provide an argument for the " + side " side, in under 250 words, and at a " + difficulty + " level of competition (your difficulty)"]
)

print(response.text)