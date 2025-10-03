import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/components/ui/button"; // Adjust path
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card"; // Adjust path
import { Input } from "../../components/components/ui/input"; // Adjust path
import { ArrowLeft, Mail } from "lucide-react";
import axios from "axios";
import Toaster from "../../lib/notify"; // Adjust path
import { apiUrls } from "../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../components/EncyptHooks/EncryptLib";

const OtpVerification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, token } = state || {};
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(120);
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    const interval = timer > 0 ? setInterval(() => setTimer((t) => t - 1), 1000) : null;
    return () => clearInterval(interval);
  }, [timer]);

  // Auto focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow single digit
    setError(false);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError(true);
      alert("Please enter a complete OTP");
      return;
    }

    try {
      const apiUrl = `${apiUrls.validateOtp}?OTP=${encryptPassword(enteredOtp)}&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;
      const response = await axios.post(apiUrl,{
      });

      if (response?.data?.status === true) {
        alert("Success: OTP Verified Successfully");
        resetState();
        navigate("/reset-password", { state: { email } });
      } else {
        setError(true);
        alert(response?.data?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(true);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleResend = () => {
    setTimer(120);
    setError(false);
    setOtp(new Array(6).fill(""));
    inputRefs.current[0]?.focus();
    // 🔹 Call resend OTP API here
  };

  const resetState = () => {
    setOtp(new Array(6).fill(""));
    setError(false);
    setTimer(0);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#E6F3FB]">
      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-[#0077CC] hover:bg-[#0077CC]/10"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </div>

        <Card className="shadow-2xl border-none bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto bg-[#0077CC]/10 p-3 rounded-full mb-4 border border-[#0077CC]/20 w-fit">
              <Mail className="h-10 w-10 text-[#0077CC]" />
            </div>
            <CardTitle className="text-xl font-bold text-[#0077CC]">
              An OTP has been sent to your Number Connected to{" "}
              <span className="font-extrabold">{email || "Unknown"}</span>
            </CardTitle>
            <CardDescription className="text-gray-500">
              Please check your inbox to continue password reset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className={`w-12 h-12 text-center border rounded-lg font-medium focus:ring-2 focus:ring-[#0077CC] focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full text-lg h-12 bg-[#0077CC] hover:bg-[#005F99] text-white"
              >
                Verify OTP
              </Button>
            </form>

            <div className="text-center mt-4">
              {timer > 0 ? (
                <p className="text-gray-600 text-base font-medium">
                  {formatTime(timer)}
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResend}
                  className="text-[#0077CC] hover:text-[#005F99]"
                >
                  Resend OTP
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </main>
  );
};

export default OtpVerification;
