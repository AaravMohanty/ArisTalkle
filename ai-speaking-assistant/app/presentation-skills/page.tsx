"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PresentationSkillsPage() {
  const [videoUploaded, setVideoUploaded] = useState(false);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate video upload
      setTimeout(() => {
        setVideoUploaded(true);
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">Improve Your Speaking Skills</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Upload your video and receive feedback from Aristotle.
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Video</CardTitle>
          <CardDescription>Let Aristotle analyze your presentation skills and provide insights.</CardDescription>
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
          ) : (
            <div>
              <h3 className="font-semibold mb-2">Aristotle's Response:</h3>
              <video className="w-full aspect-video bg-gray-200" controls>
                <source src="/placeholder-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
