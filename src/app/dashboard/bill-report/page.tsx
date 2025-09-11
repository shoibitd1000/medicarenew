
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Printer } from "lucide-react";


const completedBills = [
    {
        billNo: 'OPB/24/000225664',
        date: '16-Sep-2024 12:29 PM',
        patientName: 'Neelam Singh',
        amount: 1200.0,
    },
    {
        billNo: 'IPD/24/000118992',
        date: '12-Aug-2024 03:45 PM',
        patientName: 'John Doe',
        amount: 45000.0,
    },
     {
        billNo: 'LAB/24/000345112',
        date: '25-Jul-2024 10:15 AM',
        patientName: 'Jane Doe',
        amount: 3500.0,
    },
];

const pendingBills = [
     {
        billNo: 'OPB/24/000225987',
        date: '28-Sep-2024 11:00 AM',
        patientName: 'Sam Doe',
        amount: 500.0,
    },
    {
        billNo: 'OPB/24/000225999',
        date: '29-Sep-2024 02:00 PM',
        patientName: 'Sam Doe',
        amount: 1500.0,
    },
    {
        billNo: 'LAB/24/000345223',
        date: '30-Sep-2024 09:30 AM',
        patientName: 'John Doe',
        amount: 800.0,
    }
];


export default function BillReportPage() {
    const router = useRouter();
    const [selectedBills, setSelectedBills] = useState<string[]>([]);

    const totalSelectedAmount = useMemo(() => {
        return selectedBills.reduce((total, billNo) => {
            const bill = pendingBills.find(b => b.billNo === billNo);
            return total + (bill?.amount || 0);
        }, 0);
    }, [selectedBills]);
    
    const handlePrint = () => {
        // In a real app, this would trigger a print-friendly view or a PDF download.
        alert('Print functionality is not implemented in this demo.');
    }

    const handleSelectBill = (billNo: string) => {
        setSelectedBills(prev => 
            prev.includes(billNo)
            ? prev.filter(no => no !== billNo)
            : [...prev, billNo]
        );
    };

    const handlePayNow = () => {
        router.push(`/dashboard/bill-report/payment?amount=${totalSelectedAmount}`);
    }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">
          Bill History
        </h1>
        <p className="text-muted-foreground">
          View your pending and completed bills.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {pendingBills.length > 0 ? (
            <div className="space-y-4">
                {pendingBills.map((bill) => (
                    <Card key={bill.billNo} className="shadow-md">
                        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4 flex-grow">
                                 <Checkbox
                                    id={bill.billNo}
                                    checked={selectedBills.includes(bill.billNo)}
                                    onCheckedChange={() => handleSelectBill(bill.billNo)}
                                    className="h-6 w-6"
                                />
                                <Label htmlFor={bill.billNo} className="cursor-pointer flex-grow">
                                    <p className="font-bold text-lg text-primary">{bill.billNo}</p>
                                    <p className="text-sm text-muted-foreground">{bill.date}</p>
                                    <p className="mt-2">{bill.patientName}</p>
                                </Label>
                            </div>
                            <p className="text-lg font-semibold self-end sm:self-center">KES {bill.amount.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                ))}
                {selectedBills.length > 0 && (
                    <Card className="mt-6 shadow-lg sticky bottom-4">
                        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="text-lg font-bold">Total Selected:</p>
                                <p className="text-2xl font-extrabold text-primary">KES {totalSelectedAmount.toFixed(2)}</p>
                            </div>
                            <Button onClick={handlePayNow} size="lg" className="w-full sm:w-auto">
                                Pay Now
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
           ) : (
            <div className="text-center p-8 text-muted-foreground">
              <p>No pending bills.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
           {completedBills.length > 0 ? (
            <div className="space-y-4">
                {completedBills.map((bill) => (
                    <Card key={bill.billNo} className="shadow-md">
                        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="font-bold text-lg text-primary">{bill.billNo}</p>
                                <p className="text-sm text-muted-foreground">{bill.date}</p>
                                <p className="mt-2">{bill.patientName}</p>
                                <p className="text-sm">Paid Amount: <span className="font-semibold">KES {bill.amount.toFixed(2)}</span></p>
                            </div>
                            <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto mt-2 sm:mt-0">
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            ) : (
            <div className="text-center p-8 text-muted-foreground">
              <p>No completed bills found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
