import requests
import time
import os

def generate_video(api_key, video_url, audio_url):
    """
    Sends a request to Sync.so to generate a video and returns the job_id.
    """
    url = "https://api.sync.so/v2/generate"

    payload = {
        "model": "lipsync-1.9.0-beta",
        "input": [
            {
                "type": "video",
                "provider": {
                    "name": "elevenlabs",
                    "voiceId": "CwhRBWXzGAHq8TQ4Fs17",
                    "script": "hello i am great"
                },
                "url": video_url
            },
            {
                "type": "audio",
                "url": audio_url,
                "provider": {
                    "name": "elevenlabs",
                    "voiceId": "CwhRBWXzGAHq8TQ4Fs17",
                    "script": "Hi im awesome"
                }
            }
        ]
    }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 201:
        data = response.json()
        job_id = data.get("id")
        if job_id:
            print(f"Job created successfully. Job ID: {job_id}")
            return job_id
        else:
            print("Failed to retrieve job ID.")
            return None
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

def poll_and_download(api_key, job_id):
    """
    Polls Sync.so API for job status and downloads the completed MP4 file.
    """
    url = f"https://api.sync.so/v2/generate/{job_id}"
    headers = {"x-api-key": api_key}

    # Use an absolute path for the output directory
    base_dir = os.path.abspath(os.path.dirname(__file__))
    output_dir = os.path.join(base_dir, "output")

    # Create the directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    print(f"Checking status for Job ID: {job_id}")

    # Polling loop
    while True:
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            status = data.get("status")

            print(f"Current Status: {status}")

            if status == "COMPLETED":
                output_url = data.get("outputUrl")

                if output_url:
                    print(f"Output ready: {output_url}")

                    # Download the output video
                    output_response = requests.get(output_url, stream=True)

                    if output_response.status_code == 200:
                        output_file = os.path.join(output_dir, "output_video.mp4")
                        with open(output_file, "wb") as file:
                            for chunk in output_response.iter_content(chunk_size=1024):
                                file.write(chunk)
                        print(f"Download complete: {output_file}")
                    else:
                        print(f"Failed to download file: {output_response.status_code}")

                    break  # Exit loop after downloading
                else:
                    print("Output URL not found.")
                    break  # Stop polling if something is wrong

            elif status in ["FAILED", "ERROR"]:
                print("Job failed. Exiting polling.")
                break  # Stop polling if the job fails

        else:
            print(f"Error fetching status: {response.status_code}")
            print(response.text)
            break  # Stop polling if there's an API issue

        # Wait 5 seconds before checking again
        time.sleep(5)

    print("Process completed.")
