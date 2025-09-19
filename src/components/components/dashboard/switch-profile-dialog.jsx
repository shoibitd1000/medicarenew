import React, { useState, useEffect, useContext } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User, CheckCircle } from "lucide-react";
import Toaster, { notify } from "../../../lib/notify";
import axios from "axios";
import { AuthContext } from "../../../app/authtication/Authticate";
import { apiUrls } from "../../Network/ApiEndpoint";

// SwitchProfileDialog Component
export default function SwitchProfileDialog({ onClose }) {
  const { token, userData, selectedPatientId, saveSelectedPatientId, getAuthHeader, logout } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dependent users
  const fetchDependents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        notify("No authentication token available. Please log in.");
        logout(); // Trigger logout if no token
        return;
      }

      if (!userData?.Mobile) {
        notify("User mobile number not found. Please ensure your profile is complete.");
        setError("User mobile number not found.");
        return;
      }

      const response = await axios.get(
        `${apiUrls.switchProfileapi}?Mobile=${encodeURIComponent(userData.Mobile)}`,
        {
          headers: getAuthHeader(),
        }
      );

      if (response?.data?.status === true && Array.isArray(response.data.response) && response.data.response.length > 0) {
        const users = response.data.response.map((item) => ({
          id: item.PatientID || item.id || "", // Fallback for ID
          name: `${item.Pname || item.FirstName || ""} ${item.LastName || ""}`.trim() || "Unknown User",
          initials: `${item.Pname?.[0] || item.FirstName?.[0] || ""}${item.LastName?.[0] || ""}`.toUpperCase() || "UU",
          relation: item.Relation || "Self",
          avatarUrl: item.PhotoImage || item.AvatarUrl || "", // Support both fields
        }));
        setAllUsers(users);
      } else {
        setAllUsers([]);
        notify("No dependent profiles found.");
      }
    } catch (error) {
      console.error("Error fetching dependents:", error);
      setError("Failed to load profiles. Please try again.");
      notify("Failed to load profiles. Please try again.");
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.");
        logout(); // Trigger logout on 401
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load dependents on mount or when token/userData changes
  useEffect(() => {
    if (token && userData?.Mobile) {
      fetchDependents();
    }
  }, [token, userData]);

  // Determine current user
  const currentUser = allUsers.find((user) => user.id === selectedPatientId) || {
    id: userData?.PatientID || "",
    name: `${userData?.FirstName || ""} ${userData?.LastName || ""}`.trim() || "User Name Not Found",
    initials: `${userData?.FirstName?.[0] || ""}${userData?.LastName?.[0] || ""}`.toUpperCase() || "UN",
    relation: "Self",
    avatarUrl: userData?.AvatarUrl || userData?.PhotoImage || "",
  };

  // Handle profile switch
  const handleSwitchProfile = (user) => {
    if (!user.id) {
      notify("Invalid profile selected. Please try again.");
      return;
    }
    saveSelectedPatientId(user.id);
    notify(`Switched to profile: ${user.name}`, "success");
    onClose(); // Close dialog after switching
  };

  return (
    <div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DialogContent className="sm:max-w-md max-w-[95%] rounded-lg p-4 sm:p-6 bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-blue-600">
            Switch Profile
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Select a dependent to view their profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-sm font-medium">{error}</p>
          ) : allUsers.length === 0 ? (
            <p className="text-center text-gray-500 text-sm font-medium">
              No dependent profiles available.
            </p>
          ) : (
            allUsers.map((user) => (
              <div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  currentUser.id === user.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                {/* Left side (avatar + details) */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=40`}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">{user.relation}</p>
                  </div>
                </div>

                {/* Right side (button) */}
                <Button
                  variant={currentUser.id === user.id ? "outline" : "default"}
                  size="sm"
                  className={`flex items-center gap-2 text-xs sm:text-sm ${
                    currentUser.id === user.id
                      ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={() => handleSwitchProfile(user)}
                  disabled={currentUser.id === user.id}
                  aria-label={currentUser.id === user.id ? `Selected: ${user.name}` : `Select ${user.name}`}
                >
                  {currentUser.id === user.id ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Selected
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      Select
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
        <Toaster />
      </DialogContent>
    </div>
  );
};