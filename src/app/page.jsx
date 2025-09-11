import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, ShieldUser } from "lucide-react";
import CustomPasswordInput from "../components/components/ui/CustomPassInput";
import CustomInput from "../components/components/ui/CustomInput";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="mx-auto bg-blue-100 p-3 rounded-full border border-blue-200 w-fit mb-3">
            <ShieldUser className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600">Tenwek</h1>
          <p className="text-gray-600">Secure Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <CustomInput
            id="userId"
            type="text"
            placeholder="UID / Mobile Number"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            leftIcon={<Mail className="h-5 w-5" />}
            required={"required"}
          />
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
            <div className="max-w-md mx-auto mt-10">
              <CustomPasswordInput
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                leftIcon={<KeyRound className="h-5 w-5" />}
                required={"required"}
              />
            </div>
          </div>



          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/generate-password"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Generate / Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
