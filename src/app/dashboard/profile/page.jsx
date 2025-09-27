import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/components/ui/avatar";
import { Button } from "../../../components/components/ui/button";
import {
  Card,
  CardContent,
} from "../../../components/components/ui/card";
import { Camera, ArrowLeft, KeyRound, Calendar, Mail, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DialogBox,
  DialogFooter,
} from "../../../components/components/ui/dialog";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import CustomInput from "../../../components/components/ui/CustomInput";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomSelect from "../../../components/components/ui/CustomSelect";
import { AuthContext } from "../../../app/authtication/Authticate";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import Toaster, { notify } from "../../../lib/notify";
import axios from "axios";
import { encryptPassword } from "../../../components/EncyptHooks/EncryptLib";
import IsLoader from "../../loading";

export default function ProfilePage() {
  const { token, userData, saveUserData, getAuthHeader, clearAuth } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [initialState, setInitialState] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    gender: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: "https://placehold.co/128x128.png",
    base64Image: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Helper to update fields
  const updateField = (key, value) =>
    setInitialState((prev) => ({ ...prev, [key]: value }));

  // Fetch user data
  const fetchUserData = async () => {
    try {
      if (!token) {
        notify("No authentication token available. Please log in.");
        navigate("/login");
        return;
      }
      setProfileLoading(true);

      const response = await axios.post(
        `${apiUrls.userprofileapiEditapi}?MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`,
        {},
        { headers: getAuthHeader() }
      );

      const data = response?.data?.response[0];
      if (data) {
        setInitialState((prev) => ({
          ...prev,
          name: `${data?.FirstName || ""} ${data?.LastName || ""}`.trim(),
          dob: data?.DOB ? new Date(data.DOB) : "",
          gender: data?.Gender?.toLowerCase() || "", // Normalize to lowercase
          phone: data?.Mobile || "",
          email: data?.Email || "",
          address: data?.Address || "",
          profileImage: data?.ProfileImage
            ? `data:image/jpeg;base64,${data.ProfileImage}`
            : prev.profileImage,
          base64Image: data?.ProfileImage || "",
        }));
      } else {
        notify("No profile data found.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      notify("Failed to load profile data.");
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  // Handle image upload
  const handleImagePick = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      notify("Please upload a valid image (JPEG, PNG, or GIF).");
      return;
    }
    if (file.size > maxSize) {
      notify("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",")[1];
      setInitialState((prev) => ({
        ...prev,
        base64Image: base64,
        profileImage: dataUrl,
      }));
    };
    reader.onerror = () => notify("Failed to read the image file.");
    reader.readAsDataURL(file);
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    const { oldPassword, newPassword, confirmPassword } = initialState;

    if (!oldPassword || !newPassword || !confirmPassword) {
      notify("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const encryptedOld = encryptPassword(oldPassword);
      const encryptedNew = encryptPassword(newPassword);
      const encryptedConfirm = encryptPassword(confirmPassword);

      const apiUrl = `${apiUrls.ResetProfilepasswordapi}?oldpassword=${encryptPassword(
        encryptedOld
      )}&newpassword=${encryptPassword(
        encryptedNew
      )}&confirmedpassword=${encryptPassword(
        encryptedConfirm
      )}&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

      const response = await axios.post(apiUrl, {}, { headers: getAuthHeader() });

      if (response?.data?.status === true) {
        notify(response?.data?.message || "Password updated successfully!", "success");
        setIsOpen(false);
        setInitialState((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        notify(response?.data?.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      notify("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile save
  const handleSaveChanges = async () => {
    const { phone, email, base64Image, gender } = initialState; // Added gender

    if (!phone || !email) {
      notify("Phone number and email cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("mobileappid", "gRWyl7xEbEiVQ3u397J1KQ==");
      fd.append("Mobile", phone);
      fd.append("Email", email);
      fd.append("Gender", gender); // Fixed: Use lowercase gender
      if (base64Image) fd.append("ProfileImage", base64Image);

      const response = await axios.post(apiUrls.updateProfileapi, fd, {
        headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.status === true) {
        saveUserData({
          ...userData,
          Mobile: phone,
          Email: email,
          Gender: gender, // Fixed: Use lowercase gender
          ProfileImage: base64Image || userData?.ProfileImage,
        });
        notify("Profile updated successfully!", "success");
      } else {
        notify(response?.data?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notify(error.response?.data?.message || "Something went wrong. Please try again.");
      if (error.response?.status === 401) clearAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      <Toaster />
      {profileLoading ? (
        <div className="flex justify-center items-center h-64">
          <IsLoader isFullScreen={false} size="6" />
        </div>
      ) : (
        <>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Card className="py-3">
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary/50">
                    <AvatarImage src={initialState.profileImage} alt="Profile" />
                    <AvatarFallback>
                      {initialState.name ? initialState.name.slice(0, 2).toUpperCase() : "PN"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
                    as="label"
                  >
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImagePick}
                    />
                  </Button>
                </div>
              </div>

              {/* Form */}
              <form className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    id="name"
                    type="text"
                    value={initialState.name}
                    readOnly
                    placeholder="Enter Your Name"
                  />
                  <CustomDatePicker
                    value={initialState.dob}
                    handleDate={(date) => updateField("dob", date)}
                    placeHolderText="Select Date of Birth"
                    disabled
                    icon={<Calendar className="absolute right-3 top-2 text-gray-500" />}
                  />
                  <CustomSelect
                    placeholder="Select a Gender"
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                    value={
                      initialState.gender
                        ? {
                          value: initialState.gender,
                          label: initialState.gender === "male" ? "Male" : "Female",
                        }
                        : null
                    }
                    onChange={(opt) => updateField("gender", opt.value)}
                    disabled
                  />
                  <CustomInput
                    id="mobile"
                    type="tel"
                    value={initialState.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Enter Mobile Number"
                    
                  />
                </div>
                <div className="my-4">
                  <CustomInput
                    id="email"
                    type="email"
                    value={initialState.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Enter Email"
                    icon={<Mail className="absolute right-3 top-2 text-gray-500" />}
                  />
                  
                </div>
                <div className="my-y">
                  <CustomTextArea
                    value={initialState.address}
                    readOnly
                    placeHolderText="Enter address"
                  />
                </div>
                <div className="md:col-span-2 flex justify-between">
                  <Button type="button" onClick={() => setIsOpen(true)}>
                    Change Password
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="bg-primary text-white"
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </CardContent>

            {/* Password Dialog */}
            <DialogBox open={isOpen} onOpenChange={setIsOpen} size="xl">
              <div className="my-3">
                <CustomInput
                  type="password"
                  value={initialState.oldPassword}
                  onChange={(e) => updateField("oldPassword", e.target.value)}
                  placeholder="Enter Your Old Password"
                  icon={<KeyRound className="absolute right-3 top-2 text-gray-500" />}
                />
                <CustomInput
                  type="password"
                  value={initialState.newPassword}
                  onChange={(e) => updateField("newPassword", e.target.value)}
                  placeholder="Enter Your New Password"
                  icon={<KeyRound className="absolute right-3 top-2 text-gray-500" />}
                />
                <CustomInput
                  type="password"
                  value={initialState.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Confirm New Password"
                  icon={<KeyRound className="absolute right-3 top-2 text-gray-500" />}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 text-white"
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </DialogFooter>
            </DialogBox>
          </Card>
        </>
      )}
    </div>
  );
}