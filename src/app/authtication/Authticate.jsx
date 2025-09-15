import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState(null);

  const TOKEN_EXPIRY_KEY = "tokenExpiry";

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");   // APIToken
      const storedUserData = localStorage.getItem("userData");
      const storedDeviceId = localStorage.getItem("deviceId");
      const storedPatientId = localStorage.getItem("selectedPatientId");
      /* const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (expiry && Date.now() > parseInt(expiry, 10)) {
        clearAuth();
        setIsLoading(false);
        return;
      } */

      if (storedToken) setToken(storedToken);

      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          if (parsedUserData && typeof parsedUserData === "object") {
            setUserData(parsedUserData);

            if (!storedPatientId && parsedUserData?.PatientID) {
              localStorage.setItem("selectedPatientId", parsedUserData.PatientID);
              setSelectedPatientId(parsedUserData.PatientID);
            }
          }
        } catch (e) {
          console.error("Invalid userData format");
          clearAuth();
        }
      }

      if (storedDeviceId) setDeviceId(storedDeviceId);
      if (storedPatientId) setSelectedPatientId(storedPatientId);
    } catch (err) {
      console.error("Error loading auth data:", err);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isValidToken = (token) =>
    typeof token === "string" && token.trim().length > 0;


  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("selectedPatientId");
    localStorage.removeItem("deviceId");
    localStorage.removeItem(TOKEN_EXPIRY_KEY);

    setToken(null);
    setUserData(null);
    setSelectedPatientId(null);
    setDeviceId(null);
  };

  const logout = (navigate) => {
    clearAuth();
    if (navigate && typeof navigate === "function") {
      navigate("/", { replace: true });
    } else {
      window.location.href = "/";
    }
  };

  const saveToken = (newToken, ttlMs = 6 * 60 * 60 * 1000) => {
    if (!isValidToken(newToken)) return;
    localStorage.setItem("token", newToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + ttlMs).toString());
    setToken(newToken);
  };

  const saveUserData = (data) => {
    if (!data || typeof data !== "object") return;
    localStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);

    if (!selectedPatientId && data?.PatientID) {
      localStorage.setItem("selectedPatientId", data.PatientID);
      setSelectedPatientId(data.PatientID);
    }
  };

  const saveSelectedPatientId = (patientId) => {
    if (!patientId) return;
    localStorage.setItem("selectedPatientId", patientId);
    setSelectedPatientId(patientId);
  };

  const saveDeviceId = (id) => {
    try {
      localStorage.setItem("deviceId", id);
      setDeviceId(id);
    } catch (error) {
      console.error("Error saving device ID:", error);
    }
  };

  const getCurrentPatientId = () => {
    return selectedPatientId || userData?.PatientID || null;
  };


  const getAuthHeader = () => {
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } else {
      return {};
    }
  };


  // Axios interceptor (inject token)
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        selectedPatientId,
        saveToken,
        saveUserData,
        saveSelectedPatientId,
        logout,
        saveDeviceId,
        isLoading,
        getCurrentPatientId,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
