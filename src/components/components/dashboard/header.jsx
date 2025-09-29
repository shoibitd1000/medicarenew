import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  LogOut,
  Users,
  ChevronDown,
  UserCog,
  FileText,
  Home,
  Phone,
} from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { DialogBox } from "../ui/dialog";
import SwitchProfileDialog from "./switch-profile-dialog";
import NotificationsPanel, { sampleNotifications } from "./notifications-panel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useContext } from "react";
import { AuthContext } from "./../../../app/authtication/Authticate";

export default function DashboardHeader({ currentUser, allUsers, onSwitchProfile }) {
  const { logout, clearAuth } = useContext(AuthContext);
  const [base64Image, setBase64Image] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isSwitchProfileOpen, setIsSwitchProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Set current date
  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  // Set Base64 image when currentUser changes
  useEffect(() => {
    setBase64Image(
      currentUser?.ProfileImage
        ? `data:image/jpeg;base64,${currentUser.ProfileImage}`
        : "https://placehold.co/128x128.png"
    );
  }, [currentUser?.ProfileImage]); // Only re-run when currentUser.ProfileImage changes



  return (
    <header className="sticky top-0 z-10 bg-background backdrop-blur-sm border-b p-2 sm:p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side Profile Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary">
              <AvatarImage src={base64Image} alt={currentUser?.FirstName || "User"} />
              <AvatarFallback>{currentUser?.initials || "U"}</AvatarFallback>
            </Avatar>
          </Link>
          <Link to="/dashboard/profile">
            <div>
              <h2 className="text-base sm:text-xl lg:text-lg font-bold text-primary font-headline italic uppercase">
                {currentUser?.FirstName || ""}  {currentUser?.LastName || ""}
              </h2>
              <p className="font-bold text-sm sm:text-base text-primary">
                ID: {currentUser?.PatientASID || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground hidden md:block font-semibold">
                {currentDate}
              </p>
            </div>
          </Link>
        </div>

        {/* Center Logo */}
        <div className="hidden md:flex items-center gap-2">
          <h2 className="text-xl font-bold text-primary font-headline">Healthcare – Patient Portal</h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-1">
          {/* Home Button */}
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <Home className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>

          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 hover:shadow-lg transition-all duration-300 ease-in-out"
                aria-label="View notifications"
                title="View notifications"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 sm:h-4 sm:w-4">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 text-white flex justify-center items-center">{sampleNotifications?.length}</span>
                </span>
                <span className="sr-only">View Notifications</span>
              </Button>
            </SheetTrigger>
            <Link
              to="/contact-us"
              className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 hover:shadow-lg transition-all duration-300 ease-in-out"
              aria-label="Contact Us"
            >
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
            <SheetContent className="w-full max-w-sm sm:max-w-md p-0">
              <NotificationsPanel />
            </SheetContent>
          </Sheet>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-1 px-2 sm:px-3 bell-btn">
                <User />
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white w-48">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile">
                  <UserCog className="mr-2" />
                  My Profile
                </Link>
              </DropdownMenuItem>

              {/* Switch Profile using our DialogBox */}
              <DropdownMenuItem
                onClick={() => setIsSwitchProfileOpen(true)}
                className="cursor-pointer"
              >
                <Users className="mr-2" />
                Switch Profile
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/my-document">
                  <FileText className="mr-2" />
                  My Document
                </Link>
              </DropdownMenuItem>

              {/* Logout Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                    <LogOut className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be returned to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Switch Profile Dialog */}
          <DialogBox
            open={isSwitchProfileOpen}
            onOpenChange={setIsSwitchProfileOpen}
            title="Switch Profile"
            description="Select another user profile to switch."
            size="md"
          >
            <SwitchProfileDialog
              allUsers={allUsers}
              currentUser={currentUser}
              onSwitchProfile={(user) => {
                onSwitchProfile(user);
                setIsSwitchProfileOpen(false);
              }}
            />
          </DialogBox>
        </div>
      </div>
    </header>
  );
}