"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation"; // Correctly access route parameters

export default function SubmitQuiz() {
  const { id: sessionId } = useParams(); // Access the dynamic route parameter using useParams
  const [quizIds, setQuizIds] = useState<string[]>([]); // Array to hold quiz IDs
  const [isQuizLoaded, setIsQuizLoaded] = useState(false);

  // Fetch quiz IDs function
  const fetchQuizzes = async () => {
    try {
      if (!sessionId) return;

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Redirecting to login...");
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

      console.log("Fetched response data:", response.data);

      if (Array.isArray(response.data)) {
        setQuizIds(response.data); // Set quiz IDs
        setIsQuizLoaded(true);
      } else {
        console.error("Fetched quizzes data is not in the expected format.");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  // Trigger fetching quizzes when the sessionId is available
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
          {quizIds.length > 0 ? (
            quizIds.map((quizId) => (
              <div key={quizId} className="mb-6">
                <h2 className="text-xl font-semibold">Quiz ID: {quizId}</h2>
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
