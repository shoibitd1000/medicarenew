import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/components/ui/avatar";
import { Button } from "../../../components/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/components/ui/card";
import { Input } from "../../../components/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";
import { Camera, ArrowLeft, KeyRound, Calendar, Mail, Key } from "lucide-react";
import { useNavigate, useNavigation } from "react-router-dom";
import {
  DialogBox,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "../../../components/components/ui/dialog";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import CustomInput from "../../../components/components/ui/CustomInput";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomSelect from "../../../components/components/ui/CustomSelect";

export default function ProfilePage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isOpen, setIsopen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="py-3">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-primary/50">
                <AvatarImage
                  src="https://placehold.co/128x128.png"
                  alt="Patient Name"
                  data-ai-hint="profile picture"
                />
                <AvatarFallback>PN</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
              >
                <Camera className="h-5 w-5" />
                <span className="sr-only">Change profile photo</span>
              </Button>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <CustomInput
                id="name"
                type="text"
                placeholder="Enter Your Name"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                required={"required"}
              />
            </div>
            <div className="space-y-2">
              <CustomDatePicker
                repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                value={selectedDate}
                placeHolderText={"From Date"}
                handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
              />
            </div>
            <div className="space-y-2">
              <CustomSelect
                placeholder="Select a Gender"
                options={[{ label: "Male", Value: "male" }, { label: "Female", value: "female" }]}
                value={
                  selectedGender
                    ? { value: selectedGender, label: selectedGender }
                    : null
                }
                onChange={(selectedOption) => setSelectedGender(selectedOption.value)}
              />
            </div>
            <div className="space-y-2">
              {/* <label htmlFor="mobile">Mobile Number</label>
              <Input id="mobile" type="tel" defaultValue="+1234567890" /> */}

              <CustomInput
                id="name"
                type="tel"
                placeholder="Enter Mobile Number"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                required={"required"}
                defaultValue="+1234567890"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <CustomInput
                id="namailme"
                type="email"
                placeholder="Enter mail Id"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                required={"required"}
                icon={<Mail className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
              />
            </div>
            <div className="space-y-2 md:col-span-2">

              <div className="">
                <label>Address</label>
                <CustomTextArea
                  repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={"23 Health St, Wellness City, 10101"}
                  placeHolderText={"address."}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-between">
              <Button
                className="pointer md:w-auto bg-slate-200 text-primary hover:bg-accent/90"
                onClick={() => setIsopen(true)}
                type="button"
              >
                <Key className="text-primary h-5 w-5" />
                Change Password
              </Button>
              <Button
                type="submit"
                className="pointer md:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
        <DialogBox
          open={isOpen}
          onOpenChange={setIsopen}
          size="xl"
          footer={
            <>
              <button
                className="px-3 py-1 text-sm font-medium bg-red-100  rounded hover:bg-blue-500 transition"
                onClick={() => setIsopen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                onClick={() => setIsopen(false)}
              >
                Update Password 
              </button>
            </>

          }
        >
          <div className="my-3">
            <div className="text-center">
              <Key className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
              <h1 className="text-3xl font-bold text-blue-600 mt-2">Change Password</h1>
              <p className="text-gray-500">Enter your Old and New Password to update it.</p>
            </div>

            <div className="my-5">
              <CustomInput
                id="namailme"
                type="text"
                placeholder="Enter Your Old Password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                required={"required"}
                icon={<Mail className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
              />
            </div>
            <div className="my-5">
              <CustomInput
                id="newpass"
                type="text"
                placeholder="Enter Your New Password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                required={"required"}
                icon={<Mail className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
              />
            </div>
            <div className="my-5">
              <CustomInput
                id="cpass"
                type="text"
                placeholder="Confirm New Password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                required={"required"}
                icon={<Mail className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
              />
            </div>
          </div>
        </DialogBox>
      </Card>
    </div>
  );
}
