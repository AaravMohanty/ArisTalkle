import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Debate from "@/models/Debate"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { topic, difficulty } = await req.json()

    const debate = await Debate.create({
      topic,
      difficulty,
      transcript: {
        opening: { userResponse: "", aiResponse: "" },
        questioning: { userResponse: "", aiResponse: "" },
        rebuttals: { userResponse: "", aiResponse: "" },
        closingStatements: { userResponse: "", aiResponse: "" },
      },
    })

    return NextResponse.json(debate)
  } catch (error) {
    console.error("Error creating debate:", error)
    return NextResponse.json({ error: "Failed to create debate" }, { status: 500 })
  }
}

