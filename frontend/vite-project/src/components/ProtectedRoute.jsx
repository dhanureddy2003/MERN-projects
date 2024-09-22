import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const user = await res.json();
        if (!res.ok) throw new Error(user.error || "Failed to fetch user data");
        if (user.error) return null;
        return user.user;
      } catch (error) {
        console.log("Error fetching user:", error);
        throw error;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="text-white h-[100vh] w-[100vw]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
