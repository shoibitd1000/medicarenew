import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/components/ui/card';
import CustomInput from '../../components/components/ui/CustomInput';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function GeneratePasswordPage() {
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault();
    // Logic to send OTP would go here
    navigate('/verify/otp');
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
              To reset your password, please enter the PatientId address linked to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="patientId">Patient Id / Mobile Number</label>
                
                <CustomInput
                  id="patientId"
                  type="text"
                  placeholder="Enter Patient Id / MoNumber"
                  // value={""}
                  // onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  required
                />
              </div>
              <Button type="submit" className="w-full text-lg h-12 bg-primary hover:bg-primary/90" >
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
