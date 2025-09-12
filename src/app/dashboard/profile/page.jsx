import React from "react";
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
import { Label } from "../../../components/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";
import { Camera, ArrowLeft, KeyRound } from "lucide-react";
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

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto space-y-6" style={{ padding: "21px" }}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Change My Profile
          </CardTitle>
        </CardHeader>
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
              <Input id="dob" type="date" defaultValue="1985-07-22" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select defaultValue="male">
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" type="tel" defaultValue="+1234567890" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
              />
            </div>
            <div className="space-y-2 md:col-span-2">

              <div className="my-3">
                <Label>Address</Label>
                <CustomTextArea
                  repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={"23 Health St, Wellness City, 10101"}
                  placeHolderText={"address."}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <DialogBox>
            <DialogTrigger asChild>
              <Button variant="outline">
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="bell-btn">Change Password</DialogTitle>
                <DialogDescription>
                  Enter your old and new password to update it.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="old-password">Old Password</Label>
                  <Input id="old-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" required />
                </div>
              </form>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Update Password</Button>
              </DialogFooter>
            </DialogContent>
          </DialogBox>
        </CardFooter>
      </Card>
      <div className="text-center">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
}
