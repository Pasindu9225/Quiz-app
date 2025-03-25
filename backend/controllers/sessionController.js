import QuizSession from "../models/Session.js";
import generateLink from "../utils/generateLink.js";

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

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await QuizSession.findOne({ _id: id, owner: req.user._id });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or unauthorized" });
    }

    await session.deleteOne();
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
