import requests
import time

# Define API request URL
job_id = "a7632e75-adb8-4dc3-b92b-265cda7e6eed"
url = f"https://api.sync.so/v2/generate/{job_id}"
headers = {"x-api-key": "sk-bsCWymbQTGOdz8pDgXfUzw.bLxkLeJ_tHxhifLXgw7WQynJ4FmnjOjJ"}

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
                    with open("output_video.mp4", "wb") as file:
                        for chunk in output_response.iter_content(chunk_size=1024):
                            file.write(chunk)
                    print("Download complete: output_video.mp4")
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
