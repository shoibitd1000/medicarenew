import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ instead of next/navigation
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
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Logic to reset password would go here
    console.log("Password reset successfully.");
    navigate("/"); // ✅ react-router redirect
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
              {/* ✅ Replaced Next.js <Image> with <img> */}
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
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <p className="text-xs text-muted-foreground">
                  Password must be minimum 8 characters and include 1 uppercase,
                  1 lowercase, and 1 special character.
                </p>
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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
              >
                Reset
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
