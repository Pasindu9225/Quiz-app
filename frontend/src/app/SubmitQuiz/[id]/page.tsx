"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation"; // Correctly access route parameters

export default function SubmitQuiz() {
  const { id: sessionId } = useParams<{ id: string }>();
  const [quizzes, setQuizzes] = useState<string[]>([]);
  const [isQuizLoaded, setIsQuizLoaded] = useState(false);

  const fetchQuizzes = async () => {
    try {
      if (!sessionId) {
        console.error("Session ID is missing.");
        return;
      }

      console.log("Fetching quizzes for session:", sessionId);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Redirecting to login...");
        return;
      }

      const response = await axios.get<{ data: string[] }>(
        `http://localhost:5000/api/sessions/${sessionId}/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched quiz IDs:", response.data);

      if (Array.isArray(response.data)) {
        setQuizzes(response.data);
        setIsQuizLoaded(true);
      } else {
        console.error("Fetched quizzes data is not in the expected format.");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response error status:", error.response.status);
        console.error("Response error data:", error.response.data);
      }
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchQuizzes();
    }
  }, [sessionId]);

  return (
    <div className="p-4">
      {!isQuizLoaded ? (
        <div>
          <h1 className="text-3xl font-semibold mb-6">Loading Quizzes...</h1>
        </div>
      ) : (
        <div>
          {quizzes.length > 0 ? (
            quizzes.map((quizId) => (
              <div key={quizId} className="mb-6">
                <h1 className="text-xl font-semibold">Quiz ID: {quizId}</h1>
              </div>
            ))
          ) : (
            <p>No quizzes available for this session.</p>
          )}
        </div>
      )}
    </div>
  );
}
