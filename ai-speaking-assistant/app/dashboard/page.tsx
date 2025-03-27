"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react"; // Removed Trophy, TrendingUp as they weren't used
import { useUser } from "@clerk/nextjs";

// Helper function to format category names
const formatCategoryName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

export default function Dashboard() {
  const [debates, setDebates] = useState<any[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [lastDebate, setLastDebate] = useState<any>(null);
  const { user } = useUser();
  const userId = user?.id;
  // Use a more futuristic/neutral fallback if name parts are missing
  const userName = user ? user.firstName || user.username || "Analyst" : "Analyst";

  useEffect(() => {
    const fetchDebates = async () => {
      if (!userId) return;

      try {
        // Ensure the API endpoint is correct
        const response = await fetch(`/api/debates?userId=${userId}`);
        if (!response.ok) {
            const errorData = await response.text(); // Read error details
            console.error("API Error Response:", errorData);
            throw new Error(`Failed to fetch debates: ${response.statusText}`);
        }

        const debateData = await response.json();
        // Sort debates by date descending (newest first)
        const sortedDebates = debateData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDebates(sortedDebates);

        if (sortedDebates.length > 0) {
          const validScores = sortedDebates.map((d: any) => d.overallScore).filter((s: any) => typeof s === 'number');
          if (validScores.length > 0) {
            const avgScore = validScores.reduce((sum: number, score: number) => sum + score, 0) / validScores.length;
            setAverageScore(Math.round(avgScore));
          } else {
            setAverageScore(null);
          }
          setLastDebate(sortedDebates[0]); // Set newest debate as lastDebate
        }
      } catch (error) {
        console.error("Error fetching debates:", error);
        // Optionally, set an error state to show in the UI
      }
    };

    fetchDebates();
  }, [userId]);

  // Prepare data for the chart, ensuring date is handled correctly
  const chartData = debates.map(debate => ({
    ...debate,
    dateLabel: new Date(debate.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) // Format date for XAxis
  })).reverse(); // Reverse to show oldest first on the chart


  // Define card styles consistent with the dark theme
  const cardBaseClasses = "bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm rounded-xl shadow-lg";

  return (
    // Main container with dark gradient background
    <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-200 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* Welcome Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-gray-100">Welcome, {userName}!</h1>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-10">
          <Card className={cardBaseClasses}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Debates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-cyan-400">{debates.length}</p>
            </CardContent>
          </Card>
          <Card className={cardBaseClasses}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-400">{averageScore !== null ? `${averageScore}%` : "N/A"}</p>
            </CardContent>
          </Card>
          <Card className={cardBaseClasses}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Last Debate</CardTitle>
            </CardHeader>
            <CardContent>
              {lastDebate ? (
                <>
                  <p className="text-lg font-semibold text-gray-200">{new Date(lastDebate.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400 truncate" title={lastDebate.topic}>
                    Topic: {lastDebate.topic}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No debates completed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="past-debates" className="mb-8 md:mb-10">
          {/* Tabs List Styling */}
          <TabsList className="bg-gray-800/60 border border-gray-700 rounded-lg p-1 inline-flex mb-4">
            <TabsTrigger value="past-debates" className="text-gray-400 data-[state=active]:bg-gray-700/80 data-[state=active]:text-white px-4 py-1.5 rounded-md text-sm font-medium">
                Past Debates
            </TabsTrigger>
            <TabsTrigger value="skill-progress" className="text-gray-400 data-[state=active]:bg-gray-700/80 data-[state=active]:text-white px-4 py-1.5 rounded-md text-sm font-medium">
                Skill Progress
            </TabsTrigger>
          </TabsList>

          {/* Past Debates Content */}
          <TabsContent value="past-debates">
            <Card className={cardBaseClasses}>
              <CardHeader>
                <CardTitle className="text-gray-100">Debate History</CardTitle>
                <CardDescription className="text-gray-400">Review your past performance and download reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {debates.length > 0 ? (
                    debates.map((debate) => (
                      <div key={debate._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700/50 pb-3 last:border-b-0">
                        <div className="mb-2 sm:mb-0">
                          <p className="font-semibold text-gray-100">{debate.topic || "Untitled Topic"}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(debate.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                           <Badge
                             variant={!debate.overallScore ? "secondary" : debate.overallScore >= 85 ? "success" : debate.overallScore >= 70 ? "warning" : "destructive"}
                             className={`text-xs ${
                               !debate.overallScore ? "bg-gray-600 text-gray-200" :
                               debate.overallScore >= 85 ? "bg-green-700/80 border border-green-500/50 text-green-200" :
                               debate.overallScore >= 70 ? "bg-yellow-700/80 border border-yellow-500/50 text-yellow-100" :
                               "bg-red-800/80 border border-red-600/50 text-red-200"
                             }`}
                           >
                             Grade: {debate.overallScore !== null && debate.overallScore !== undefined ? `${debate.overallScore}%` : "N/A"}
                           </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-300 font-medium transition duration-200 hover:bg-gray-800/50 text-xs"
                          >
                            <Download className="w-3 h-3 mr-1.5" /> Report
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">No debate history found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skill Progress Content */}
          <TabsContent value="skill-progress">
            <Card className={cardBaseClasses}>
              <CardHeader>
                <CardTitle className="text-gray-100">Latest Skill Assessment</CardTitle>
                <CardDescription className="text-gray-400">Rubric breakdown from your most recent debate.</CardDescription>
              </CardHeader>
              <CardContent>
                {lastDebate && lastDebate.rubricScores ? (
                  <div className="space-y-5">
                    {Object.entries(lastDebate.rubricScores).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-300">{formatCategoryName(category)}</span>
                          <span className="text-sm font-medium text-blue-300">{score}/100</span>
                        </div>
                        <Progress
                           value={typeof score === 'number' ? score : 0}
                           className="w-full h-2 bg-gray-700"
                           indicatorClassName="bg-gradient-to-r from-blue-500 to-cyan-400" // Apply gradient to progress indicator
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-4">No skill assessment data available. Complete a debate first.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Overview Chart */}
        <Card className={cardBaseClasses}>
          <CardHeader>
            <CardTitle className="text-gray-100">Performance Trend</CardTitle>
            <CardDescription className="text-gray-400">Overall debate grades over time.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}> {/* Adjust margins */}
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" /> {/* Softer grid lines */}
                   <XAxis
                    dataKey="dateLabel"
                    stroke="#9ca3af" // gray-400
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af" // gray-400
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`} // Add percentage sign
                    domain={[0, 100]} // Ensure Y-axis goes from 0 to 100
                   />
                  <Tooltip
                    cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} // Subtle hover effect
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.9)', // gray-800 with opacity
                      borderColor: 'rgba(55, 65, 81, 0.5)', // gray-700 with opacity
                      borderRadius: '0.5rem',
                      color: '#e5e7eb' // gray-200
                     }}
                    labelFormatter={(label) => `Date: ${label}`} // Customize tooltip label
                    formatter={(value: number, name: string, props: any) => [`${value}%`, `Grade (${props.payload.topic})`]} // Customize tooltip content
                   />
                  <Bar dataKey="overallScore" fill="url(#colorGrade)" radius={[4, 4, 0, 0]} /> {/* Use gradient fill */}
                  {/* Define the gradient for the bar */}
                  <defs>
                    <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/> {/* cyan-400 */}
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/> {/* blue-500 */}
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <p className="text-gray-500 italic text-center py-10">Chart data will appear here once you complete debates.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Optional: If you haven't defined custom badge variants in globals.css or ui/badge.tsx
// You might need to add styles for 'success', 'warning', 'destructive' variants,
// or adjust the className logic above to use existing Tailwind classes directly.
// Example for ui/badge.tsx (add these to the badgeVariants object):
// success: "border-transparent bg-green-600 text-green-foreground hover:bg-green-600/80",
// warning: "border-transparent bg-yellow-500 text-yellow-foreground hover:bg-yellow-500/80",
// destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",

// Note on Progress component styling:
// The indicatorClassName prop is a custom addition. If your Progress component doesn't support it,
// you might need to target the inner div via CSS selectors like:
// [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-400
