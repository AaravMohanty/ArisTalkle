# ArisTalkle

## Overview

ArisTalkle is a Flask-based application that allows users to engage in structured debates with AI-generated responses. The system processes user-uploaded videos, generates debate responses using Google Gemini AI, converts responses into speech, and synchronizes speech with an AI-generated video.

## Features

- **AI Debate Response**: Generates structured debate arguments based on uploaded video content.
- **Text-to-Speech Conversion**: Uses Cartesia's Sonic AI to convert AI-generated debate responses into spoken audio.
- **AI Video Generation**: Syncs AI-generated speech with lip-synced video using Sync.so.
- **Rubric-Based Evaluation**: Assesses debate performance and generates a rubric in LaTeX format.
- **Web Interface**: A React (Next.js) frontend for an interactive debate experience.

## Technologies Used

- **Database**: MongoDB for storing user data and debate records
- **Backend**: Flask, Google Gemini AI, Cartesia's Sonic AI, Sync.so
- **Frontend**: Next.js (React)
- **Database & Storage**: Supabase (for audio storage)
- **Other**: LaTeX for rubric generation, ElevenLabs for voice processing

## Installation

### Prerequisites

- Python 3.8+
- Node.js (for frontend)
- Required API Keys:
  - Google Gemini AI (`GOOGLE_GENAI_API_KEY`)
  - Cartesia's Sonic AI (`CARTESIA_API_KEY`)
  - Sync.so (`SYNC_API_KEY`)
  - Supabase Storage (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/BoilerMakeXII.git
   cd BoilerMakeXII
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Set up environment variables: Create a `.env` file with the following:
   ```env
   GOOGLE_GENAI_API_KEY=your_google_api_key
   CARTESIA_API_KEY=your_sonic_ai_key
   SYNC_API_KEY=your_sync_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the backend:
   ```sh
   python app.py
   ```
5. Start the frontend:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

## License

This project is licensed under the MIT License.
