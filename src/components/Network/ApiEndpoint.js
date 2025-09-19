const environment = import.meta.env.VITE_NODE_ENV || "development";

const allEnvApiUrls = {
  production: {
    baseUrl: import.meta.env.VITE_BASE_URL_PROD,
  },
  staging: {
    baseUrl: import.meta.env.VITE_BASE_URL_STAGING,
  },
  development: {
    baseUrl: "", // proxy
  },
};

const currentEnv = allEnvApiUrls[environment] ? environment : "development";

const envUrl =
  currentEnv === "development"
    ? "/MobileApp_API/API"
    : `${allEnvApiUrls[currentEnv]?.baseUrl}/MobileApp_API/API`;

export const apiUrls = {
  login: `${envUrl}/LoginAPIDynamic/Getlogin`,
  getDashBoard: `${envUrl}/LoginAPIDynamic/GetDashBoard`,
  welcomeText: `${envUrl}/LoginAPIDynamic/ReactBindWelcomeMessage`,
  centerLab: `${envUrl}/LoginAPIDynamic/GetLabCentre`,
  doctor_speciality: `${envUrl}/LoginAPIDynamic/getDoctorSpecialityList`,
  doctors: `${envUrl}/LoginAPIDynamic/GetAppHistory`,
  appointmentslot: `${envUrl}/LoginAPIDynamic/ReactbindappointmentslotMobileApp`,
  saveAppointment: `${envUrl}/LoginAPIDynamic/SaveAppointment`,
  rescheduleAppointment: `${envUrl}/LoginAPIDynamic/RescheduleAppointment`,
  cancelAppointment: `${envUrl}/LoginAPIDynamic/CancelAppointment`,
  appointmentRate: `${envUrl}/LoginAPIDynamic/GetAppointmentRate`,
  consualtationHistory: `${envUrl}/LoginAPIDynamic/ReactGetPatientConsualtationHistory`,
  doctorPrescription: `${envUrl}/LoginAPIDynamic/DoctorPrescription.aspx`,
  patientLabHistory: `${envUrl}/LoginAPIDynamic/ReactGetPatientLabHistory`,
  doctorPrescribedToPatient: `${envUrl}/LoginAPIDynamic/ReactGetDoctorPrescribedToPatient`,
  patientOPDMedicines: `${envUrl}/LoginAPIDynamic/ReactGetPatientOPDMedicines`,
  dischargeSummaryapi: `${envUrl}/LoginAPIDynamic/React_GetDischargeSummery`,
  patientRadiologyHistoryapi: `${envUrl}/LoginAPIDynamic/ReactGetPatientRadioHistory`,
  // feedback Api 
  patientFeedbackapi: `${envUrl}/LoginAPIDynamic/ReactGetPatientFeedback`,
  patientFeedbackSubjectapi: `${envUrl}/LoginAPIDynamic/ReactGetPatientFeedbackSubject`,
  patientFeedbackSaveapi: `${envUrl}/LoginAPIDynamic/ReactSavePatientFeedback`,
  helthTrackRecordapi: `${envUrl}/LoginAPIDynamic/GetVitalSignDashBoardRecord`,
  opdPackageapi: `${envUrl}/LoginAPIDynamic/ReactBindOPDPackage`,
  opdPackageDetailapi: `${envUrl}/LoginAPIDynamic/BindOpdPackageDetail`,
  ipdPackageDetailapi: `${envUrl}/LoginAPIDynamic/ReactBindIPDPackageDetail`,
  sendMessageapi: `${envUrl}/LoginAPIDynamic/ReactSendSMS`,
  viewMessageapi: `${envUrl}/LoginAPIDynamic/ReactPatientViewSMS`,
  // investigation api
  testNameapi: `${envUrl}/LoginAPIDynamic/BindTestAndPackage?type=T`,
  saveItemDetailsapi: `${envUrl}/LoginAPIDynamic/SaveItemDetails`,
  bindServicesRequest: `${envUrl}/LoginAPIDynamic/BindServiceRequest`,
  switchProfileapi: `${envUrl}/LoginAPIDynamic/ReactSwtichProfile`,
  userprofileapiEditapi: `${envUrl}/LoginAPIDynamic/GetUserToEdit`,
  updateProfileapi: `${envUrl}/LoginAPIDynamic/UpdateProfile`,
  ResetProfilepasswordapi: `${envUrl}/LoginAPIDynamic/ResetProfilepassword`,
  forgotPasswordapi: `${envUrl}/LoginAPIDynamic/Forgetpassword`,
  // payment: 'http://197.138.207.30/Tenwek2208/Design/OPD/MobileMpesaRequest.aspx',

};
