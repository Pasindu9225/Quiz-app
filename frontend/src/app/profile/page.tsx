"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);

      // Generate a preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage || !user) return;

    const formData = new FormData();
    formData.append("profilePic", selectedImage);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send as FormData
      });

      if (!response.ok) throw new Error("Failed to update profile picture");

      const data = await response.json();
      setUser(data.user);
      setPreview(null);
      setSelectedImage(null);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;

  const handleDeleteUser = async () => {
    if (!user) return;

    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone!"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      alert("User deleted successfully");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-5 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

      {/* Profile Image Preview */}
      <div className="flex justify-center mb-4">
        <Image
          src={preview || user?.profilePic || "/default-avatar.png"}
          alt="Profile"
          width={100}
          height={100}
          className="w-24 h-24 rounded-full border object-cover"
        />
      </div>

      {/* File Input for Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Upload Button */}
      {selectedImage && (
        <button
          onClick={handleUploadImage}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Upload Image
        </button>
      )}

      <label className="block mb-2 font-medium">Name:</label>
      <input
        type="text"
        name="name"
        value={user?.name || ""}
        disabled
        className="w-full border p-2 rounded mb-2"
      />

      <label className="block mb-2 font-medium">Email:</label>
      <input
        type="email"
        name="email"
        value={user?.email || ""}
        disabled
        className="w-full border p-2 rounded mb-4 bg-gray-100"
      />

      <br />
      <button
        onClick={handleDeleteUser}
        className="w-full bg-red-500 text-white p-2 rounded-md mt-4 hover:bg-red-600"
      >
        Delete Account
      </button>
    </div>
  );
}
