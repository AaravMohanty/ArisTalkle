import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Debate from "@/models/Debate"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const debate = await Debate.findById(params.id)
    if (!debate) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 })
    }
    return NextResponse.json(debate)
  } catch (error) {
    console.error("Error fetching debate:", error)
    return NextResponse.json({ error: "Failed to fetch debate" }, { status: 500 })
  }
}

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect()
//     const { stage, userResponse } = await req.json()

//     const debate = await Debate.findById(params.id)
//     if (!debate) {
//       return NextResponse.json({ error: "Debate not found" }, { status: 404 })
//     }

//     // Update the user response for the current stage
//     debate.transcript[stage].userResponse = userResponse

//     // TODO: Generate AI response
//     const aiResponse = "This is a placeholder AI response."
//     debate.transcript[stage].aiResponse = aiResponse

//     await debate.save()

//     return NextResponse.json(debate)
//   } catch (error) {
//     console.error("Error updating debate:", error)
//     return NextResponse.json({ error: "Failed to update debate" }, { status: 500 })
//   }
// }

