
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const centers = [
  {
    name: 'Tenwek',
    address: '123 Health St, Wellness City, 10101',
    phone: '+1-202-555-0191',
    email: 'tenwek@medicare.example.com',
    lat: -1.0506,
    lng: 35.3117,
  },
  {
    name: 'Annex',
    address: '456 Cure Ave, Metropolis, 20202',
    phone: '+1-202-555-0143',
    email: 'annex@medicare.example.com',
    lat: -1.286389,
    lng: 36.817223,
  },
  {
    name: 'Ngito',
    address: '789 Life Rd, Suburbia, 30303',
    phone: '+1-202-555-0162',
    email: 'ngito@medicare.example.com',
    lat: -0.4244,
    lng: 36.9472,
  },
    {
    name: 'Kaboson',
    address: '101 Vitality Blvd, Lakeview, 40404',
    phone: '+1-202-555-0115',
    email: 'kaboson@medicare.example.com',
    lat: -0.2833,
    lng: 36.0667,
  },
];

export default function ContactUsPage() {
  const router = useRouter();
  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline text-primary">Contact Us</h1>
            <p className="text-muted-foreground">Find our hospital centers near you.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {centers.map((center) => (
          <Card key={center.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Building className="h-6 w-6 text-accent" />
                {center.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm flex-grow">
                <p>{center.address}</p>
                 <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{center.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{center.email}</span>
                </div>
            </CardContent>
             <div className="p-4 pt-0">
                <Button asChild className="w-full">
                    <Link href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`} target="_blank" rel="noopener noreferrer">
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Directions
                    </Link>
                </Button>
            </div>
          </Card>
        ))}
      </div>
       <div className="text-center">
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
}
