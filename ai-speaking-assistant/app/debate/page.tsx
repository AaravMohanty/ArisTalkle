"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs";
import { Wand2 } from "lucide-react"; // Icon for Generate Topic

export default function DebatePage() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("") // Stores 'Easy', 'Medium', 'Hard'
  const [isCreating, setIsCreating] = useState(false); // Loading state for button
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter()
  const { user } = useUser()

  const startDebate = async () => {
    setError(null); // Clear previous errors
    if (!topic.trim()) {
      setError("Please enter or generate a debate topic.");
      return;
    }
    if (!difficulty) {
      setError("Please select an education level.");
      return;
    }
    if (!user) {
      setError("User not logged in. Please log in to start a debate.");
      // Optionally, redirect to login: router.push('/sign-in');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/debates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Sending difficulty as provided, API should handle mapping if needed
        body: JSON.stringify({ topic: topic.trim(), difficulty, userId: user.id }),
      })

      if (response.ok) {
        const debate = await response.json()
        router.push(`/debate/${debate._id}`)
      } else {
        const errorData = await response.json();
        console.error("Server error: Failed to create debate", response.status, errorData);
        setError(`Failed to create debate: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Client-side error creating debate:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  const generateTopic = () => {
    // Simple client-side generation for now
    // TODO: Consider an API call for more diverse/intelligent topics
    const topics = [
        "Should universal basic income (UBI) be implemented?",
        "Is artificial intelligence more beneficial or threatening to humanity's future?",
        "Should standardized testing be abolished in schools?",
        "Is space exploration a worthwhile investment?",
        "Should gene editing for human enhancement be permitted?",
        "Is remote work the future of employment?",
        "Should voting be mandatory in democratic elections?",
        "Are renewable energy sources capable of replacing fossil fuels entirely?",
        "Does social media foster genuine connection or isolation?",
        "Should surveillance technology be more strictly regulated?"
    ];
    setTopic(topics[Math.floor(Math.random() * topics.length)])
    setError(null); // Clear error when generating
  }

  // Define card styles consistent with the dark theme
  const cardBaseClasses = "bg-gray-900/60 border border-gray-700/50 backdrop-blur-sm rounded-xl shadow-lg";
  // Define input/select styles
  const inputBaseClasses = "bg-gray-800/70 border-gray-700 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 placeholder:text-gray-500 rounded-md shadow-sm";

  return (
    // Main container with dark gradient background and padding
    <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-200 min-h-screen font-sans flex flex-col justify-center items-center px-4 py-12">

      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-100">AI Debate Arena</h1>
        <p className="text-lg md:text-xl text-gray-400">Configure and launch your structured debate.</p>
      </div>

      {/* Configuration Card */}
      <Card className={`max-w-lg w-full mx-auto ${cardBaseClasses}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl text-gray-100">Debate Setup</CardTitle>
          <CardDescription className="text-gray-400 pt-1">Choose your topic and opponent level</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              startDebate()
            }}
            className="space-y-6" // Increased spacing
          >
            {/* Topic Input */}
            <div>
              <Label htmlFor="topic" className="block text-sm font-medium text-gray-400 mb-1.5">Debate Topic</Label>
              <div className="flex space-x-2">
                <Input
                  id="topic"
                  placeholder="e.g., Is AI beneficial for creativity?"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null); // Clear error on input change
                  }}
                  className={`flex-grow ${inputBaseClasses}`}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateTopic}
                  className="border-gray-600 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-300 font-medium transition duration-200 hover:bg-gray-800/50 px-3"
                  title="Generate Random Topic"
                >
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Difficulty Select */}
            <div>
              <Label htmlFor="difficulty" className="block text-sm font-medium text-gray-400 mb-1.5">Opponent Level (AI)</Label>
              <Select
                onValueChange={(value) => {
                    setDifficulty(value);
                    if (error) setError(null); // Clear error on selection change
                }}
                value={difficulty} // Control the selected value
              >
                {/* Style the trigger */}
                <SelectTrigger id="difficulty" className={`w-full ${inputBaseClasses} text-gray-200 data-[placeholder]:text-gray-500`}>
                  <SelectValue placeholder="Select education level equivalent" />
                </SelectTrigger>
                {/* Style the dropdown content */}
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                   <SelectItem value="Easy" className="focus:bg-gray-700 focus:text-white">Elementary School</SelectItem>
                   <SelectItem value="Medium" className="focus:bg-gray-700 focus:text-white">High School</SelectItem>
                   <SelectItem value="Hard" className="focus:bg-gray-700 focus:text-white">University</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Message Display */}
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isCreating} // Disable button when creating
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Initializing Debate..." : "Start Debate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Optional Footer Hint */}
      {/* <p className="text-center text-xs text-gray-600 mt-6">
        Debates are analyzed using Aristotelian principles.
      </p> */}
    </div>
  )
}
