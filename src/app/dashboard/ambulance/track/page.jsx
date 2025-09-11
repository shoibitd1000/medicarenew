

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/components/ui/card';
import { Button } from '../../../../components/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/components/ui/avatar';
import { Phone, Ambulance, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const mockBookingDetails = {
    id: 'AMB124',
    ambulanceNumber: 'KA-01-EM-1234',
    driver: {
        name: 'James Kamau',
        avatarUrl: 'https://placehold.co/96x96.png',
        initials: 'JK',
        phone: '+254 712 345 678',
    },
    eta: 15, // minutes
    status: 'En route to pickup location',
};


export default function TrackAmbulancePage() {
    const params = useParams();
    const router = useNavigate();
    const bookingId = params.id;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline text-primary">Live Ambulance Tracking</h1>
                <p className="text-muted-foreground">Booking ID: {bookingId}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Map Section */}
                <Card className="md:col-span-2 shadow-lg">
                    <CardContent className="p-0 h-96 md:h-full">
                        {/* Placeholder for a map component */}
                        <div className="bg-muted h-full flex items-center justify-center rounded-lg">
                            <div className="text-center text-muted-foreground">
                                <MapPin className="h-16 w-16 mx-auto" />
                                <p className="mt-2 font-semibold">Map View Will Be Displayed Here</p>
                                <p className="text-sm">Real-time location of the ambulance will appear on this map.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Estimated Arrival</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="flex items-baseline justify-center gap-2">
                                <p className="text-5xl font-bold text-primary">{mockBookingDetails.eta}</p>
                                <p className="text-xl text-muted-foreground">minutes</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{mockBookingDetails.status}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Driver & Vehicle</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={mockBookingDetails.driver.avatarUrl} alt={mockBookingDetails.driver.name} data-ai-hint="driver profile" />
                                    <AvatarFallback>{mockBookingDetails.driver.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{mockBookingDetails.driver.name}</p>
                                    <p className="text-sm text-muted-foreground">Your Driver</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-bold flex items-center gap-2"><Ambulance className="h-5 w-5 text-primary" /> {mockBookingDetails.ambulanceNumber}</p>
                                <p className="text-sm text-muted-foreground">Ambulance Number</p>
                            </div>
                            <Button asChild className="w-full">
                                <a href={`tel:${mockBookingDetails.driver.phone}`}>
                                    <Phone className="mr-2 h-4 w-4" /> Call Driver
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="text-center">
                <Button variant="outline" onClick={() => router()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>
        </div>
    );
}

// A simple separator component
function Separator() {
    return <hr className="border-t border-muted" />;
}
