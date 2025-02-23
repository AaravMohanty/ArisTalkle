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

export default function DebateResult({ params }: { params: { id: string } }) {
  const [debate, setDebate] = useState<any>(null);
  const [scores, setScores] = useState<{ [key: string]: number } | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScores = async () => {
      console.log("Fetching scores...");
      try {
        const response = await fetch("http://127.0.0.1:5000/extract_scores");
        if (!response.ok) throw new Error("Failed to fetch scores");
  
        const scoresData = await response.json();
        console.log("Extracted Scores:", scoresData);
        setScores(scoresData);
  
        // ✅ Compute overall score
        const scoreValues = Object.values(scoresData);
        if (scoreValues.length > 0) {
          const averageScore =
            scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
          const roundedScore = Math.round(averageScore);
          setOverallScore(roundedScore);
  
          // ✅ **Rename fields before sending to API**
          const renamedScores = {
            toneInflection: scoresData["Tone/Inflection"] || 0,
            information: scoresData["Information"] || 0,
            useOfFactsStatistics: scoresData["Use of Facts/Statistics"] || 0,
            organization: scoresData["Organization"] || 0,
            understandingOfTopic: scoresData["Understanding of Topic"] || 0,
          };

          console.log("Sending PATCH with data:", {
            scores: renamedScores, // ✅ Correct field mappings
            overallScore: roundedScore,
            completed: true,
          });
          
          // ✅ Send updated scores and status to backend
          const patchResponse = await fetch(`/api/debates/${params.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              scores: renamedScores, // ✅ Correct field mappings
              overallScore: roundedScore,
              completed: true, // ✅ Mark debate as completed
            }),
          });
  
          if (!patchResponse.ok) throw new Error("Failed to update debate");
  
          const updatedDebate = await patchResponse.json();
          console.log("Updated Debate:", updatedDebate);
  
          // ✅ Update state with new debate data
          setDebate(updatedDebate.debate);
        }
      } catch (error) {
        console.error("Error fetching extracted scores:", error);
      }
    };
  
    fetchScores();
  }, []); // Runs once on mount  
  
  const handleDownloadReport = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/download_rubric");
      if (!response.ok) throw new Error("Failed to download rubric");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "rubric.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading rubric:", error);
    }
  };

  if (!debate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Debate Completed!</h1>
      <p className="text-xl mb-8">
        Congratulations on finishing your debate with Aristotle 🎉.
      </p>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Debate Summary</CardTitle>
          <CardDescription>
            Topic: {debate.topic} | Difficulty: {debate.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ✅ Display the computed overall debate score */}
          <p className="mb-4 text-lg font-semibold">
            Your Overall Debate Score: {overallScore !== null ? `${overallScore}/100` : "Calculating..."}
          </p>

          {/* ✅ Display extracted rubric scores */}
          {scores ? (
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">Rubric Scores:</h3>
              <ul>
                {Object.entries(scores).map(([category, score]) => (
                  <li key={category}>
                    <strong>{category}:</strong> {score}/100
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Aristotle is grading your performance...</p>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleDownloadReport}>Download Debate Report</Button>
      <Button className="ml-4" onClick={() => router.push("/debate")}>
        Start New Debate
      </Button>
    </div>
  );
}