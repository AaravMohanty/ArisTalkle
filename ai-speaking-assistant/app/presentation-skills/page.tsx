"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PresentationSkillsPage() {
  const exercises = [
    { id: "voice-modulation", title: "Voice Modulation", description: "Practice varying your tone and pitch" },
    { id: "storytelling", title: "Storytelling", description: "Craft compelling narratives for your presentations" },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">Presentation Skills</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Enhance your presentation abilities with Aristotle's guidance
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Enhance Your Presentation Skills</CardTitle>
          <CardDescription>Choose an exercise to practice and improve your skills</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={exercises[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {exercises.map((exercise) => (
                <TabsTrigger key={exercise.id} value={exercise.id}>
                  {exercise.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {exercises.map((exercise) => (
              <TabsContent key={exercise.id} value={exercise.id}>
                <ExerciseContent exerciseId={exercise.id} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ExerciseContent({ exerciseId }: { exerciseId: string }) {
  const [videoUploaded, setVideoUploaded] = useState(false)

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate video upload
      setTimeout(() => {
        setVideoUploaded(true)
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      <p>This is the content for the {exerciseId} exercise. Follow the instructions below:</p>
      <ol className="list-decimal list-inside space-y-2">
        <li>Record yourself practicing the {exerciseId} technique</li>
        <li>Upload your video for Aristotle's analysis</li>
        <li>Review Aristotle's feedback to improve your skills</li>
      </ol>
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
    </div>
  )
}

