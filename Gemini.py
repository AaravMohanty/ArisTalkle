import os
from google import genai
import time
import subprocess

# Retrieve the API key from environment variables
api_key = os.getenv("GOOGLE_GENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found! Set GOOGLE_GENAI_API_KEY in your environment variables.")

# Initialize the client with the API key
client = genai.Client(api_key=api_key)

# Define debate parameters
difficulty = "High School"
side = "Negation"
rubric_prompt = (
    "Give the speaker a rubric rating on these 5 categories on a scale of 0-100 for "
    "tone/inflection, information, use of facts/statistics, organization, and "
    "understanding of topic, and write them out of 100, and put an overall grade "
    "based on the average score. Then, compose a rubric report for the speaker "
    "with comments on what they did and what they can improve on, and give me the "
    "output in LaTeX. Don't put any of your comments outside the latex, I just want "
    "the LaTeX code so I can directly put it into a converter. Try to make it one "
    "page long max."
)

# Upload the video file
print("Uploading file...")
video_file = client.files.upload(file="PXL_20250222_055516937.mp4")
print(f"Completed upload: {video_file.uri}")

# Wait for the file to process
while video_file.state.name == "PROCESSING":
    print('.', end='')
    time.sleep(1)
    video_file = client.files.get(name=video_file.name)

if video_file.state.name == "FAILED":
    raise ValueError(f"File processing failed: {video_file.state.name}")

print('Done')

# Generate the debate response
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[
        video_file,
        f"You are debating this speaker. Provide an argument for the {side} side, "
        f"in under 250 words, and at a {difficulty} level of competition (your difficulty)"
    ]
)

# Generate the rubric
rubric = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[video_file, rubric_prompt]
)

# Print the debate response
print(response.text)

# Trim the rubric text (remove first and last lines if needed)
rubric_lines = rubric.text.split("\n")
trimmed_rubric = "\n".join(rubric_lines[1:-1])

# Write the rubric to a .tex file
with open("rubric.tex", "w") as f:
    f.write(trimmed_rubric)

print("LaTeX code saved to rubric.tex")

# Compile the LaTeX file to PDF
try:
    subprocess.run(["pdflatex", "rubric.tex"], check=True)
    print("PDF generated: rubric.pdf")
except subprocess.CalledProcessError as e:
    print(f"Error compiling LaTeX: {e}")

# Function to provide response text to Text_To_Speech.py
def get_response_text():
    return response.text
