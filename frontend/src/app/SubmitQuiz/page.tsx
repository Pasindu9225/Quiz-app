"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Quiz {
  _id: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

export default function SubmitQuiz() {
  const [sessionId, setSessionId] = useState<string>("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // Initialize quizzes as an empty array
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [marks, setMarks] = useState<number | null>(null); // Marks at the end
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Whether quiz has started or not

  const router = useRouter();

  // Fetch quizzes for a session
  const fetchQuizzes = async () => {
    try {
      if (!sessionId) return; // Don't fetch if sessionId is empty
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Redirecting to login...");
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/sessions/${sessionId}/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ensure quizzes data is set correctly
      if (Array.isArray(response.data)) {
        setQuizzes(response.data);
      } else {
        console.error("Fetched quizzes data is not an array.");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  // Start the quiz when sessionId is entered
  const handleStartQuiz = () => {
    if (!sessionId) {
      alert("Please enter a valid session ID.");
      return;
    }
    fetchQuizzes(); // Fetch quizzes when starting the quiz
    setIsQuizStarted(true); // Start the quiz
  };

  // Handle answer selection
  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index);
  };

  // Submit the answer and check if it is correct
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer.");
      return;
    }

    // Check if the answer is correct
    if (selectedAnswer === quizzes[currentQuestionIndex].correctAnswerIndex) {
      setCorrectAnswers((prev) => prev + 1);
    }

    // Move to the next question
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizzes.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null); // Reset selected answer for next question
    } else {
      // End of quiz, calculate total marks
      setMarks(correctAnswers);
    }
  };

  // Render the page
  return (
    <div className="p-4">
      {!isQuizStarted ? (
        <div>
          <h1 className="text-3xl font-semibold mb-6">Start Quiz</h1>
          <input
            type="text"
            placeholder="Enter Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="p-2 border rounded mb-4"
          />
          <button
            onClick={handleStartQuiz}
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded"
          >
            Start Quiz
          </button>
        </div>
      ) : marks === null ? (
        <div>
          {/* Ensure quizzes is available and map over them only if quizzes is not empty */}
          {quizzes.length > 0 && (
            <>
              <h1 className="text-3xl font-semibold mb-6">
                {quizzes[currentQuestionIndex]?.question}
              </h1>
              <div className="flex flex-col">
                {quizzes[currentQuestionIndex]?.answers?.map(
                  (answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelection(index)}
                      className="p-2 border rounded mb-2 cursor-pointer"
                      style={{
                        backgroundColor:
                          selectedAnswer === index ? "#d3d3d3" : "white",
                      }}
                    >
                      {answer}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={handleSubmitAnswer}
                className="mt-4 px-4 py-2 cursor-pointer bg-green-500 text-white rounded"
              >
                Submit Answer
              </button>
            </>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-semibold mb-6">Quiz Completed!</h1>
          <p>
            Your score: {marks} / {quizzes.length}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
