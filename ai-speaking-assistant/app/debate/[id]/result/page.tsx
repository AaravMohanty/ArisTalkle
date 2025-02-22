"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebateResult({ params }: { params: { id: string } }) {
  const [debate, setDebate] = useState<any>(null)
  const router = useRouter()

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

  const handleDownloadReport = () => {
    // TODO: Implement report generation and download
    alert("Downloading report...")
  }

  if (!debate) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Debate Completed!</h1>
      <p className="text-xl mb-8">Congratulations on finishing your debate with Aristotle.</p>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Debate Summary</CardTitle>
          <CardDescription>
            Topic: {debate.topic} | Difficulty: {debate.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your debate score: {debate.score}/100</p>
          {/* TODO: Add more detailed feedback and statistics */}
        </CardContent>
      </Card>

      <Button onClick={handleDownloadReport}>Download Debate Report</Button>
      <Button className="ml-4" onClick={() => router.push("/debate")}>
        Start New Debate
      </Button>
    </div>
  )
}

