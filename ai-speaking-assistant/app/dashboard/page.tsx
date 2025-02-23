"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download, Trophy, TrendingUp } from "lucide-react"
import {useUser} from "@clerk/nextjs";

// Placeholder data
const pastDebates = [
    { id: 1, topic: "Should homework be banned?", grade: 85, date: "2023-05-15" },
    { id: 2, topic: "Is social media good for society?", grade: 92, date: "2023-06-02" },
    { id: 3, topic: "Should school uniforms be mandatory?", grade: 78, date: "2023-06-20" },
]

const skillProgress = [
    { name: "Tone/Inflection", progress: 75 },
    { name: "Information", progress: 60 },
    { name: "Use of Facts/Statistics", progress: 80 },
    { name: "Organization", progress: 70 },
    { name: "Understanding of Topic", progress: 70 },
]

const achievements = [
    { id: 1, name: "First Debate", description: "Completed your first debate", icon: Trophy },
    { id: 2, name: "High Scorer", description: "Achieved a score of 90+", icon: TrendingUp },
    { id: 3, name: "Consistent Debater", description: "Completed 5 debates", icon: Trophy },
]

export default function Dashboard() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const { user } = useUser();
    const userName = user ? user.firstName || user.fullName || "User" : "User";

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Welcome, {userName}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Debates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{pastDebates.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Average Grade</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            {(pastDebates.reduce((sum, debate) => sum + debate.grade, 0) / pastDebates.length).toFixed(1)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Last Debate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">June 30, 2023</p>
                        <p className="text-sm text-gray-500">Topic: Climate Change Solutions</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="past-debates" className="mb-8">
                <TabsList>
                    <TabsTrigger value="past-debates">Past Debates</TabsTrigger>
                    <TabsTrigger value="skill-progress">Skill Progress</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                <TabsContent value="past-debates">
                    <Card>
                        <CardHeader>
                            <CardTitle>Past Debates</CardTitle>
                            <CardDescription>Your debate history and performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pastDebates.map((debate) => (
                                    <div key={debate.id} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <p className="font-semibold">{debate.topic}</p>
                                            <p className="text-sm text-gray-500">{debate.date}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Badge variant={debate.grade >= 90 ? "default" : "secondary"}>Grade: {debate.grade}</Badge>
                                            <Button variant="outline" size="sm">
                                                <Download className="w-4 h-4 mr-2" /> Report
                                            </Button>
                                        </div>
                                    </div>
                                ))}
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
                            <div className="space-y-6">
                                {skillProgress.map((skill) => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{skill.name}</span>
                                            <span className="text-sm font-medium">{skill.progress}%</span>
                                        </div>
                                        <Progress value={skill.progress} className="w-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="achievements">
                    <Card>
                        <CardHeader>
                            <CardTitle>Achievements</CardTitle>
                            <CardDescription>Milestones you've reached in your debate journey</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {achievements.map((achievement) => (
                                    <Card key={achievement.id}>
                                        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                            <achievement.icon className="w-8 h-8 text-yellow-500" />
                                            <CardTitle className="text-lg">{achievement.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500">{achievement.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
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
                        <BarChart data={pastDebates}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="grade" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}