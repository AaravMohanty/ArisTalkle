import os
from google import genai
import time
import sys
import subprocess

# Retrieve the API key from environment variables
api_key = os.getenv("GOOGLE_GENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found! Set GOOGLE_GENAI_API_KEY in your environment variables.")

# Initialize the client with the API key
client = genai.Client(api_key=api_key)

if len(sys.argv) > 1:
    mp4_file_path = sys.argv[1]
else:
    # Fallback or raise an error
    raise ValueError("No MP4 file specified. Provide a filename as the first argument.")

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
video_file = client.files.upload(file=mp4_file_path)
print(f"Completed upload: {video_file.uri}")

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

rubric = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[video_file, rubric_prompt]
)

if not os.path.exists("output"):
    os.makedirs("output")

# Trim the rubric text
rubric_lines = rubric.text.split("\n")
trimmed_rubric = "\n".join(rubric_lines[1:-1])

# Write to output/rubric.tex
tex_path = os.path.join("output", "rubric.tex")
with open(tex_path, "w") as f:
    f.write(trimmed_rubric)

print("LaTeX code saved to output/rubric.tex")

# Compile rubric.tex in the output folder
# pdflatex has a flag to specify the output directory.
try:
    subprocess.run(["pdflatex", 
                    "-output-directory=output", tex_path], check=True)
    print("PDF generated: output/rubric.pdf")

    # Clean up auxiliary files in the output folder
    for ext in [".aux", ".log", ".tex"]:
        aux_file = os.path.join("output", f"rubric{ext}")
        if os.path.exists(aux_file):
            os.remove(aux_file)

    print("Cleaned up auxiliary files in output/")

except subprocess.CalledProcessError as e:
    print(f"Error compiling LaTeX: {e}")
# Function to provide response text to Text_To_Speech.py
def get_response_text():
    return response.text
