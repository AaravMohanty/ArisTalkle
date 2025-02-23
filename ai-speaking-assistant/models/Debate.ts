const mongoose = require("mongoose");

// const TranscriptSchema = new mongoose.Schema({
//     text: {type: String,},
//     aiFeedback: {type: String},
// });

const DebateSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true}, // From clerk
        date: {type: Date, default: Date.now}, // Stores date of debate
        topic: {type: String},
        difficulty: {type: String, enum: ["Easy", "Medium", "Hard"],},
        competitionLevel: {
            type: String,
            enum: ["Elementary School", "High School", "University"],
        },
        // transcript: {
        //     opening: {type: TranscriptSchema,},
        //     questioning: {type: TranscriptSchema,},
        //     rebuttals: {type: TranscriptSchema,},
        //     closingStatements: {type: TranscriptSchema,},
        // },
        rubricScores: {
            toneInflection: {type: Number, min: 0, max: 10, default: 0},
            information: {type: Number, min: 0, max: 10, default: 0},
            useOfFactsStatistics: {type: Number, min: 0, max: 10, default: 0},
            organization: {type: Number, min: 0, max: 10, default: 0},
            understandingOfTopic: {type: Number, min: 0, max: 10, default: 0},
        },
        overallScore: {type: Number, min: 0, max: 100, default: 0}, // Total score based on rubric
        completed: {type: Boolean, default: false},
    },
    {timestamps: true} // Automatically adds createdAt & updatedAt fields
);

const Debate = mongoose.models.Debate || mongoose.model("Debate", DebateSchema);
export default Debate;