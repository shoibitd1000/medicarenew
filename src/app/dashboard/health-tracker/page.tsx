
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Thermometer, HeartPulse, Wind, Heart, Droplets, Weight, Percent, Ruler, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


const vitals = [
    { name: 'Temperature', value: '37', unit: '°C', icon: Thermometer, slug: 'temperature' },
    { name: 'Pulse', value: '72', unit: 'ppm', icon: HeartPulse, slug: 'pulse' },
    { name: 'Respiration', value: '18', unit: 'Rate/Min', icon: Wind, slug: 'respiration' },
    { name: 'Blood Pressure', value: '120/80', unit: 'mm/Hg', icon: Heart, slug: 'blood-pressure' },
    { name: 'Blood Sugar', value: '5.5', unit: 'mmol/L', icon: Droplets, slug: 'blood-sugar' },
    { name: 'Weight', value: '70', unit: 'kg', icon: Weight, slug: 'weight' },
    { name: 'SPO2', value: '98', unit: '%', icon: Percent, slug: 'spo2' },
    { name: 'Height', value: '175', unit: 'cm', icon: Ruler, slug: 'height' },
];

const weightData = [
    { month: 'Jan', weight: 72 },
    { month: 'Feb', weight: 71 },
    { month: 'Mar', weight: 71.5 },
    { month: 'Apr', weight: 70 },
    { month: 'May', weight: 70.5 },
    { month: 'Jun', weight: 70 },
  ];
  
const bpData = [
    { month: 'Jan', systolic: 120, diastolic: 80 },
    { month: 'Feb', systolic: 122, diastolic: 81 },
    { month: 'Mar', systolic: 118, diastolic: 79 },
    { month: 'Apr', systolic: 121, diastolic: 80 },
    { month: 'May', systolic: 123, diastolic: 82 },
    { month: 'Jun', systolic: 120, diastolic: 80 },
];

export default function HealthTrackerPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Set date only on client to avoid hydration mismatch
    setDate(new Date());
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold font-headline text-primary">My Health Tracker</h1>
            <p className="text-muted-foreground">An overview of your key health metrics.</p>
        </div>
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-full sm:w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>BMI (Body Mass Index)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">22.9</p>
            <p className="text-muted-foreground">kg/m²</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>BSA (Body Surface Area)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">1.86</p>
            <p className="text-muted-foreground">m²</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {vitals.map((vital) => (
          <Link href={`/dashboard/health-tracker/${vital.slug}`} key={vital.name}>
            <Card className="hover:bg-accent/50 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center justify-between h-full">
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="p-3 bg-accent/20 rounded-full mb-2 inline-block">
                        <vital.icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <p className="text-sm font-semibold">{vital.name}</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{vital.value}</p>
                    <p className="text-xs text-muted-foreground">{vital.unit}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 self-end" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

        <div className="space-y-8 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Weight Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weightData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Blood Pressure Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bpData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" name="Systolic" />
                        <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--accent))" name="Diastolic" />
                    </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
