import os
import time
import subprocess
import json
import random
from google import genai

def with_exponential_backoff(func, max_retries=5, base_delay=1, max_delay=32, jitter=True):
    """
    Retries a function using exponential backoff strategy.
    If the function raises an exception, it retries with increasing delay.
    """
    attempt = 0
    while attempt < max_retries:
        try:
            return func()
        except Exception as e:
            wait_time = min(base_delay * (2 ** attempt), max_delay)
            if jitter:
                wait_time += random.uniform(0, 1)
            print(f"Error: {e}. Retrying in {wait_time:.2f}s...")
            time.sleep(wait_time)
            attempt += 1
    raise RuntimeError(f"Function failed after {max_retries} retries.")

def generate_debate_response(api_key, video_path, difficulty="High School", side="Negation"):
    """
    Uses Gemini API to process a video file and generate counterpoints for the debate.
    Returns the response text.
    """
    client = genai.Client(api_key=api_key)

    video_file = with_exponential_backoff(lambda: client.files.upload(file=video_path))

    # Poll until processing finishes
    def wait_for_processing():
        while video_file.state.name == "PROCESSING":
            time.sleep(1)
            updated = client.files.get(name=video_file.name)
            if updated.state.name == "FAILED":
                raise ValueError("File processing failed.")
            video_file.state = updated.state
        return video_file

    video_file = with_exponential_backoff(wait_for_processing)

    def generate():
        return client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                video_file,
                f"You are debating this speaker. Provide an argument for the {side} side, "
                f"in under 200 words, at a {difficulty} level. Be to the point in the manner of a debater."
            ]
        )

    response = with_exponential_backoff(generate)

    return response.text

def generate_rubric(api_key, video_path, output_path="output/rubric.tex"):
    """
    Uses Gemini API to evaluate the debate performance and generate a rubric in LaTeX format.
    Also compiles the LaTeX into a PDF (quietly).
    Returns the path to the generated PDF.
    """
    client = genai.Client(api_key=api_key)

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

    def generate():
        return client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[video_path, rubric_prompt]
        )

    rubric_response = with_exponential_backoff(generate)

    rubric_lines = rubric_response.text.split("\n")
    trimmed_rubric = "\n".join(rubric_lines[1:-1])  # optional trimming

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(trimmed_rubric)

    try:
        subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", "-output-directory", "output", output_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        for ext in [".aux", ".log", ".out"]:
            aux_file = os.path.join("output", f"rubric{ext}")
            if os.path.exists(aux_file):
                os.remove(aux_file)
    except subprocess.CalledProcessError as e:
        print(f"Error compiling LaTeX: {e}")

    return "output/rubric.pdf"

def extract_scores_from_tex(tex_file_path, json_file_path):
    """
    Looks for lines of the form:
      \item Category: 65/100
    and extracts the integer (e.g., 65) as the score.
    Writes a JSON dict { "Category": 65 } to json_file_path.
    """
    scores = {}
    with open(tex_file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith(r"\item") and "/100" in line:
                parts = line.split(":", maxsplit=1)
                if len(parts) == 2:
                    category_part = parts[0].replace(r"\item", "").strip()
                    score_part = parts[1].strip()
                    if "/100" in score_part:
                        score_value_str = score_part.split("/")[0].strip()
                        try:
                            score_value = int(score_value_str)
                            scores[category_part] = score_value
                        except ValueError:
                            pass

    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(scores, f, indent=2)
