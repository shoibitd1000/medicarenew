import { useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import { allUsers } from "@/lib/users";

export default function DashboardLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(
    allUsers.length > 0 ? allUsers[0] : null
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {currentUser && (
        <DashboardHeader
          currentUser={currentUser}
          allUsers={allUsers}
          onSwitchProfile={setCurrentUser}
        />
      )}

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
