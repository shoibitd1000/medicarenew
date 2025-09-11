import React from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User, CheckCircle } from "lucide-react";

export default function SwitchProfileDialog({
  allUsers,
  currentUser,
  onSwitchProfile,
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Switch Profile</DialogTitle>
        <DialogDescription>
          Select a dependent to view their profile.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {allUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              currentUser.id === user.id ? "bg-accent/50" : "hover:bg-muted"
            }`}
          >
            {/* Left side (avatar + details) */}
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.name}
                  data-ai-hint="profile picture"
                />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.relation}</p>
              </div>
            </div>

            {/* Right side (button) */}
            {currentUser.id === user.id ? (
              <Button disabled className="text-primary">
                <CheckCircle className="mr-2 h-4 w-4" />
                Selected
              </Button>
            ) : (
              <Button onClick={() => onSwitchProfile(user)}>
                <User className="mr-2 h-4 w-4" />
                Select
              </Button>
            )}
          </div>
        ))}
      </div>
    </DialogContent>
  );
}
