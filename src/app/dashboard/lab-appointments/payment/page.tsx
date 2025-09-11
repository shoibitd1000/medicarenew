
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, CheckCircle, IndianRupee } from 'lucide-react';

export default function LabPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '200';
  const [mobileNumber, setMobileNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
        <div className="max-w-md mx-auto">
            <Card className="text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-green-100 p-4 rounded-full border border-green-200 w-fit">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-headline text-primary">Payment Successful!</CardTitle>
                    <CardDescription>Your lab appointment is confirmed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>You will receive an SMS confirmation shortly. Thank you for choosing MediCare Hospitals.</p>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button onClick={() => router.push('/dashboard/lab-appointments')} className="w-full">
                        View Lab Appointments
                    </Button>
                     <Button onClick={() => router.push('/dashboard')} className="w-full" variant="outline">
                        Back to Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }


  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">M-Pesa Payment for Lab Test</CardTitle>
          <CardDescription>Enter your M-Pesa mobile number to complete the payment.</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="e.g., 0712345678"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    className="pl-10"
                />
                </div>
            </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay KES ${amount}`}
                </Button>
                <Button variant="ghost" className="w--full" onClick={() => router.back()}>
                    Cancel
                </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    