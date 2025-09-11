
'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, IndianRupee } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';


const upcomingLabAppointments = [
  {
    test: "Complete Blood Count (CBC)",
    date: "2024-09-18",
    time: "09:00 AM",
    status: "Confirmed",
    center: "Tenwek",
  },
  {
    test: "Lipid Profile",
    date: "2024-09-21",
    time: "11:30 AM",
    status: "Pending",
    center: "Annex",
  },
];

const pastLabAppointments = [
  {
    test: "Thyroid Function Test",
    date: "2024-07-12",
    time: "10:00 AM",
    center: "Ngito",
    status: "Completed",
  },
  {
    test: "Urinalysis",
    date: "2024-06-25",
    time: "08:30 AM",
    center: "Tenwek",
    status: "Completed",
  },
];

const labTests = [
    { id: "cbc", label: "Complete Blood Count (CBC)", rate: 300 },
    { id: "lipid", label: "Lipid Profile", rate: 500 },
    { id: "thyroid", label: "Thyroid Function Test", rate: 450 },
    { id: "urinalysis", label: "Urinalysis", rate: 200 },
    { id: "blood_sugar", label: "Blood Sugar Test", rate: 150 },
];

const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM"
];

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    Confirmed: "default",
    Pending: "secondary",
    Completed: "outline",
    Cancelled: "destructive",
  };
  

export default function LabAppointmentsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const center = searchParams.get('center');
    const defaultTab = center ? "book" : "upcoming";

    const [selectedTests, setSelectedTests] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingStep, setBookingStep] = useState('selectTest');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const totalCost = useMemo(() => {
        return selectedTests.reduce((total, testId) => {
            const test = labTests.find(t => t.id === testId);
            return total + (test?.rate || 0);
        }, 0);
    }, [selectedTests]);

    const handleTestSelection = (testId: string) => {
        setSelectedTests(prev => 
            prev.includes(testId) 
            ? prev.filter(id => id !== testId)
            : [...prev, testId]
        );
        setBookingStep('selectDate');
    };

    const handleBook = () => {
        router.push(`/dashboard/lab-appointments/payment?amount=${totalCost}`);
    }

  
    const renderBookingContent = () => {
        if (showConfirmation) {
            const tests = labTests.filter(t => selectedTests.includes(t.id));
            return (
                <div className="p-8">
                    <h3 className="text-2xl font-bold font-headline text-primary mb-4 text-center">Confirm Lab Appointment</h3>
                    <Card className="max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle>Lab Test Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p><strong>Center:</strong> {decodeURIComponent(center!)}</p>
                            <div>
                                <strong>Tests:</strong>
                                <ul className='list-disc pl-5'>
                                    {tests.map(test => <li key={test.id}>{test.label}</li>)}
                                </ul>
                            </div>
                            <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {selectedSlot}</p>
                            <p className="font-bold text-lg"><strong>Total Cost:</strong> KES {totalCost}</p>
                        </CardContent>
                    </Card>
                    <div className="flex justify-center gap-4 mt-6">
                        <Button variant="outline" onClick={() => setShowConfirmation(false)}>Back</Button>
                        <Button onClick={handleBook}>Proceed to Payment</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6 p-4">
                {/* Step 1: Select Lab Test */}
                <div>
                    <Label className="text-lg font-semibold">1. Select Lab Test(s)</Label>
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            {labTests.map((test) => (
                                <div key={test.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id={test.id}
                                            checked={selectedTests.includes(test.id)}
                                            onCheckedChange={() => handleTestSelection(test.id)}
                                        />
                                        <Label htmlFor={test.id} className="text-base font-normal cursor-pointer">
                                            {test.label}
                                        </Label>
                                    </div>
                                    <div className="flex items-center font-semibold text-primary">
                                        <IndianRupee className="h-4 w-4 mr-1" />
                                        {test.rate}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>


                {/* Step 2: Select Date */}
                {bookingStep !== 'selectTest' && selectedTests.length > 0 && (
                     <div>
                        <Label className="text-lg font-semibold">2. Select a Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => { setSelectedDate(date); if(date) setBookingStep('selectSlot'); }}
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                {/* Step 3: Select Time Slot */}
                {bookingStep !== 'selectTest' && bookingStep !== 'selectDate' && selectedDate && (
                    <div>
                        <Label className="text-lg font-semibold">3. Select a Time Slot</Label>
                        <Select onValuechange={(value) => { setSelectedSlot(value); setBookingStep('confirm'); }} value={selectedSlot || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="-- Select a Time Slot --" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map(slot => (
                                    <SelectItem key={slot} value={slot}>
                                        {slot}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                
                 {bookingStep === 'confirm' && selectedSlot && (
                    <div className="flex justify-end items-center pt-4 gap-4">
                        <p className="text-lg font-bold">Total: KES {totalCost}</p>
                        <Button onClick={() => setShowConfirmation(true)} size="lg">Confirm Appointment</Button>
                    </div>
                 )}
            </div>
        );
    }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">
          Lab Appointments
        </h1>
        <p className="text-muted-foreground">
          Manage your upcoming and past lab tests.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="book">Book New Lab Test</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Lab Tests</TabsTrigger>
          <TabsTrigger value="past">Past Lab Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="book">
          <Card>
            <CardHeader>
              <CardTitle>Book a New Lab Test</CardTitle>
              <CardDescription>
                {center ? `Booking a test at ${decodeURIComponent(center)}. Change center for other locations.` : 'Please select a center to book a lab test.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {center ? (
                <>
                 <div className="flex justify-end mb-4">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/lab-appointments/book">Change Center</Link>
                    </Button>
                </div>
                {renderBookingContent()}
                </>
              ) : (
                <div className="text-center p-8">
                    <p className="mb-4 text-muted-foreground">You need to select a hospital center before you can book a lab test.</p>
                    <Button asChild>
                        <Link href="/dashboard/lab-appointments/book">Select a Center</Link>
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lab Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Doctor Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingLabAppointments.map((appt, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{appt.test}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(appt.date).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})} at {appt.time}
                      </TableCell>
                      <TableCell>{appt.center}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[appt.status]}>{appt.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Doctor remark</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Lab Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Result Status</TableHead>
                    <TableHead className="text-right">View Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastLabAppointments.map((appt, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{appt.test}</div>
                      </TableCell>
                      <TableCell>
                      {new Date(appt.date).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})} at {appt.time}
                      </TableCell>
                      <TableCell>{appt.center}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[appt.status]}>{appt.status}</Badge>
                      </TableCell>
                       <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Result</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
