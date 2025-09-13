'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components/ui/card';
import { Input } from '../../components/components/ui/input';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function VerifyOtpPage() {
  const router = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = element.value;
      return newOtp;
    });

    // Focus next input
    if (element.value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    console.log(`Entered OTP: ${enteredOtp}`);
    router('/reset-password');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={() => router(-1)}>
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </div>
        <Card className="shadow-2xl border-none">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 border border-primary/20 w-fit">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold font-headline text-primary">
              An OTP has been sent to your Number Connected to 11295794
            </CardTitle>
            <CardDescription>
              Please check inbox to continue password reset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-center gap-1 sm:gap-2">
                {otp.map((data, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <Button type="submit" className="w-full text-lg h-12 bg-primary hover:bg-primary/90">
                Verify OTP
              </Button>
            </form>
            <div className="text-center mt-4">
              <Button asChild variant="link">
                <Link to="#">Resend OTP</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
