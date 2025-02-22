"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const debateStages = ["opening", "questioning", "rebuttals", "closingStatements"]

export default function DebateRoom({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [debate, setDebate] = useState<any>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [videoUploaded, setVideoUploaded] = useState(false)
  const [showAIResponse, setShowAIResponse] = useState(false)

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(`/api/debates/${params.id}`)
        if (response.ok) {
          const debateData = await response.json()
          setDebate(debateData)
        } else {
          console.error("Failed to fetch debate")
        }
      } catch (error) {
        console.error("Error fetching debate:", error)
      }
    }

    fetchDebate()
  }, [params.id])

  useEffect(() => {
    if (showAIResponse) {
      const timer = setTimeout(() => {
        if (currentStage < debateStages.length - 1) {
          setCurrentStage(currentStage + 1)
          setVideoUploaded(false)
          setShowAIResponse(false)
        }
      }, 5000) // Simulating AI response time
      return () => clearTimeout(timer)
    }
  }, [showAIResponse, currentStage])

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // TODO: Implement actual video upload and processing
      setVideoUploaded(true)

      try {
        // Simulating user response processing
        const userResponse = "This is a simulated user response."

        // Update the debate in the database
        const response = await fetch(`/api/debates/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stage: debateStages[currentStage],
            userResponse,
          }),
        })

        if (response.ok) {
          const updatedDebate = await response.json()
          setDebate(updatedDebate)
          setShowAIResponse(true)
        } else {
          console.error("Failed to update debate")
        }
      } catch (error) {
        console.error("Error updating debate:", error)
      }
    }
  }

  const handleProceed = () => {
    if (currentStage === debateStages.length - 1) {
      router.push(`/debate/${params.id}/result`)
    } else {
      setCurrentStage(currentStage + 1)
      setVideoUploaded(false)
      setShowAIResponse(false)
    }
  }

  if (!debate) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">Debate Room</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">Engage in a structured debate with Aristotle</p>

      <div className="mb-8">
        <ProgressIndicator currentStage={currentStage} totalStages={debateStages.length} />
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {debateStages[currentStage].charAt(0).toUpperCase() + debateStages[currentStage].slice(1)}
          </CardTitle>
          <CardDescription>
            Topic: {debate.topic} | Education Level: {debate.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!videoUploaded ? (
            <div className="text-center">
              <p className="mb-4">Upload your video for the {debateStages[currentStage]} stage:</p>
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
          ) : showAIResponse ? (
            <div>
              <h3 className="font-semibold mb-2">Aristotle's Response:</h3>
              <video className="w-full aspect-video bg-gray-200" controls>
                <source src="/placeholder-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button className="mt-4 w-full" onClick={handleProceed}>
                {currentStage === debateStages.length - 1 ? "Finish Debate" : "Proceed to Next Stage"}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p>Processing your video...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ProgressIndicator({ currentStage, totalStages }: { currentStage: number; totalStages: number }) {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalStages }).map((_, index) => (
        <div key={index} className={`w-3 h-3 rounded-full ${index <= currentStage ? "bg-blue-600" : "bg-gray-300"}`} />
      ))}
    </div>
  )
}

