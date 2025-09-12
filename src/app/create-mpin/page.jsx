import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";

export default function CreateMpinPage() {
  const navigate = useNavigate();
  const length = 4;
  const [mpin, setMpin] = useState<string[]>(new Array(length).fill(""));

  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    new Array(length).fill(null)
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    const digitOnly = value.replace(/\D/g, "");
    const digits = digitOnly.split("");

    setMpin((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && index + i < next.length; i++) {
        next[index + i] = digits[i];
      }
      return next;
    });

    const nextPos = Math.min(index + digits.length, length - 1);
    inputRefs.current[nextPos]?.focus();
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length - index);
    if (!pasted) return;

    const digits = pasted.split("");
    setMpin((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && index + i < next.length; i++) {
        next[index + i] = digits[i];
      }
      return next;
    });

    const endIndex = Math.min(index + digits.length - 1, length - 1);
    inputRefs.current[endIndex]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key;

    if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      setMpin((prev) => {
        const next = [...prev];

        if (next[index]) {
          next[index] = "";
          setTimeout(() => inputRefs.current[index]?.focus(), 0);
        } else if (index > 0) {
          next[index - 1] = "";
          setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
        }

        return next;
      });
    }

    if (key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredMpin = mpin.join("");
    if (enteredMpin.length === 4) {
      console.log(`MPIN created: ${enteredMpin}`);
      navigate("/dashboard");
    } else {
      alert("Please enter a 4-digit MPIN.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <Card className="shadow-2xl border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Create new MPIN
            </CardTitle>
            <CardDescription>
              To login quicker on the Tenwek App
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleConfirm} className="space-y-8">
              <div className="flex justify-center gap-2 sm:gap-4">
                {mpin.map((value, index) => (
                  <input
                    key={index}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    onFocus={(e) => e.target.select()}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-14 h-14 sm:w-16 sm:h-16 border rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full text-lg h-12 bg-primary hover:bg-primary/90"
              >
                Confirm
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
