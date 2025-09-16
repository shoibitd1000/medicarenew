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
  // doctor_speciality: `${envUrl}/LoginAPIDynamic/GetDrSpeciality`,
  appointmentslot: `${envUrl}/LoginAPIDynamic/ReactbindappointmentslotMobileApp`,
  // doctors: `${envUrl}/LoginAPIDynamic/GetAppHistory`,
  saveAppointment: `${envUrl}/LoginAPIDynamic/SaveAppointment`,
  rescheduleAppointment: `${envUrl}/LoginAPIDynamic/RescheduleAppointment`,
  cancelAppointment: `${envUrl}/LoginAPIDynamic/CancelAppointment`,
  appointmentRate: `${envUrl}/LoginAPIDynamic/GetAppointmentRate`,
  consualtationHistory: `${envUrl}/LoginAPIDynamic/ReactGetPatientConsualtationHistory`,
  doctorPrescription: `${envUrl}/LoginAPIDynamic/DoctorPrescription.aspx`,
  // payment: 'http://197.138.207.30/Tenwek2208/Design/OPD/MobileMpesaRequest.aspx',

};
