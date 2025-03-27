// src/app/session/[id].tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation"; // useParams hook from next/navigation

// Define a type for the session object
interface Session {
  _id: string;
  title: string;
  // Add other properties based on the actual response data from the backend
}

const SessionPage = () => {
  const { id } = useParams(); // Access dynamic ID using useParams
  const [session, setSession] = useState<Session | null>(null); // Use the Session type here

  useEffect(() => {
    if (id) {
      // Fetch session data based on the session ID
      axios
        .get(`/api/sessions/${id}`) // Ensure this route is handled in your API
        .then((response) => {
          setSession(response.data); // Set session with correct type
        })
        .catch((error) => {
          console.error("Error fetching session data:", error);
        });
    }
  }, [id]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{session.title}</h1>
      <p>Session ID: {session._id}</p>
      {/* Display quizzes or other session data */}
    </div>
  );
};

export default SessionPage;
