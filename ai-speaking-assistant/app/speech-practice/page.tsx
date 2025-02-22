"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function SpeechPracticePage() {
  const [videoUploaded, setVideoUploaded] = useState(false)
  const [feedback, setFeedback] = useState("")

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate video upload and processing
      setTimeout(() => {
        setVideoUploaded(true)
        setFeedback(
          "Your speech was well-structured and your voice was clear. To improve, try to make more eye contact with your audience and vary your tone for emphasis.",
        )
      }, 2000)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Speech Practice</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Speech</CardTitle>
          <CardDescription>Get AI-powered feedback on your speech delivery</CardDescription>
        </CardHeader>
        <CardContent>
          {!videoUploaded ? (
            <div>
              <Label htmlFor="speech-video" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition duration-300">
                  <span className="text-gray-600">Click to upload your speech video</span>
                  <Input
                    id="speech-video"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </div>
              </Label>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold mb-2">AI Feedback:</h3>
              <p className="text-gray-700">{feedback}</p>
              <Textarea
                placeholder="Add your own notes or reflections on your speech here..."
                className="w-full h-32"
              />
              <Button className="w-full">Save Notes</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

