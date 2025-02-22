import requests

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
            "url": "https://lfldehquopamazavycth.supabase.co/storage/v1/object/public/sync-public/david_demo_shortvid.mp4?t=2023-10-12T08%3A14%3A44.537Z"
        },
        {
            "type": "audio",
            "url": "https://www.dropbox.com/scl/fi/17osslll0x5cjn2os4frj/sonic_output.wav?rlkey=4svebnvp75ln52hqh6c9ak60x&st=2utluuaf&raw=1",
            "provider": {
                "name": "elevenlabs",
                "voiceId": "CwhRBWXzGAHq8TQ4Fs17",
                "script": "Hi im awesome"
            }
        }
    ]
}
headers = {
    "x-api-key": "API_KEY_HERE",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)

print(response.text)