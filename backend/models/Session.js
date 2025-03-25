import mongoose from "mongoose";

const quizSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    isActive: { type: Boolean, default: false },
    sessionLink: { type: String, default: "" },
  },
  { timestamps: true }
);

const QuizSession = mongoose.model("QuizSession", quizSessionSchema);
export default QuizSession;
