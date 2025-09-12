import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./app/dashboard/page";
import { allUsers } from "./lib/users";
// import CreateMpinPage from "./app/create-mpin/page";
import ProfilePage from "./app/dashboard/profile/page";
import ReminderPage from "./app/dashboard/reminder/page";
import BookAppointment from "./app/dashboard/bookAppointment/page";
import DoctorAppointment from "./app/dashboard/bookAppointment/doctorAppointment/page";
import LoginPage from "./app/page";
import ClinicalRecordPage from "./app/dashboard/clinical-record/page";
import DashboardHeader from "./components/components/dashboard/header";
import MyDocumentsPage from "./app/dashboard/my-document/page";
import Teleconsultation from "./app/dashboard/teleconsultation/page";
import TeleconsultationAppointment from "./app/dashboard/teleconsultation/teleconsultationAppointment/page";
import Investigations from "./app/dashboard/investigations/page";
import InvestigationsAppoin from "./app/dashboard/investigations/investigation/page";
import PackageInformations from "./app/dashboard/packages/page";
import PackageDetail from "./app/dashboard/packages/packageDetails/Page";
import AmbulancePage from "./app/dashboard/ambulance/page";
import LabReportsPage from "./app/dashboard/clinical-record/lab-reports/page";
import RadiologyReportsPage from "./app/dashboard/clinical-record/radiology-reports/page";
import TokenPage from "./app/dashboard/token/page";
import GenerateTokenPage from "./app/dashboard/token/generate/page";
import TokenVerification from "./app/dashboard/token/generate/tokenVerification/page";
import ConsultationHistoryPage from "./app/dashboard/clinical-record/consultations/page";
import MedicinesPage from "./app/dashboard/clinical-record/medicines/page";

export function App() {
  const [currentUser, setCurrentUser] = useState(allUsers[0]);
//
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <DashboardHeader
          currentUser={currentUser}
          allUsers={allUsers}
          onSwitchProfile={setCurrentUser}
        />
        <main className="">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* <Route path="/create-mpin" element={<CreateMpinPage />} /> */}
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/reminder" element={<ReminderPage />} />
            <Route
              path="/appointments/book"
              element={<BookAppointment />}
            />
            <Route
              path="/doctor-appointment"
              element={<DoctorAppointment />}
            />
            <Route
              path="/teleconsultation/book"
              element={<Teleconsultation />}
            />
            <Route
              path="/teleconsultation-appointment"
              element={<TeleconsultationAppointment />}
            />
            <Route
              path="/investigations/book"
              element={<Investigations />}
            />
            <Route
              path="/investigations"
              element={<InvestigationsAppoin />}
            />
            <Route
              path="/packages"
              element={<PackageInformations />}
            />
            <Route
              path="/packages/packages-details"
              element={<PackageDetail />}
            />
            <Route
              path="/ambulance"
              element={<AmbulancePage />}
            />
            <Route
              path="/my-document"
              element={<MyDocumentsPage />}
            />
            <Route path="/token" element={<TokenPage />} />
            <Route
              path="/token/generate"
              element={<GenerateTokenPage />}
            />
            <Route
              path="/token/verification"
              element={<TokenVerification />}
            />
            <Route
              path="/clinical-record"
              element={<ClinicalRecordPage />}
            />
            <Route
              path="/clinical-record/consultations"
              element={<ConsultationHistoryPage />}
            />
            <Route
              path="/clinical-record/lab-reports"
              element={<LabReportsPage />}
            />
            <Route
              path="/clinical-record/radiology-reports"
              element={<RadiologyReportsPage />}
            />  
            <Route
              path="/clinical-record/medicines"
              element={<MedicinesPage />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
