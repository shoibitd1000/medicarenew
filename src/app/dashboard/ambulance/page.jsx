
import React from "react"
import { useState } from 'react';
import { Button } from '../../../components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/components/ui/card';
import { Label } from '../../../components/components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/components/ui/radio-group';
import { PhoneCall, MapPin, LocateFixed, Clock, User, AlertTriangle, LifeBuoy, Calendar } from 'lucide-react';
import CustomInput from "../../../components/components/ui/CustomInput";
import CustomSelect from "../../../components/components/ui/CustomSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/components/ui/tabs";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomTimePicker from "../../../components/components/ui/CustomTimePicker";

const ambulanceTypes = [
    { id: 'bls', name: 'Basic Life Support (BLS)' },
    { id: 'als', name: 'Advanced Life Support (ALS)' },
    { id: 'icu', name: 'ICU Ambulance' },
    { id: 'mortuary', name: 'Mortuary Van' },
];

const ambulanceCharges = [
    { id: "221", ambType: 'Landcruiser', baseFare: 'KBP 490k/KM basis', perKm: 'KES 50.00000' },
    { id: "222", ambType: 'Landcruiser', baseFare: 'KBP 490k/KM basis', perKm: 'KES 50.00000' },
    { id: "223", ambType: 'Noah', baseFare: 'KBP 490k/KM basis', perKm: 'KES 50.00000' },
    { id: "224", ambType: 'Probox', baseFare: 'KBP 490k/KM basis', perKm: 'KES 50.00000' },
    { id: "225", ambType: 'Landcruiser', baseFare: 'KBP 490k/KM basis', perKm: 'KES 50.00000' },
    { id: "226", ambType: 'Canter', baseFare: 'KBP 490k/KM basis', perKm: 'KES 50.00000' },
];



export default function AmbulancePage() {
    // const router = useRouteError();
    const [requestType, setRequestType] = useState('now');
    const [selectAmbulance, setSelectAmbulance] = useState([]);
    const [selectedDate, setSelectedDate] = useState();

    const handleRequestSubmit = (e) => {
        e.preventDefault();

    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Tabs defaultValue="request" className="w-full">
                <TabsList className="w-full ">
                    <div className="flex w-full justify-between mt-4">
                        <TabsTrigger value="request">Request Ambulance</TabsTrigger>
                        <TabsTrigger value="history">Booking History</TabsTrigger>
                        <TabsTrigger value="charges">Ambulance Charges</TabsTrigger>
                    </div>
                </TabsList>

                <TabsContent value="request">

                    <div className="text-center">
                        <p className="text-sm  text-green-600 font-extrabold">Request, track, and manage your emergency transport.</p>
                    </div>

                    <Card className="p-4 my-3 text-center bg-slate-200">
                        <div className="flex-grow">
                            <p className="font-bold text-sm ">In case of a critical emergency, please call us directly at +254-728-091-900</p>

                        </div>
                        <Button size="lg" asChild className="w-full md:w-auto mt-3 md:mt-2 ">
                            <a href="tel:254-728-091-900" className="">
                                <PhoneCall className="mr-2 h-5 w-5" /> Call Emergency Helpline
                            </a>
                        </Button>
                        <p className="text-xs text-destructive/80">Our team is available 24/7 to assist you immediately.</p>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>New Ambulance Request</CardTitle>
                            <CardDescription>Fill out the form below to request an ambulance. All fields are required.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRequestSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="relative flex-grow">
                                        <CustomInput
                                            id="userId"
                                            type="text"
                                            placeholder="Pickup Location"
                                            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                                            leftIcon={<MapPin className="h-5 w-5" />}
                                            required={"required"}
                                        />
                                        <Button type="button" variant="outline" className="w-full sm:w-auto absolute right-3 top-1/2 -translate-y-1/2 h-8 w-5 ">
                                            <LocateFixed className="mr-2 h-4 w-4" /> Use GPS
                                        </Button>
                                    </div>
                                </div>

                                <CustomSelect
                                    placeholder="Select ambulance type"
                                    options={ambulanceTypes.map((type) => ({
                                        value: type.id,
                                        label: type.name || type.id,
                                    }))}
                                    value={
                                        ambulanceTypes
                                            .map((type) => ({
                                                value: type.id,
                                                label: type.name || type.id,
                                            }))
                                            .find((d) => d.value === selectAmbulance) || null
                                    }
                                    onChange={(selectedOption) => setSelectAmbulance(selectedOption.value)}
                                />


                                <div className="space-y-2">
                                    <Label htmlFor="condition" className="text-base">Patient's Condition (Briefly)</Label>
                                    <CustomTextArea
                                        repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                        value={""}
                                        placeHolderText={"e.g., Cheast Pain, Accident, Difficulty breathing..."}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base">Schedule Request</Label>
                                    <RadioGroup defaultValue="now" value={requestType} onValueChange={setRequestType}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="now" id="now" />
                                            <Label htmlFor="now">Request Immediately</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="later" id="later" />
                                            <Label htmlFor="later">Schedule for Later</Label>
                                        </div>
                                    </RadioGroup>
                                    {requestType === 'later' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 sm:pl-6 pt-2">
                                            <CustomDatePicker
                                                repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                                value={selectedDate}
                                                placeHolderText={"Select Date"}
                                                handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                                icon={<Calendar className="absolute right-3 top-3 text-gray-500 pointer-events-none" />}
                                            />
                                            <CustomTimePicker
                                                repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                                value={selectedDate}
                                                placeHolderText={"Select Time"}
                                                handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                            />
                                        </div>
                                    )}
                                </div>
                                <CustomInput
                                    id="userId"
                                    type="number"
                                    placeholder="Contact Number"
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                                    leftIcon={<PhoneCall className="h-5 w-5" />}
                                    required={"required"}
                                />

                                <div className="flex justify-center">
                                    <Button type="submit" size="lg" className="">
                                        Submit Request
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    <Card>
                        <div className="py-2  px-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg text-primary font-extrabold py-1"> HI </h2>
                                <span className="text-xs font-semibold py-1">Pending</span>
                            </div>
                            <div><span className="text-xs text-gray font-bold">KM</span></div>
                        </div>
                    </Card>
                </TabsContent>
                <TabsContent value="charges">
                    <div className="grid lg:grid-cols-2 gap-3">
                        {ambulanceCharges?.map(item => <Card key={item?.id} className="">
                            <div className="py-2  px-4">
                                <h2 className="text-lg text-primary font-extrabold py-1 uppercase"> {item?.ambType} </h2>
                                <span className="text-xs font-semibold py-1">{item?.baseFare}</span>
                                <div><span className="text-xs text-gray font-bold">{item?.perKm}</span></div>
                            </div>
                        </Card>)}
                    </div>


                </TabsContent>
            </Tabs>
        </div>
    );
}
