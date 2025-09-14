import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  function getApiBaseUrl() {
    const currentEnv = env.VITE_NODE_ENV || 'development';
    switch (currentEnv) {
      case 'production':
        return env.VITE_APP_REACT_APP_BASE_URL;
      case 'staging':
        return env.VITE_APP_REACT_APP_PROD_URL;
      case 'development':
      default:
        return env.VITE_APP_REACT_APP_DEV_URL;
    }
  }

  return {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/MobileApp_API': {
          target: getApiBaseUrl(), 
          changeOrigin: true,      
        },
      },
    },


  };
});
