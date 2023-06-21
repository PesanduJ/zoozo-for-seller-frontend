import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("/logout", {
        withCredentials: true,
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password'),
        },
      });
      document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      navigate("/");
      localStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    logout();
  }, []); // Empty dependency array ensures the effect runs only once

  return <div>Logging out...</div>;
};

export default Logout;
