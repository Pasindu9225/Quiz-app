"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Session {
  _id: string;
  title: string;
  sessionLink: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");

  const router = useRouter();

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

    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/sessions/my-sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchUser();
    fetchSessions();
  }, [router]);

  const handleCreateSession = async () => {
    if (!sessionTitle.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/sessions/create-session",
        { title: sessionTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessions([...sessions, response.data.session]); // ✅ Correctly updating state
      setModalOpen(false);
      setSessionTitle(""); // Reset input field
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

          {/* Add Session Button */}
          <div className="mt-6">
            <Button onClick={() => setModalOpen(true)}>Add Session</Button>
          </div>

          {/* List Sessions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session._id} className="p-4 border rounded-md shadow">
                <h3 className="text-lg font-semibold">{session.title}</h3>
                <p className="text-sm text-gray-600">{session.sessionLink}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal for Creating Session */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Session</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Session Title</Label>
            <Input
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateSession} className="w-full mt-4">
            Create Session
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
