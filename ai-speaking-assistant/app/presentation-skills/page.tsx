"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PresentationSkillsPage() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [rubricAvailable, setRubricAvailable] = useState(false);
  const [rubricUrl, setRubricUrl] = useState("");

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("video", file);

      setVideoUploaded(true);

      try {
        // ✅ Upload the video
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload video");

        const data = await response.json();
        console.log("Video uploaded successfully:", data.video_path);

        // ✅ Step 2: Fetch the rubric
        const rubricResponse = await fetch("http://127.0.0.1:5000/download_rubric");

        if (!rubricResponse.ok) throw new Error("Failed to download rubric");

        // ✅ Prepare download link
        const blob = await rubricResponse.blob();
        const url = window.URL.createObjectURL(blob);
        setRubricUrl(url);
        setRubricAvailable(true);
      } catch (error) {
        console.error("Error in video processing or rubric generation:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Improve Your Speaking Skills</h1>
      <p className="text-xl text-gray-600 mb-8">
        Upload your video and receive feedback from Aristotle in the form of a detailed rubric.
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Video</CardTitle>
          <CardDescription>Aristotle will analyze your speaking skills and provide a rubric evaluation.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {!videoUploaded ? (
            <div>
              <Label htmlFor="video-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition duration-300">
                  <span className="text-gray-600">Click to upload your practice video</span>
                  <Input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </div>
              </Label>
            </div>
          ) : rubricAvailable ? (
            <div>
              <h3 className="font-semibold mb-4">Rubric Generated:</h3>
              <Button asChild>
                <a href={rubricUrl} download="rubric.pdf">Download Rubric</a>
              </Button>
            </div>
          ) : (
            <p>Aristotle is analyzing your presentation...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}