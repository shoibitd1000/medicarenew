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
import { useNavigate } from "react-router-dom";
import { encryptPassword } from "../../EncyptHooks/EncryptLib";

export default function SwitchProfileDialog({ onClose, allUsers, currentUser, onSwitchProfile }) {
  const { token, userData, selectedPatientId, saveSelectedPatientId, getAuthHeader, logout } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [selectedId, setSelectedId] = useState(selectedPatientId || "");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch dependent profiles
  const fetchProfiles = async () => {
    try {
      const Mobile = userData?.Mobile;
      if (!token || !Mobile) {
        notify("No authentication token or mobile number available. Please log in.");
        logout();
        navigate("/login");
        return;
      }

      setIsLoading(true);
      debugger
      const response = await axios.get(
        `${apiUrls.switchProfileapi}?Mobile=${Mobile /* 0757270848 */}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.status && Array.isArray(data.response)) {
        const fetchedProfiles = data.response.map((item, index) => ({
          id: item.PatientID || `${index + 1}`,
          name: item.Pname || "Unknown",
          relation: item.Relation || "Self",
          photoImage: item.PhotoImage || "",
          patientId: item.PatientID || "", // Ensure PatientID is included
        }));
        setProfiles(fetchedProfiles);

        // Set default selected profile based on selectedPatientId
        if (selectedPatientId) {
          const selectedProfile = fetchedProfiles.find(
            (profile) => profile.patientId === selectedPatientId
          );
          if (selectedProfile) {
            setSelectedId(selectedProfile.patientId);
          }
        }
      } else {
        setProfiles([]);
        notify(data.message || "No dependent profiles found.");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      notify("Failed to load profiles. Please try again.");
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.");
        logout();
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && userData?.Mobile) {
      fetchProfiles();
    } else {
      setIsLoading(false);
    }
  }, [token, userData, selectedPatientId]);

  // Handle profile switch
  const handleSwitchProfile = (profile) => {
    if (!profile.patientId) {
      notify("Invalid profile selected. Please try again.");
      return;
    }
    setSelectedId(profile.patientId);
    saveSelectedPatientId(profile.patientId); // Save PatientID to context and AsyncStorage
    notify(`Switched to profile: ${profile.name}`, "success");

    // Call onSwitchProfile with the selected profile to update DashboardHeader
    const selectedUser = {
      PatientID: profile.patientId,
      FirstName: profile.name.split(" ")[0] || profile.name,
      LastName: profile.name.split(" ").slice(1).join(" ") || "",
      PatientASID: profile.patientId, // Adjust based on your API
      ProfileImage: profile.photoImage,
      initials: profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "UU",
    };
    onSwitchProfile(selectedUser);

    onClose(); // Close dialog
    navigate("/dashboard"); // Navigate to dashboard
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
              <span className="ml-2 text-blue-600">Loading profiles...</span>
            </div>
          ) : profiles.length === 0 ? (
            <p className="text-center text-gray-500 text-sm font-medium">
              No dependent profiles available.
            </p>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${selectedId === profile.patientId
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-100 cursor-pointer"
                  }`}
              >
                {/* Left side (avatar + details) */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage
                      src={
                        profile.photoImage
                          ? `data:image/jpeg;base64,${profile.photoImage}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=40`
                      }
                      alt={profile.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "UU"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {profile.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">{profile.relation}</p>
                  </div>
                </div>

                {/* Right side (button) */}
                <Button
                  variant={selectedId === profile.patientId ? "outline" : "default"}
                  size="sm"
                  className={`flex items-center gap-2 text-xs sm:text-sm ${selectedId === profile.patientId
                    ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  onClick={() => handleSwitchProfile(profile)}
                  disabled={selectedId === profile.patientId}
                  aria-label={
                    selectedId === profile.patientId
                      ? `Selected: ${profile.name}`
                      : `Select ${profile.name}`
                  }
                >
                  {selectedId === profile.patientId ? (
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