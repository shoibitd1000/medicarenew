import React, { useState, useContext } from "react";
import { Button } from "../../components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";
import { Input } from "../../components/components/ui/input";
import { Label } from "../../components/components/ui/label";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../app/authtication/Authticate";
import Toaster, { notify } from "../../../lib/notify";
import axios from "axios";
import { encryptPassword } from "../../../components/EncyptHooks/EncryptLib";
import { apiUrls } from "../../components/Network/ApiEndpoint";

export default function ResetPasswordPage() {
  const { token, getAuthHeader } = useContext(AuthContext);
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password requirements
  const requirements = [
    {
      id: 1,
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      id: 2,
      label: "1 uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      id: 3,
      label: "1 lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      id: 4,
      label: "1 special character",
      test: (pwd) => /\W/.test(pwd),
    },
  ];

  // Validate and submit password reset
  const handleReset = async (e) => {
    e.preventDefault();
    setPasswordMatchError(false);

    // Validate password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      notify(
        "Password must be minimum 8 characters, include 1 uppercase, 1 lowercase, and 1 special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMatchError(true);
      notify("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (!token) {
        notify("User is not authenticated.");
        navigate("/login");
        return;
      }

      const encryptedNewPassword = encryptPassword(newPassword);
      const encryptedConfirmPassword = encryptPassword(confirmPassword);

      const apiUrl = `${apiUrls.ResetProfilepasswordapi}?oldpassword=${(
        encryptPassword("") // No old password required for reset
      )}&newpassword=${(
        encryptedNewPassword
      )}&confirmedpassword=${(
        encryptedConfirmPassword
      )}&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

      const response = await axios.post(apiUrl, {}, { headers: getAuthHeader() });

      if (response?.data?.status === true) {
        notify(response?.data?.message || "Password reset successfully!", "success");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/"); // Navigate to home or adjust to desired route (e.g., "/MpinScreen" equivalent)
      } else {
        notify(response?.data?.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      notify("Something went wrong. Please try again.");
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 border border-primary/20 w-fit">
              <img
                src="https://placehold.co/100x100.png"
                alt="Hospital Logo"
                className="mx-auto"
                width={80}
                height={80}
              />
            </div>
            <CardTitle className="text-3xl font-bold font-headline text-primary">
              Reset Password
            </CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleReset} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordMatchError(false);
                    }}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {/* Password Requirements */}
                <div className="mt-2 space-y-1">
                  {requirements.map((req) => {
                    const isMet = req.test(newPassword);
                    return (
                      <div key={req.id} className="flex items-center">
                        {isMet ? (
                          <CheckCircle2
                            className="h-4 w-4 text-green-500 mr-2"
                          />
                        ) : (
                          <Circle
                            className="h-4 w-4 text-gray-400 mr-2"
                          />
                        )}
                        <span
                          className={`text-xs ${
                            isMet ? "text-green-500" : "text-gray-400"
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordMatchError(false);
                    }}
                    required
                    className={`pr-10 ${passwordMatchError ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full text-lg h-12 bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  );
}