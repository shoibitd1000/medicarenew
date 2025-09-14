const environment = import.meta.env.VITE_NODE_ENV || "development";

const allEnvApiUrls = {
  production: {
    baseUrl: import.meta.env.VITE_APP_REACT_APP_BASE_URL,
  },
  stagging: {
    baseUrl: import.meta.env.VITE_APP_REACT_APP_PROD_URL,
  },
  development: {
    baseUrl: "", // <--- EMPTY so Vite proxy is used
  },
};

const currentEnv = allEnvApiUrls[environment] ? environment : "development";

const envUrl =
  currentEnv === "development"
    ? "/MobileApp_API/API" // <--- Relative path triggers proxy
    : `${allEnvApiUrls[currentEnv]?.baseUrl}/MobileApp_API/API`;

export const apiUrls = {
  login: `${envUrl}/LoginAPIDynamic/Getlogin`,
  getDashBoard: `${envUrl}/LoginAPIDynamic/GetDashBoard `,
};
