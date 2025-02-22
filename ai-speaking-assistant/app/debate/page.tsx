"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebatePage() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const router = useRouter()

  const startDebate = async () => {
    if (topic && difficulty) {
      try {
        const response = await fetch("/api/debates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic, difficulty }),
        })

        if (response.ok) {
          const debate = await response.json()
          router.push(`/debate/${debate._id}`)
        } else {
          console.error("Failed to create debate")
        }
      } catch (error) {
        console.error("Error creating debate:", error)
      }
    }
  }

  const generateTopic = () => {
    // TODO: Implement topic generation logic or API call
    const topics = [
      "Should homework be banned?",
      "Is social media good for society?",
      "Should school uniforms be mandatory?",
      "Are video games beneficial or harmful?",
      "Should junk food be banned in schools?",
    ]
    setTopic(topics[Math.floor(Math.random() * topics.length)])
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">AI Debate Assistant</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">Engage in structured debates with Aristotle</p>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Configure Your Debate</CardTitle>
          <CardDescription>Set up your debate topic and education level</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              startDebate()
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="topic">Debate Topic</Label>
              <div className="flex space-x-2">
                <Input
                  id="topic"
                  placeholder="Enter debate topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button type="button" onClick={generateTopic}>
                  Generate Topic
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="difficulty">Education Level</Label>
              <Select onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Elementary School</SelectItem>
                  <SelectItem value="Medium">High School</SelectItem>
                  <SelectItem value="Hard">University</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Start Debate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

