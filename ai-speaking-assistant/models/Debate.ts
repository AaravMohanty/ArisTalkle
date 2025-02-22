import mongoose from "mongoose"

const TranscriptSchema = new mongoose.Schema({
  userResponse: { type: String, required: true },
  aiResponse: { type: String, required: true },
})

const DebateSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    transcript: {
      opening: { type: TranscriptSchema, required: true },
      questioning: { type: TranscriptSchema, required: true },
      rebuttals: { type: TranscriptSchema, required: true },
      closingStatements: { type: TranscriptSchema, required: true },
    },
    score: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }, // Automatically adds createdAt & updatedAt fields
)

export default mongoose.models.Debate || mongoose.model("Debate", DebateSchema)

