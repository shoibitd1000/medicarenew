const environment = import.meta.env.VITE_NODE_ENV;

console.log("enviornment" , import.meta.env)
const allEnvApiUrls = {
  production: {
    baseUrl: import.meta.env.VITE_APP_REACT_APP_BASE_URL,
  },
  stagging: {
    baseUrl: import.meta.env.VITE_APP_REACT_APP_PROD_URL,
  },
  development: {
    baseUrl: import.meta.env.VITE_APP_REACT_APP_DEV_URL,
  },
  environment : {
    baseUrl : import.meta.env.VITE_APP_ENVIRONMENT
  }
};


const envUrl = `${allEnvApiUrls['development']?.baseUrl}/MobileApp_API/API`;
console.log('envUrl',envUrl)
export const apiUrls = {
  login: `${envUrl}/LoginAPIDynamic/Getlogin`,
}