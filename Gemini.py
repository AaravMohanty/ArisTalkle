from google import genai
import time
import subprocess

client = genai.Client(api_key="API_KEY")
'''
The level of difficulty chosen in a dropdown: 
beginner, middle schooler, high schooler, collegiate, professional

Let the user input from dropdown the side they want the AI to take (affirmative or negation)
'''
difficulty = "High School"
side = "Negation"
rubric = "Give the speaker a rubric rating on these 5 categories on a scale of 0-100 for tone/inflection, information, use of facts/statistics, organization, and understanding of topic, and write them out of 100, and put an overall grade based on the average score. Then, compose a rubric report for the speaker with comments on what they did and what they can improve on, and give me the output in LaTeX. Don't put any of your comments outside the latex, I just want the LaTeX code so I can directly put it into a converter. Try to make it one page long max."
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
    "You are debating this speaker. Provide an argument for the " + side + " side, in under 250 words, and at a " + difficulty + " level of competition (your difficulty)"]
)

rubric = client.models.generate_content(
    model="gemini-2.0-flash", contents=[video_file, rubric]
)

print(response.text)

# Split the response text into lines
rubric_lines = rubric.text.split("\n")

# Remove the first and last lines
trimmed_rubric = "\n".join(rubric_lines[1:-1])

# Write to rubric.tex
with open("rubric.tex", "w") as f:
    f.write(trimmed_rubric)

'''
with open("rubric.tex", "w") as f:
    f.write(rubric.text)
'''
print("LaTeX code saved to rubric.tex")

# Compile rubric.tex directly with pdflatex
try:
    subprocess.run(["pdflatex", "rubric.tex"], check=True)
    print("PDF generated: rubric.pdf")
except subprocess.CalledProcessError as e:
    print(f"Error compiling LaTeX: {e}")
