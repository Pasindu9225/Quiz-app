"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/quizmodal";
import { Trash2, X, Edit2, Link2 } from "lucide-react"; // Added Link2 for the Copy Link icon

interface Quiz {
  _id: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

interface Session {
  _id: string;
  title: string;
  quizzes: Quiz[];
}

export default function QuizSession() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string; // Grabs [id] from the URL

  const [session, setSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [quizId, setQuizId] = useState(""); // Store the quizId for the quiz being edited
  const [sessionLink, setSessionLink] = useState<string | null>(null); // To store the generated session link

  // Fetch session data
  useEffect(() => {
    if (!sessionId) {
      console.error("Session ID is missing!");
      return;
    }

    const fetchSession = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found, redirecting to login...");
          router.push("/login");
          return;
        }

        const { data } = await axios.get<Session>(
          `http://localhost:5000/api/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Handle Add Quiz Button
  const addQuiz = async () => {
    if (!question.trim() || answers.some((a) => !a.trim())) {
      console.error("Question and all answers must be filled");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/sessions/add-quiz",
        {
          sessionId,
          question,
          answers,
          correctAnswerIndex,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After successfully adding a quiz, update the session state
      setSession((prevSession) =>
        prevSession
          ? {
              ...prevSession,
              quizzes: [...prevSession.quizzes, response.data.quiz],
            }
          : prevSession
      );

      // Reset the form fields
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(0);
      setModalOpen(false); // Close modal after adding the quiz
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  // Handle Publish Button
  const handlePublish = () => {
    const link = `${window.location.origin}/session/${sessionId}`;
    setSessionLink(link); // Set the generated link
  };

  // Handle Copy Link Button
  const handleCopyLink = () => {
    if (sessionLink) {
      navigator.clipboard.writeText(sessionLink);
      alert("Session link copied to clipboard!");
    }
  };

  // Handle Edit Quiz
  const handleEditQuiz = (quiz: Quiz) => {
    setQuestion(quiz.question);
    setAnswers(quiz.answers);
    setCorrectAnswerIndex(quiz.correctAnswerIndex);
    setQuizId(quiz._id);
    setEditMode(true); // Set to edit mode
    setModalOpen(true); // Open modal
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user may not be authenticated.");
        return;
      }

      // Delete quiz from backend
      await axios.delete(
        `http://localhost:5000/api/sessions/${sessionId}/quiz/${quizId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Quiz deleted successfully");

      // Refetch the session data after deleting the quiz
      const { data } = await axios.get<Session>(
        `http://localhost:5000/api/sessions/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the session state with the latest session data
      setSession(data);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  // Render the page
  return (
    <div className="p-4">
      {/* Display session name at the top */}
      {session ? (
        <>
          <h1 className="text-3xl font-semibold mb-6">{session.title}</h1>{" "}
          {/* Session title */}
          <button
            onClick={() => {
              setEditMode(false); // Ensure it's in "add mode"
              setQuestion(""); // Reset form fields
              setAnswers(["", "", "", ""]); // Reset answers
              setCorrectAnswerIndex(0); // Reset correct answer index
              setModalOpen(true); // Open modal for adding quiz
            }}
            className="mt-6 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded"
          >
            Add Quiz
          </button>
          {/* Modal for adding/editing a quiz */}
          {modalOpen && (
            <Modal onClose={() => setModalOpen(false)}>
              <div className="relative">
                <button
                  onClick={() => setModalOpen(false)} // Close modal on click
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">
                  {editMode ? "Edit Quiz" : "Add a New Quiz"}
                </h2>
                <input
                  type="text"
                  placeholder="Enter question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                />
                {answers.map((answer, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Answer ${index + 1}`}
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    className="w-full p-2 border rounded mb-4"
                  />
                ))}
                <select
                  value={correctAnswerIndex}
                  onChange={(e) =>
                    setCorrectAnswerIndex(Number(e.target.value))
                  }
                  className="w-full p-2 border rounded mb-4"
                >
                  {answers.map((_, index) => (
                    <option key={index} value={index}>
                      Correct Answer {index + 1}
                    </option>
                  ))}
                </select>
                <button
                  className="w-full px-4 py-2 cursor-pointer bg-blue-500 text-white rounded"
                  onClick={editMode ? addQuiz : addQuiz}
                >
                  {editMode ? "Update Quiz" : "Add Quiz"}
                </button>
              </div>
            </Modal>
          )}
          {/* Display quizzes in a 5-column grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {session.quizzes.length > 0 ? (
              session.quizzes.map((quiz: Quiz) => (
                <div key={quiz._id} className="border p-4 rounded mb-4">
                  <div className="flex justify-between">
                    {/* Display only the question */}
                    <p className="font-bold">{quiz.question}</p>
                    {/* Edit and Delete icons for each quiz */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        className="text-blue-500 cursor-pointer"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="text-red-500 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No quizzes added yet.</p>
            )}
          </div>
          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
          >
            Publish
          </button>
          {/* Copy Link Button */}
          {sessionLink && (
            <div className="mt-4">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Copy Link
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading session data...</p>
      )}
    </div>
  );
}
