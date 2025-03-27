"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal"; // ✅ Import modal component

const Dashboard = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [sessions, setSessions] = useState<{ _id: string; title: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");

  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Fetch user sessions
  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/sessions/my-sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // Create new session
  const handleCreateSession = async () => {
    if (!newSessionTitle) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/sessions/create-session",
        { title: newSessionTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessions([...sessions, response.data.session]);
      setModalOpen(false);
      setNewSessionTitle("");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6">
          <h1 className="text-3xl font-semibold">
            Welcome, {user?.name || "User"}!
          </h1>

          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setModalOpen(true)}
          >
            Add Session
          </button>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session._id} className="p-4 border rounded shadow">
                <h2 className="text-lg font-bold">{session.title}</h2>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal for creating a session */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Create New Session</h2>
          <input
            type="text"
            placeholder="Enter session title"
            value={newSessionTitle}
            onChange={(e) => setNewSessionTitle(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleCreateSession}
          >
            Create
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
