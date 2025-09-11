'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function GeneratePasswordPage() {
  const router = useRouter();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to send OTP would go here
    router.push('/verify-otp');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="absolute top-4 left-4">
             <Button variant="ghost" size="icon" onClick={() => router.back()}>
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
                Login
                </CardTitle>
                <CardDescription>
                To reset your password, please enter the PatientId address linked to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="patientId">Patient Id / Mobile Number</Label>
                    <Input id="patientId" type="text" placeholder="Enter Patient Id / MoNumber" required />
                </div>
                <Button type="submit" className="w-full text-lg h-12 bg-primary hover:bg-primary/90">
                    Send
                </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
