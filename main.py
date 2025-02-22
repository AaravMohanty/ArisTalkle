# main.py
import sys
import subprocess

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <video_file.mp4>")
        sys.exit(1)

    mp4_file_path = sys.argv[1]

    # Run Text_To_Speech.py, forwarding the MP4 filename
    try:
        subprocess.run(["python", "Text_To_Speech.py", mp4_file_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running Text_To_Speech.py: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
