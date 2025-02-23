import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Debate from "@/models/Debate";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { topic, difficulty, competitionLevel, userId } = await req.json();

    const debate = await Debate.create({
      topic,
      difficulty,
      competitionLevel, // optional
      userId, // Save the userId passed from the client
      transcript: {
        opening: { text: "", aiFeedback: "" },
        questioning: { text: "", aiFeedback: "" },
        rebuttals: { text: "", aiFeedback: "" },
        closingStatements: { text: "", aiFeedback: "" },
      },
      // rubricScores, overallScore, and completed will use schema defaults
    });

    return NextResponse.json(debate);
  } catch (error) {
    console.error("Error creating debate:", error);
    return NextResponse.json({ error: "Failed to create debate" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const debates = await Debate.find({ userId }).sort({ date: -1 }); // Fetch debates for user, newest first

    return NextResponse.json(debates);
  } catch (error) {
    console.error("Error fetching debates:", error);
    return NextResponse.json({ error: "Failed to fetch debates" }, { status: 500 });
  }
}