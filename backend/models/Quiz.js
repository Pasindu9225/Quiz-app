import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizSession",
      required: true,
    },
    question: { type: String, required: true },
    answers: [
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
    ],
    correctAnswerIndex: { type: Number, required: true },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
