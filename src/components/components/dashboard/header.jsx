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

import { DialogBox } from "../ui/dialog"; 
import SwitchProfileDialog from "./switch-profile-dialog";
import NotificationsPanel from "./notifications-panel";

export default function DashboardHeader({ currentUser, allUsers, onSwitchProfile }) {
  const [currentDate, setCurrentDate] = useState("");
  const [isSwitchProfileOpen, setIsSwitchProfileOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    // Clear session logic here
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 bg-background backdrop-blur-sm border-b p-2 sm:p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side Profile Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/dashboard/profile">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>{currentUser.initials}</AvatarFallback>
            </Avatar>
          </Link>
          <Link to="/dashboard/profile">
            <>
              <h2 className="text-base sm:text-xl lg:text-lg font-bold text-primary font-headline italic uppercase">
                {currentUser.name}
              </h2>
              <p className="font-bold text-sm sm:text-base text-primary">
                ID: {currentUser.id}
              </p>
              <p className="text-xs text-muted-foreground hidden md:block font-semibold">
                {currentDate}
              </p>
            </>
          </Link>
        </div>

        {/* Center Logo */}
        <div className="hidden md:flex items-center gap-2">
          <h2 className="text-xl font-bold text-primary font-headline">Tenwek</h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-1">
          {/* Home Button */}
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 hover:bg-accent/90">
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
                className="relative rounded-full h-10 w-10 bell-btn"
              >
                <Bell />
                <span className="absolute top-1 right-1 h-3 w-3 flex">
                  <span className="absolute bg-white h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="sr-only">View Notifications</span>
              </Button>
            </SheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 hover:bg-accent/90"
            >
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
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

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/my-document">
                  <FileText className="mr-2" />
                  My Document
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Logout Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-destructive hover:bg-destructive/90"
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
