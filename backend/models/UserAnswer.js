import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizSession",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedAnswerIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);

export default UserAnswer;
