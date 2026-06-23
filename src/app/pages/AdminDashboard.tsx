import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchWithAuth } from "../../config/api";
import Home from "./Home";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("educart_token");
      
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/admin/login");
        return;
      }

      try {
        const response = await fetchWithAuth("/admin/verify");
        
        if (!response.ok) {
          console.log("Token invalid, redirecting to login");
          localStorage.removeItem("educart_token");
          localStorage.removeItem("educart_user");
          navigate("/admin/login");
          return;
        }

        // Successfully verified
        setChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  return <Home />;
}
