"use client";

import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";

export default function withAuth<T extends object>(
  Component: ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // Redirect if no token
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <p>Loading...</p>;

    return <Component {...props} />;
  };
}
