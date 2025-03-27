"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Fetch user data (Replace with actual API call)
    const fetchUserProfile = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setUser(data);
    };

    fetchUserProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <img
        src={user.avatar}
        alt="Profile Avatar"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <a
        href="/profile/edit"
        className="mt-4 block text-center bg-blue-500 text-white py-2 rounded"
      >
        Edit Profile
      </a>
    </div>
  );
}
