
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data - in a real app, this would come from an API
const vitalHistory = {
    temperature: [
        { date: '2024-07-15', time: '09:00 AM', value: '37.0 °C' },
        { date: '2024-07-16', time: '09:05 AM', value: '36.8 °C' },
        { date: '2024-07-17', time: '09:00 AM', value: '37.1 °C' },
        { date: '2024-07-18', time: '09:00 AM', value: '37.2 °C' },
        { date: '2024-07-19', time: '09:05 AM', value: '36.9 °C' },
        { date: '2024-07-20', time: '09:00 AM', value: '37.0 °C' },
        { date: '2024-07-21', time: '09:00 AM', value: '37.3 °C' },
        { date: '2024-07-22', time: '09:05 AM', value: '37.1 °C' },
        { date: '2024-07-23', time: '09:00 AM', value: '36.9 °C' },
        { date: '2024-07-24', time: '09:00 AM', value: '37.0 °C' },
        { date: '2024-07-25', time: '09:00 AM', value: '37.1 °C' },
        { date: '2024-07-26', time: '09:05 AM', value: '36.9 °C' },
        { date: '2024-07-27', time: '09:00 AM', value: '37.2 °C' },
        { date: '2024-07-28', time: '09:00 AM', value: '37.0 °C' },
        { date: '2024-07-29', time: '09:05 AM', value: '36.8 °C' },
        { date: '2024-07-30', time: '09:00 AM', value: '37.1 °C' },
    ],
    pulse: [
        { date: '2024-07-15', time: '09:00 AM', value: '70 bpm' },
        { date: '2024-07-16', time: '09:05 AM', value: '72 bpm' },
        { date: '2024-07-17', time: '09:00 AM', value: '68 bpm' },
        { date: '2024-07-18', time: '09:00 AM', value: '71 bpm' },
        { date: '2024-07-19', time: '09:05 AM', value: '75 bpm' },
        { date: '2024-07-20', time: '09:00 AM', value: '73 bpm' },
        { date: '2024-07-21', time: '09:00 AM', value: '69 bpm' },
        { date: '2024-07-22', time: '09:05 AM', value: '70 bpm' },
        { date: '2024-07-23', time: '09:00 AM', value: '74 bpm' },
        { date: '2024-07-24', time: '09:00 AM', value: '72 bpm' },
        { date: '2024-07-25', time: '09:00 AM', value: '70 bpm' },
        { date: '2024-07-26', time: '09:05 AM', value: '75 bpm' },
        { date: '2024-07-27', time: '09:00 AM', value: '72 bpm' },
        { date: '2024-07-28', time: '09:00 AM', value: '68 bpm' },
        { date: '2024-07-29', time: '09:05 AM', value: '74 bpm' },
        { date: '2024-07-30', time: '09:00 AM', value: '72 bpm' },
    ],
    'blood-pressure': [
        { date: '2024-07-15', time: '09:00 AM', value: '120/80 mm/Hg' },
        { date: '2024-07-16', time: '09:05 AM', value: '121/79 mm/Hg' },
        { date: '2024-07-17', time: '09:00 AM', value: '119/80 mm/Hg' },
        { date: '2024-07-18', time: '09:00 AM', value: '122/81 mm/Hg' },
        { date: '2024-07-19', time: '09:05 AM', value: '118/78 mm/Hg' },
        { date: '2024-07-20', time: '09:00 AM', value: '120/80 mm/Hg' },
        { date: '2024-07-21', time: '09:00 AM', value: '123/82 mm/Hg' },
        { date: '2024-07-22', time: '09:05 AM', value: '121/80 mm/Hg' },
        { date: '2024-07-23', time: '09:00 AM', value: '119/79 mm/Hg' },
        { date: '2024-07-24', time: '09:00 AM', value: '120/81 mm/Hg' },
        { date: '2024-07-25', time: '09:00 AM', value: '120/80 mm/Hg' },
        { date: '2024-07-26', time: '09:05 AM', value: '122/81 mm/Hg' },
        { date: '2024-07-27', time: '09:00 AM', value: '118/79 mm/Hg' },
        { date: '2024-07-28', time: '09:00 AM', value: '121/80 mm/Hg' },
        { date: '2024-07-29', time: '09:05 AM', value: '123/82 mm/Hg' },
        { date: '2024-07-30', time: '09:00 AM', value: '120/80 mm/Hg' },
    ],
    // Add more history for other vitals
};

const vitalsMetadata = {
    temperature: { name: 'Temperature', unit: '°C' },
    pulse: { name: 'Pulse', unit: 'ppm' },
    respiration: { name: 'Respiration', unit: 'Rate/Min' },
    'blood-pressure': { name: 'Blood Pressure', unit: 'mm/Hg' },
    'blood-sugar': { name: 'Blood Sugar', unit: 'mmol/L' },
    weight: { name: 'Weight', unit: 'kg' },
    spo2: { name: 'SPO2', unit: '%' },
    height: { name: 'Height', unit: 'cm' },
};

export default function VitalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const vitalSlug = params.vital as string;
    const vitalInfo = vitalsMetadata[vitalSlug as keyof typeof vitalsMetadata] || { name: 'Vital', unit: '' };
    
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);
    const [captureDate, setCaptureDate] = useState<Date | undefined>(undefined);
    const [history, setHistory] = useState(vitalHistory[vitalSlug as keyof typeof vitalHistory] || []);
    const [vitalValue, setVitalValue] = useState('');

    useEffect(() => {
        setCaptureDate(new Date());
        const to = new Date();
        const from = subDays(to, 6);
        setFromDate(from);
        setToDate(to);
    }, []);

    const setDateRange = (days: number) => {
        const to = new Date();
        const from = subDays(to, days - 1);
        setFromDate(from);
        setToDate(to);
    };

    const handleSaveVital = () => {
        // In a real app, you would save this to a database
        console.log(`Saving ${vitalInfo.name}: ${vitalValue} ${vitalInfo.unit} for date ${captureDate}`);
        alert(`${vitalInfo.name} saved successfully!`);
        setVitalValue('');
    };

    const filteredHistory = useMemo(() => {
        if (!fromDate || !toDate) return history;
        return history.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= fromDate && entryDate <= toDate;
        });
    }, [history, fromDate, toDate]);

    const chartData = useMemo(() => {
        return filteredHistory.map(entry => {
            const dataPoint: {date: string, value?: number, systolic?: number, diastolic?: number} = {
                date: format(new Date(entry.date), 'MMM d'),
            };

            if (vitalSlug === 'blood-pressure') {
                const [systolic, diastolic] = entry.value.split(' ')[0].split('/').map(Number);
                dataPoint.systolic = systolic;
                dataPoint.diastolic = diastolic;
            } else {
                dataPoint.value = parseFloat(entry.value);
            }
            return dataPoint;
        }).reverse();
    }, [filteredHistory, vitalSlug]);

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                <div className="text-center text-muted-foreground p-8">
                    No data available for the selected range to display a chart.
                </div>
            );
        }
    
        if (vitalSlug === 'blood-pressure') {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" name="Systolic" />
                        <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--accent))" name="Diastolic" />
                    </LineChart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" name={vitalInfo.name} />
                    </LineChart>
                </ResponsiveContainer>
            );
        }
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline text-primary">{vitalInfo.name}</h1>
                <p className="text-muted-foreground">Capture and view your {vitalInfo.name.toLowerCase()} history.</p>
            </div>

            <Tabs defaultValue="capture">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="capture">Capture Vital</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="capture">
                    <Card>
                        <CardHeader>
                            <CardTitle>Capture New {vitalInfo.name} Reading</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !captureDate && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {captureDate ? format(captureDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={captureDate} onSelect={setCaptureDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vital-value">Enter {vitalInfo.name} ({vitalInfo.unit})</Label>
                                <Input 
                                    id="vital-value" 
                                    type="text" 
                                    value={vitalValue}
                                    onChange={(e) => setVitalValue(e.target.value)}
                                    placeholder={`e.g., ${vitalInfo.name === 'Blood Pressure' ? '120/80' : '70'}`} 
                                />
                            </div>
                            <Button onClick={handleSaveVital} className="w-full">Save Reading</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>{vitalInfo.name} History</CardTitle>
                            <CardDescription>View your past readings. Use the date picker to filter results.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setDateRange(2)}>2 Days</Button>
                                    <Button variant="outline" size="sm" onClick={() => setDateRange(7)}>7 Days</Button>
                                    <Button variant="outline" size="sm" onClick={() => setDateRange(15)}>15 Days</Button>
                                    <Button variant="outline" size="sm" onClick={() => setDateRange(30)}>30 Days</Button>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {fromDate ? format(fromDate, "LLL dd, y") : <span>From date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={fromDate}
                                                onSelect={setFromDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {toDate ? format(toDate, "LLL dd, y") : <span>To date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={toDate}
                                                onSelect={setToDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trend Graph</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderChart()}
                                </CardContent>
                            </Card>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead className="text-right">Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHistory.map((entry, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{entry.date}</TableCell>
                                                <TableCell>{entry.time}</TableCell>
                                                <TableCell className="text-right font-medium">{entry.value}</TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredHistory.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                    No history found for the selected date range.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="text-center">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>
        </div>
    );
}
