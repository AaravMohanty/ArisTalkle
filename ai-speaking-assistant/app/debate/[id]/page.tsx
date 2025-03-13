"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const debateStages = [
  "Opening",
  "Questioning",
  "Rebuttals",
  "Closing Statements",
];

export default function DebateRoom({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [debate, setDebate] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState(3);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [AIResponse, setAIResponse] = useState<string | null>(null);
  const [videoPlayed, setVideoPlayed] = useState(false); // ✅ Track if video finished

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(`/api/debates/${params.id}`);
        if (response.ok) {
          const debateData = await response.json();
          setDebate(debateData);
        } else {
          console.error("Failed to fetch debate");
        }
      } catch (error) {
        console.error("Error fetching debate:", error);
      }
    };

    fetchDebate();
  }, [params.id]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("video", file);

      setVideoUploaded(true);

      try {
        // ✅ Send the video to Flask
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload video");

        const data = await response.json();
        console.log("Video uploaded successfully:", data.video_path);

        // ✅ Step 2: Process the video with Flask
        const processResponse = await fetch(
          "http://127.0.0.1:5000/process_video",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ video_path: data.video_path }),
          }
        );

        if (!processResponse.ok) throw new Error("Failed to process video");

        const processData = await processResponse.json();
        console.log("Processing complete:", processData);

        // ✅ Set AI video URL in state (received from backend)
        setAIResponse(processData.video_url);
      } catch (error) {
        console.error("Error uploading or processing video:", error);
      }
    }
  };

  const handleProceed = () => {
    if (currentStage === debateStages.length - 1) {
      router.push(`/debate/${params.id}/result`);
    } else {
      setCurrentStage(currentStage + 1);
      setVideoUploaded(false);
      setAIResponse(null);
      setVideoPlayed(false); // ✅ Reset for next stage
    }
  };

  if (!debate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">Debate Room</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Engage in a structured debate with Aristotle
      </p>

      <div className="mb-8">
        <ProgressIndicator
          currentStage={currentStage}
          totalStages={debateStages.length}
        />
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {debateStages[currentStage].charAt(0).toUpperCase() +
              debateStages[currentStage].slice(1)}
          </CardTitle>
          <CardDescription>
            Topic: {debate.topic} | Education Level: {debate.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!videoUploaded ? (
            <div className="text-center">
              <p className="mb-4">
                Upload your video for the {debateStages[currentStage]} stage:
              </p>
              <Label htmlFor="video-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition duration-300">
                  <span className="text-gray-600">Click to upload video</span>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </div>
              </Label>
            </div>
          ) : AIResponse ? (
            <div>
              <h3 className="font-semibold mb-2">Aristotle's Response:</h3>
              <video
                className="w-full aspect-video bg-gray-200"
                controls
                onEnded={() => setVideoPlayed(true)} // ✅ Only allow proceeding when video finishes
              >
                <source src={AIResponse} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button
                className="mt-4 w-full"
                onClick={handleProceed}
                disabled={!videoPlayed} // ✅ Disable until video is watched
              >
                {currentStage === debateStages.length - 1
                  ? "Finish Debate"
                  : "Proceed to Next Stage"}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p>Aristotle is pondering...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressIndicator({
  currentStage,
  totalStages,
}: {
  currentStage: number;
  totalStages: number;
}) {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalStages }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${
            index <= currentStage ? "bg-blue-600" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}