import QuizSession from "../models/Session.js";
import generateLink from "../utils/generateLink.js";
import Quiz from "../models/Quiz.js";

// Create a new quiz session
export const createSession = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const session = new QuizSession({
      title,
      owner: req.user._id,
      quizzes: [],
    });

    await session.save();

    const sessionLink = generateLink(session._id);
    session.sessionLink = sessionLink;
    await session.save();

    res.status(201).json({
      message: "Quiz session created successfully",
      sessionLink,
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sessions for a particular user
export const getUserSessions = async (req, res) => {
  try {
    const sessions = await QuizSession.find({ owner: req.user._id });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific session by ID
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await QuizSession.findById(id).populate("quizzes");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a quiz to a session
export const addQuizToSession = async (req, res) => {
  try {
    const { sessionId, question, answers, correctAnswerIndex } = req.body;

    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.quizzes.length >= 10) {
      return res
        .status(400)
        .json({ message: "You can only add up to 10 quizzes" });
    }

    const newQuiz = new Quiz({
      sessionId,
      question,
      answers,
      correctAnswerIndex,
    });

    await newQuiz.save();

    session.quizzes.push(newQuiz._id);
    await session.save();

    res.status(201).json({ message: "Quiz added successfully", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a quiz from a session
export const deleteQuizFromSession = async (req, res) => {
  try {
    const { sessionId, quizId } = req.params;

    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await quiz.remove();

    session.quizzes = session.quizzes.filter((q) => q.toString() !== quizId);
    await session.save();

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all quizzes in a session
export const viewAllQuizzes = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session.quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a quiz in a session
export const editQuizInSession = async (req, res) => {
  try {
    const { sessionId, quizId } = req.params;
    const { question, answers, correctAnswerIndex } = req.body;

    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.question = question || quiz.question;
    quiz.answers = answers || quiz.answers;
    quiz.correctAnswerIndex = correctAnswerIndex || quiz.correctAnswerIndex;

    await quiz.save();

    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a session and its associated quizzes
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await QuizSession.findOne({ _id: id, owner: req.user._id });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or unauthorized" });
    }

    await Quiz.deleteMany({ sessionId: id });

    await session.deleteOne();

    res
      .status(200)
      .json({ message: "Session and associated quizzes deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
