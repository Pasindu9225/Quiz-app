"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

interface QuizSessionProps {
  sessionId: string;
}

export default function QuizSession({ sessionId }: QuizSessionProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      try {
        const { data } = await axios.get<Session>(`/api/sessions/${sessionId}`);
        setSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, [sessionId]);

  const addQuiz = async () => {
    if (!question.trim() || answers.some((a) => !a.trim())) {
      console.error("Question and all answers must be filled");
      return;
    }

    try {
      const { data } = await axios.post<{ quiz: Quiz }>(
        "/api/sessions/addQuiz",
        {
          sessionId,
          question,
          answers,
          correctAnswerIndex,
        }
      );
      setSession((prevSession) =>
        prevSession
          ? { ...prevSession, quizzes: [...prevSession.quizzes, data.quiz] }
          : prevSession
      );
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(0);
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  const deleteSession = async () => {
    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      router.push("/");
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <div className="p-4">
      {session && (
        <>
          <h1 className="text-2xl font-bold mb-4">{session.title}</h1>
          <button
            onClick={deleteSession}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Delete Session
          </button>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border p-2 w-full"
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
                className="border p-2 w-full mt-2"
              />
            ))}
            <select
              value={correctAnswerIndex}
              onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
              className="border p-2 w-full mt-2"
            >
              {answers.map((_, index) => (
                <option key={index} value={index}>
                  Correct Answer {index + 1}
                </option>
              ))}
            </select>
            <button
              onClick={addQuiz}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Add Quiz
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Quizzes</h2>
            {session.quizzes.length > 0 ? (
              session.quizzes.map((quiz: Quiz) => (
                <div key={quiz._id} className="border p-2 mt-2">
                  <p className="font-bold">{quiz.question}</p>
                  <ul className="list-disc ml-4">
                    {quiz.answers.map((answer, index) => (
                      <li
                        key={index}
                        className={
                          index === quiz.correctAnswerIndex
                            ? "text-green-600"
                            : ""
                        }
                      >
                        {answer}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No quizzes added yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
