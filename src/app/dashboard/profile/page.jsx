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

export default function ProfilePage() {
  const { token, userData, saveUserData, getAuthHeader,clearAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("https://placehold.co/128x128.png");
  const [base64Image, setBase64Image] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

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
        {
          headers: getAuthHeader(),
        }
      );

      const data = response?.data?.response[0];
      if (data) {
        setName(`${data?.FirstName || ""} ${data?.LastName || ""}`.trim());
        setSelectedDate(data?.DOB ? new Date(data.DOB) : "");
        setSelectedGender(data?.Gender || "");
        setPhone(data?.Mobile || "");
        setEmail(data?.Email || "");
        setAddress(data?.Address || "");
        if (data?.ProfileImage) {
          setProfileImage(`data:image/jpeg;base64,${data.ProfileImage}`);
          setBase64Image(data.ProfileImage); // Store raw Base64 for saving
        }
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

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
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
      const base64 = dataUrl.split(",")[1]; // Extract raw Base64 string
      setBase64Image(base64); // Store raw Base64 for backend
      setProfileImage(dataUrl); // Set full data URL for preview
    };
    reader.onerror = () => {
      notify("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
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
      if (!token) {
        notify("User is not authenticated.");
        navigate("/login");
        return;
      }

      const encryptedOldPassword = encryptPassword(oldPassword);
      const encryptedNewPassword = encryptPassword(newPassword);
      const encryptedConfirmPassword = encryptPassword(confirmPassword);

      const apiUrl = `${
        apiUrls.ResetProfilepasswordapi
      }?oldpassword=${encodeURIComponent(
        encryptedOldPassword
      )}&newpassword=${encodeURIComponent(
        encryptedNewPassword
      )}&confirmedpassword=${encodeURIComponent(
        encryptedConfirmPassword
      )}&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

      const response = await axios.post(apiUrl, {}, { headers: getAuthHeader() });

      if (response?.data?.status === true) {
        notify(response?.data?.message || "Password updated successfully!", "success");
        setIsOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        notify(response?.data?.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      notify("Something went wrong. Please try again.");
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle profile save
  const handleSaveChanges = async () => {
    if (!phone || !email) {
      notify("Phone number and email cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("mobileappid", "gRWyl7xEbEiVQ3u397J1KQ==");
      formData.append("Mobile", phone);
      formData.append("Email", email);
      if (base64Image) {
        formData.append("ProfileImage", base64Image); 
      }

      const response = await axios.post(apiUrls.updateProfileapi, formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status === true) {
        // Update userData in AuthContext with the new profile image
        saveUserData({
          ...userData,
          Mobile: phone,
          Email: email,
          ProfileImage: base64Image || userData?.ProfileImage,
        });
        notify("Profile updated successfully!", "success");
      } else {
        notify(response?.data?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notify(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.");
        // navigate("/login");
        clearAuth()
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      <Toaster/>
      {profileLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-blue-600">Loading Profile...</span>
        </div>
      ) : (
        <>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Card className="py-3">
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary/50">
                    <AvatarImage
                      src={profileImage}
                      alt="Patient Name"
                      data-ai-hint="profile picture"
                    />
                    <AvatarFallback>
                      {name ? name.slice(0, 2).toUpperCase() : "PN"}
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
                    <span className="sr-only">Change profile photo</span>
                  </Button>
                </div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <CustomInput
                    id="name"
                    type="text"
                    placeholder="Enter Your Name"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    value={name}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <CustomDatePicker
                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                    value={selectedDate}
                    placeHolderText="Select Date of Birth"
                    handleDate={(date) => setSelectedDate(date)}
                    icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <CustomSelect
                    placeholder="Select a Gender"
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                    value={
                      selectedGender
                        ? { value: selectedGender, label: selectedGender }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setSelectedGender(selectedOption.value)
                    }
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <CustomInput
                    id="mobile"
                    type="tel"
                    placeholder="Enter Mobile Number"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <CustomInput
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<Mail className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="">
                    <label>Address</label>
                    <CustomTextArea
                      repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                      value={address}
                      placeHolderText="Enter address"
                      readOnly
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-between">
                  <Button
                    className="md:w-auto bg-slate-200 text-primary hover:bg-accent/90"
                    onClick={() => setIsOpen(true)}
                    type="button"
                  >
                    <Key className="text-primary h-5 w-5" />
                    Change Password
                  </Button>
                  <Button
                    type="button"
                    className="md:w-auto bg-primary text-white hover:bg-blue"
                    onClick={handleSaveChanges}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <DialogBox open={isOpen} onOpenChange={setIsOpen} size="xl">
              <div className="my-3">
                <div className="text-center">
                  <Key className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
                  <h1 className="text-3xl font-bold text-blue-600 mt-2">
                    Change Password
                  </h1>
                  <p className="text-gray-500">
                    Enter your Old and New Password to update it.
                  </p>
                </div>

                <div className="my-5">
                  <CustomInput
                    id="oldPassword"
                    type="password"
                    placeholder="Enter Your Old Password"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    icon={<KeyRound className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                  />
                </div>
                <div className="my-5">
                  <CustomInput
                    id="newPassword"
                    type="password"
                    placeholder="Enter Your New Password"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    icon={<KeyRound className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                  />
                </div>
                <div className="my-5">
                  <CustomInput
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    icon={<KeyRound className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-300 text-white hover:bg-blue-500"
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </DialogFooter>
            </DialogBox>
          </Card>
        </>
      )}
      <Toaster />
    </div>
  );
}