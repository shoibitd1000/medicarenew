import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./app/authtication/Authticate";

import DashboardPage from "./app/dashboard/page";
import { allUsers } from "./lib/users";
import ProfilePage from "./app/dashboard/profile/page";
import ReminderPage from "./app/dashboard/reminder/page";
import BookAppointment from "./app/dashboard/bookAppointment/page";
import DoctorAppointment from "./app/dashboard/bookAppointment/doctorAppointment/page";
import LoginPage from "./app/page";
import ClinicalRecordPage from "./app/dashboard/clinical-record/page";
import DashboardHeader from "./components/components/dashboard/header";
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
// import GenerateTokenPage from "./app/dashboard/token/generate/page";
// import TokenVerification from "./app/dashboard/token/generate/tokenVerification/page";
import ConsultationHistoryPage from "./app/dashboard/clinical-record/consultations/page";
import MedicinesPage from "./app/dashboard/clinical-record/medicines/page";
import HealthTrackerPage from "./app/dashboard/health-tracker/page";
import HealthTrackerDetails from "./app/dashboard/health-tracker/vital/page";
import BillReportPage from "./app/dashboard/bill-report/page";
import SendMessagePage from "./app/dashboard/send-message/page";
import FaqPage from "./app/dashboard/faq/page";
import FeedbackSection from "./app/dashboard/complaints/page";
// import GeneratePasswordPage from "./app/forgotPass/page";
import VerifyOtpPage from "./app/verify-otp/page";
import DischargeSummary from "./app/dashboard/clinical-record/dischargeSummary/DischargeSummary";
import IsLoader from "./app/loading";
import ContactUsScreen from "./app/dashboard/contact/pages";
import KioskSelectionPage from "./app/dashboard/token/generate/selectKiosk/pages";
import TokenVerification from "./app/dashboard/token/generate/tokenVerification/page";
import ForgotPassword from "./app/forgotPass/page";
import MyDocumentsPage from "./app/dashboard/my-document/page";

export function App() {
  const { token, isLoading, userData } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(userData);
  if (isLoading) return <div><IsLoader /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {token && userData && (
        <DashboardHeader
          currentUser={userData}
          allUsers={allUsers}
          onSwitchProfile={setCurrentUser}
        />
      )}
      <main className="">
        <Routes>
          <Route
            path="/"
            element={token && userData ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          {token && userData && (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/dashboard/reminder" element={<ReminderPage />} />
              <Route path="/appointments/book" element={<BookAppointment />} />
              <Route path="/doctor-appointment/:id" element={<DoctorAppointment />} />
              <Route path="/teleconsultation/book" element={<Teleconsultation />} />
              <Route path="/teleconsultation-appointment/:id/:center-name" element={<TeleconsultationAppointment />} />
              <Route path="/investigations/book" element={<Investigations />} />
              <Route path="/investigations/:id/:centername" element={<InvestigationsAppoin />} />
              <Route path="/packages" element={<PackageInformations />} />
              <Route path="/packages/packages-details/:id" element={<PackageDetail />} />
              <Route path="/ambulance" element={<AmbulancePage />} />
              <Route path="/my-document" element={<MyDocumentsPage />} />
              {/* <Route path="/token" element={<TokenPage />} /> */}
              {/* <Route path="/token/generate" element={<GenerateTokenPage />} /> */}
              {/* <Route path="/token/verification" element={<TokenVerification />} /> */}
              <Route path="/token" element={<TokenPage />} />
              <Route path="/token/kiosks/:centreId" element={<KioskSelectionPage />} />
              <Route
                path="/token/verification/:centreId/:kioskId"
                element={<TokenVerification />}
              />
              <Route path="/clinical-record" element={<ClinicalRecordPage />} />
              <Route path="/clinical-record/consultations" element={<ConsultationHistoryPage />} />
              <Route path="/clinical-record/lab-reports" element={<LabReportsPage />} />
              <Route path="/clinical-record/radiology-reports" element={<RadiologyReportsPage />} />
              <Route path="/clinical-record/medicines" element={<MedicinesPage />} />
              <Route path="/clinical-record/discharge-summary" element={<DischargeSummary />} />
              <Route path="/health-tracker" element={<HealthTrackerPage />} />
              <Route path="/health-tracker/details/:slug" element={<HealthTrackerDetails />} />
              <Route path="/bill-history" element={<BillReportPage />} />
              <Route path="/send-message" element={<SendMessagePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/feedback" element={<FeedbackSection />} />
              <Route path="/contact-us" element={<ContactUsScreen />} />
              {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
            </>
          )}
          {/* <Route path="generate-password" element={<GeneratePasswordPage />} /> */}
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/verify/otp" element={<VerifyOtpPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
