"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Trophy, TrendingUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const [debates, setDebates] = useState<any[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [lastDebate, setLastDebate] = useState<any>(null);
  const { user } = useUser();
  const userId = user?.id;
  const userName = user ? user.firstName || user.fullName || "User" : "User";

  useEffect(() => {
    const fetchDebates = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/debates?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch debates");

        const debateData = await response.json();
        setDebates(debateData);

        if (debateData.length > 0) {
          const avgScore =
            debateData.reduce((sum: number, debate: any) => sum + (debate.overallScore || 0), 0) /
            debateData.length;
          setAverageScore(Math.round(avgScore));
          setLastDebate(debateData[0]); // Newest debate
        }
      } catch (error) {
        console.error("Error fetching debates:", error);
      }
    };

    fetchDebates();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome, {userName}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Debates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{debates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averageScore !== null ? `${averageScore}` : "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last Debate</CardTitle>
          </CardHeader>
          <CardContent>
            {lastDebate ? (
              <>
                <p className="text-lg font-semibold">{new Date(lastDebate.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Topic: {lastDebate.topic}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No debates yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="past-debates" className="mb-8">
        <TabsList>
          <TabsTrigger value="past-debates">Past Debates</TabsTrigger>
          <TabsTrigger value="skill-progress">Skill Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="past-debates">
          <Card>
            <CardHeader>
              <CardTitle>Past Debates</CardTitle>
              <CardDescription>Your debate history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debates.length > 0 ? (
                  debates.map((debate) => (
                    <div key={debate._id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{debate.topic}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(debate.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={debate.overallScore >= 90 ? "default" : "secondary"}>
                          Grade: {debate.overallScore || "N/A"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" /> Report
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No debates found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skill-progress">
          <Card>
            <CardHeader>
              <CardTitle>Skill Progress</CardTitle>
              <CardDescription>Track your improvement in various debate skills</CardDescription>
            </CardHeader>
            <CardContent>
              {lastDebate ? (
                <>
                  <p className="font-semibold mb-2">Rubric Scores:</p>
                  {Object.entries(lastDebate.rubricScores).map(([category, score]) => (
                    <div key={category} className="mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm font-medium">{score}/100</span>
                      </div>
                      <Progress value={score} className="w-full" />
                    </div>
                  ))}
                </>
              ) : (
                <p>No skill progress data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Your debate grades over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={debates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="overallScore" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}