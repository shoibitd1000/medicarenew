import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components/ui/card';
import CustomInput from '../../components/components/ui/CustomInput';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { apiUrls } from '../../components/Network/ApiEndpoint';
import { encryptPassword } from '../../components/EncyptHooks/EncryptLib';
import Toaster, { notify } from '../../lib/notify';

export default function GeneratePasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, notify] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email.trim()) {
        notify('Please Enter Patient ID or Email');
        setLoading(false);
        return;
      }
      notify('');

      const deviceType = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'I' : 'A';
      const deviceId =
        'elRjUBWVTUmpoP7CVOG1I-%3AAPA91bGfOwTxW7QYf981cRs_5ATiqmye466BFPA7WtTlwQQN8zFR9zOWSGGUgWDNVeJviMyuWGrrDG0P6vXOYSRxNf7qRxR4z-yvSmrcSQ2rPEm9yeWGqvo';

      // Updated API endpoint
      const apiUrl = `${apiUrls.forgotPasswordapi}?EmailID=${encryptPassword(
        email
      )}&devicetype=${deviceType}&deviceid=${deviceId}`;

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.data?.status === true) {
        const token = response?.data?.response?.APIToken;
        alert('Success: ' + response?.data?.message); // Using browser alert
        navigate('/verify/otp', /* { state: { email, token } } */); // Navigate to OTP verification
        setEmail('');
      } else {
        notify(response?.data?.message);
      }
    } catch (error) {
      console.error(error?.message, 'error');
      if (error?.message === 'Request failed with status code 500') {
        notify('Please try after some time');
        setEmail('');
      } else {
        notify('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 border border-primary/20 w-fit">
              <ShieldAlert className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline text-primary">
              Forget Password
            </CardTitle>
            <CardDescription>
              To reset your password, please enter the Patient ID or Mobile Number linked to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-2">
                <CustomInput
                  id="patientId"
                  type="text"
                  placeholder="UID/Mobile Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  required
                  leftIcon={<ShieldAlert className="h-5 w-5 text-gray-400" />}
                />
                {errorMessage ? (
                  <p className="text-red-500 text-xs font-semibold mt-1">{errorMessage}</p>
                ) : null}
              </div>
              <Button
                type="submit"
                className="w-full text-lg h-12 bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white inline-block mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                ) : (
                  'Send'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </main>
  );
}