import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, ShieldUser } from "lucide-react";
import CustomPasswordInput from "../components/components/ui/CustomPassInput";
import CustomInput from "../components/components/ui/CustomInput";
import { encryptPassword } from "../components/EncyptHooks/EncryptLib";
import { AuthContext } from "./authtication/Authticate";
import { apiUrls } from "../components/Network/ApiEndpoint";
import axios from "axios";

// Simple UUID generator for deviceId
function generateDeviceId() {
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { saveToken, saveUserData, saveDeviceId } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    let storedId = localStorage.getItem("deviceId");
    if (!storedId) {
      storedId = generateDeviceId();
      localStorage.setItem("deviceId", storedId);
    }
    setDeviceId(storedId);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const encryptedPassword = encryptPassword(password);
      const params = {
        username,
        // password: "lFHJxe7m+hD37Caog0eCSA==",/
        password: encryptedPassword,
        // password: "lFHJxe7m+hD37Caog0eCSA==",

        devicetype: "A",
        deviceid: deviceId,
      };
      debugger
      const res = await axios.post(apiUrls.login, null, { params });
      // const res = await axios.post(`http://197.138.207.30/MobileApp_API/API/LoginAPIDynamic/Getlogin`, null, { params });
      const data = res.data;

      if (data.status) {
        debugger
        const user = data.response?.[0];
        if (user.APIToken) {
          saveToken(user.APIToken);
        }

        saveUserData(user);
        saveDeviceId(deviceId);

        navigate("/dashboard", { replace: true });
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md flex flex-col justify-between shadow-2xl rounded-lg p-6 bg-white h-full sm:h-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto bg-blue-100 p-3 rounded-full border border-blue-200 w-fit mb-3">
            <ShieldUser className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600">Health Care</h1>
          <p className="text-gray-600">Secure Login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 flex-1 flex flex-col justify-center">
          <CustomInput
            id="userId"
            type="text"
            placeholder="UID / Mobile Number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none font-medium"
            leftIcon={<Mail className="h-5 w-5" />}
            required
          />

          <div className="relative">
            <CustomPasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none font-medium"
              required
              leftIcon={<KeyRound className="h-5 w-5" />}
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center uppercase bg-slate-200 px-3 py-1 rounded-lg">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !deviceId}
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Generate / Forgot Password
          </Link>
        </div>

        {/* Optional Footer */}
        {/* 
    <div className="bg-white border-t border-gray-300 w-full text-center text-xs capitalize py-2 mt-6">
      Copyright © 2025{" "}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.itdoseinfo.com/"
        className="text-blue-600 hover:underline"
      >
        ITDOSE INFOSYSTEMS PVT LTD
      </a>
    </div>
    */}
      </div>
    </div>

  );
}
