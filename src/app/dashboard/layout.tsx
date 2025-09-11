
'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/header';
import { allUsers } from '@/lib/users';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState(allUsers[0]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader currentUser={currentUser} allUsers={allUsers} onSwitchProfile={setCurrentUser} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
