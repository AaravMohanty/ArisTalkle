"use client";

import { useState, useEffect, useRef } from "react";
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
import { Loader2, UploadCloud } from "lucide-react"; // Icons

// Define stages - used for display and logic
const debateStages = [
  { id: "opening", label: "Opening Statement" },
  { id: "questioning", label: "Questioning/Cross-Examination" },
  { id: "rebuttals", label: "Rebuttals" },
  { id: "closing", label: "Closing Statement" },
];

// Helper function to format difficulty
const formatDifficulty = (difficulty: string | undefined): string => {
  switch (difficulty) {
    case "Easy": return "Elementary";
    case "Medium": return "High School";
    case "Hard": return "University";
    default: return "Unknown Level";
  }
}

export default function DebateRoom({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [debate, setDebate] = useState<any>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const [isProcessing, setIsProcessing] = useState(false); // Track AI processing state
  const [aiVideoUrl, setAiVideoUrl] = useState<string | null>(null);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Ref to control video

  // Define card styles consistent with the dark theme
  const cardBaseClasses = "bg-gray-900/60 border border-gray-700/50 backdrop-blur-sm rounded-xl shadow-lg";
  // Define input/select styles
  const inputBaseClasses = "bg-gray-800/70 border-gray-700 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 placeholder:text-gray-500 rounded-md shadow-sm";


  useEffect(() => {
    const fetchDebate = async () => {
      setError(null);
      try {
        const response = await fetch(`/api/debates/${params.id}`);
        if (response.ok) {
          const debateData = await response.json();
          setDebate(debateData);
          // Maybe load progress from debateData if stored?
          // setCurrentStageIndex(debateData.currentStage || 0);
        } else {
          console.error("Failed to fetch debate", response.status);
          setError(`Failed to load debate details (${response.statusText}).`);
          // Optionally redirect or show a more prominent error
        }
      } catch (error) {
        console.error("Error fetching debate:", error);
        setError("An error occurred while loading the debate.");
      }
    };

    fetchDebate();
  }, [params.id]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic client-side validation (optional)
      if (!file.type.startsWith("video/")) {
        setError("Invalid file type. Please upload a video file.");
        return;
      }
      // Add size limit check if needed

      const formData = new FormData();
      formData.append("video", file);

      setIsUploading(true);
      setIsProcessing(false);
      setError(null);
      setAiVideoUrl(null);
      setVideoPlayed(false);

      try {
        // 1. Send video to Flask for storage
        const uploadResponse = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Failed to upload video: ${errorText}`);
        }
        const uploadData = await uploadResponse.json();
        console.log("Video uploaded:", uploadData.video_path);
        setIsUploading(false); // Upload complete
        setIsProcessing(true); // Start processing phase

        // 2. Request video processing from Flask
        const processResponse = await fetch(
          "http://127.0.0.1:5000/process_video", // Make sure this endpoint is correct
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Send necessary info like video path, maybe debate context?
            body: JSON.stringify({
                video_path: uploadData.video_path,
                stage: debateStages[currentStageIndex].id, // Send stage context
                topic: debate?.topic, // Send topic context
                difficulty: debate?.difficulty // Send difficulty context
            }),
          }
        );

        if (!processResponse.ok) {
          const errorText = await processResponse.text();
          throw new Error(`Failed to process video: ${errorText}`);
        }
        const processData = await processResponse.json();
        console.log("Processing complete:", processData);

        // Assume processData.video_url is the URL to the AI's response video
        setAiVideoUrl(processData.video_url);

      } catch (error: any) {
        console.error("Error during upload/processing:", error);
        setError(error.message || "An unexpected error occurred during video handling.");
        setIsUploading(false);
      } finally {
        setIsProcessing(false); // Processing finished (successfully or not)
      }
    }
     // Reset file input to allow re-uploading the same file if needed
     if (e.target) {
        e.target.value = '';
    }
  };

  const handleProceed = () => {
    setError(null);
    if (currentStageIndex === debateStages.length - 1) {
      // Optional: Send final signal to backend before redirecting
      console.log("Finishing debate...");
      router.push(`/debate/${params.id}/result`);
    } else {
      setCurrentStageIndex(currentStageIndex + 1);
      setIsUploading(false); // Reset states for the next stage
      setIsProcessing(false);
      setAiVideoUrl(null);
      setVideoPlayed(false);
      // Reset video player if needed
      if (videoRef.current) {
          videoRef.current.src = ''; // Clear source
      }
    }
  };

  // Loading state for initial debate data fetch
  if (!debate && !error) {
    return (
        <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-400 min-h-screen font-sans flex flex-col justify-center items-center px-4 py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mb-4" />
            <p>Loading Debate Environment...</p>
        </div>
    );
  }

   // Error state for initial debate data fetch
  if (error && !debate) {
    return (
        <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-red-400 min-h-screen font-sans flex flex-col justify-center items-center px-4 py-12">
            <p className="text-lg mb-4">Error Loading Debate</p>
            <p className="text-sm text-center">{error}</p>
            <Button variant="outline" className="mt-6 border-gray-600 text-gray-300 hover:bg-gray-800" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
            </Button>
        </div>
    );
  }

  const currentStageData = debateStages[currentStageIndex];

  return (
    // Main container with dark theme
    <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-200 min-h-screen font-sans px-4 py-10 md:py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-100">Debate Arena</h1>
          <p className="text-lg md:text-xl text-gray-400">
            Topic: <span className="font-medium text-cyan-300">{debate?.topic || "Loading..."}</span>
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 md:mb-10">
          <ProgressIndicator
            currentStageIndex={currentStageIndex}
            stages={debateStages}
          />
        </div>

        {/* Main Content Card */}
        <Card className={`max-w-3xl mx-auto ${cardBaseClasses}`}>
          <CardHeader className="border-b border-gray-700/50 pb-4">
            <CardTitle className="text-xl md:text-2xl text-center text-blue-300">
              Stage: {currentStageData.label}
            </CardTitle>
            <CardDescription className="text-center text-gray-500 pt-1">
               Opponent Level: {formatDifficulty(debate?.difficulty)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">

            {/* Conditional Rendering based on state */}
            {!isUploading && !isProcessing && !aiVideoUrl && (
              // State 1: Ready for Upload
              <div className="text-center">
                <p className="mb-4 text-gray-300">
                  Upload your video for the <span className="font-semibold">{currentStageData.label}</span> stage:
                </p>
                <Label htmlFor="video-upload" className="cursor-pointer group">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 md:p-12 text-center group-hover:border-blue-500 group-hover:bg-gray-800/30 transition duration-300">
                    <UploadCloud className="w-10 h-10 mx-auto mb-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    <span className="text-gray-400 group-hover:text-blue-300 font-medium">Click or drag to upload video</span>
                    <p className="text-xs text-gray-500 mt-1">MP4, WebM, MOV supported</p>
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime" // Be more specific
                      className="hidden"
                      onChange={handleVideoUpload}
                      disabled={isUploading || isProcessing}
                    />
                  </div>
                </Label>
                {/* Display upload/processing errors here */}
                {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
              </div>
            )}

            {(isUploading || isProcessing) && !aiVideoUrl && (
              // State 2: Uploading or Processing
              <div className="text-center py-10">
                 <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-400 mb-4" />
                 <p className="text-gray-400">
                   {isUploading ? "Uploading your video..." : "Aristotle is analyzing and preparing a response..."}
                 </p>
                 {/* Optional: Show a progress bar if possible */}
              </div>
            )}

            {aiVideoUrl && (
              // State 3: AI Response Ready
              <div>
                <h3 className="font-semibold mb-3 text-lg text-gray-100">Aristotle's Response:</h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-700 shadow-inner">
                    <video
                      ref={videoRef} // Add ref
                      key={aiVideoUrl} // Force re-render if URL changes
                      className="w-full h-full"
                      controls
                      onEnded={() => setVideoPlayed(true)}
                      onPlay={() => setVideoPlayed(false)} // Reset if user replays
                    >
                      <source src={aiVideoUrl} type="video/mp4" /> {/* Adjust type if needed */}
                      Your browser does not support the video tag.
                    </video>
                </div>
                <Button
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleProceed}
                  disabled={!videoPlayed || isUploading || isProcessing}
                >
                  {currentStageIndex === debateStages.length - 1
                    ? "Finish Debate & View Results"
                    : "Proceed to Next Stage"}
                </Button>
                {!videoPlayed && <p className="text-xs text-center text-gray-500 mt-2">Watch the full response to proceed.</p>}
                 {/* Display upload/processing errors here */}
                 {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Updated Progress Indicator Component
function ProgressIndicator({
  currentStageIndex,
  stages,
}: {
  currentStageIndex: number;
  stages: Array<{ id: string; label: string }>;
}) {
  return (
    <div className="flex items-center justify-center space-x-1 md:space-x-2 max-w-xl mx-auto">
      {stages.map((stage, index) => (
        <div key={stage.id} className={`flex-1 flex items-center ${index > 0 ? 'justify-start' : 'justify-end'}`}>
          {/* Connector Line (except for the first item) */}
          {index > 0 && (
            <div
              className={`h-0.5 w-full ${
                index <= currentStageIndex ? "bg-cyan-500" : "bg-gray-700"
              }`}
            />
          )}

          {/* Step Circle and Label */}
          <div className="flex flex-col items-center mx-1 md:mx-2 shrink-0 relative">
             <div
              className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                index === currentStageIndex
                  ? "bg-blue-500 border-blue-400 ring-2 ring-blue-500/50" // Current
                  : index < currentStageIndex
                  ? "bg-cyan-600 border-cyan-500" // Completed
                  : "bg-gray-800 border-gray-600" // Upcoming
              }`}
            >
               {/* Optional: Checkmark for completed */}
               {index < currentStageIndex && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
               {index === currentStageIndex && <span className="h-2 w-2 md:h-2.5 md:w-2.5 bg-white rounded-full animate-pulse"></span>}
            </div>
             <span className={`absolute top-full mt-1.5 text-xs text-center w-24 md:w-28 ${
                index === currentStageIndex ? 'text-blue-300 font-medium' : 'text-gray-400'
             }`}>
                {stage.label}
             </span>
          </div>

           {/* Connector Line (except for the last item) */}
           {index < stages.length - 1 && index === 0 && ( // Only the first one needs a trailing connector line here
             <div
              className={`h-0.5 w-full ${
                index < currentStageIndex ? "bg-cyan-500" : "bg-gray-700"
              }`}
            />
           )}
        </div>
      ))}
    </div>
  );
}
