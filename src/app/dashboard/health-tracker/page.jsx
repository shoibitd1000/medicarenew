import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { ChevronRight, Thermometer, HeartPulse, Wind, Heart, Droplets, Weight, Percent, Ruler, Calendar, } from "lucide-react";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import { format } from "date-fns";
const vitals = [
  { name: "Temperature", value: "37", unit: "°C", icon: Thermometer, slug: "temperature",date:"02-Aug-2025"  },
  { name: "Pulse", value: "72", unit: "ppm", icon: HeartPulse, slug: "pulse",date:"02-Aug-2025"  },
  { name: "Respiration", value: "18", unit: "Rate/Min", icon: Wind, slug: "respiration",date:"02-Aug-2025"  },
  { name: "Blood Pressure", value: "120/80", unit: "mm/Hg", icon: Heart, slug: "blood-pressure",date:"02-Aug-2025"  },
  { name: "Blood Sugar", value: "5.5", unit: "mmol/L", icon: Droplets, slug: "blood-sugar",date:"02-Aug-2025"  },
  { name: "Weight", value: "70", unit: "kg", icon: Weight, slug: "weight",date:"02-Aug-2025"  },
  { name: "SPO2", value: "98", unit: "%", icon: Percent, slug: "spo2",date:"02-Aug-2025"  },
  { name: "Height", value: "175", unit: "cm", icon: Ruler, slug: "height",date:"02-Aug-2025"  },
];



export default function HealthTrackerPage() {
  const [selectedDate, setSelectedDate] = useState("");
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold font-headline text-primary">My Health Tracker</h1>
          <p className="text-muted-foreground">An overview of your key health metrics.</p>
        </div>
        <div className="max-w-4xl mx-auto">

          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={format(selectedDate instanceof Date ? selectedDate : new Date(), "yyyy-MM-dd")}
            handleDate={(e) => setSelectedDate(new Date(e.target.value))}
            placeHolderText="Select Date"
            icon={<Calendar className="absolute right-3 top-3 text-gray-500 pointer-events-none" />}
          />

        </div>
      </div>



      {/* Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {vitals.map((vital) => (
          <Link to={`/health-tracker/details`}>
            {/* <Link to={`/health-tracker-details/${vital.slug}`} key={vital.name}> */}
            <Card className="hover:bg-accent/50 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center justify-between h-full">
                <div className="flex-grow flex flex-col items-center justify-center">
                  <div className="p-3 bg-accent/20 rounded-full mb-2 inline-block">
                    <vital.icon className="h-8 w-8 mx-auto text-primary bg-white border rounded-lg shadow-md p-1 animate-blink" />

                  </div>
                  <p className="text-sm font-semibold">{vital.name}</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{vital.value}</p>
                  <p className="text-xs text-muted-foreground">{vital.unit}</p>
                  <p className="text-xs font-bold text-primary">{vital.date}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 self-end" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* BMI + BSA */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg my-3">
          <CardHeader>
            <CardTitle>BMI (Body Mass Index)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">22.9</p>
            <p className="text-muted-foreground">kg/m²</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg my-3">
          <CardHeader>
            <CardTitle>BSA (Body Surface Area)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">1.86</p>
            <p className="text-muted-foreground">m²</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
