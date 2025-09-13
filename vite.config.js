import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      // Proxying API requests based on the environment
      '/MobileApp_API': {
        target: getApiBaseUrl(), // Dynamically set target based on environment
        changeOrigin: true, // Allow cross-origin requests
        rewrite: (path) => path.replace(/^\/MobileApp_API/, ''), // Rewrite the path if needed
      },
    },
  },
});

function getApiBaseUrl() {
  const environment = process.env.VITE_NODE_ENV || 'development'; // Fallback to 'development' if the environment variable is not set
  switch (environment) {
    case 'production':
      return process.env.VITE_APP_REACT_APP_BASE_URL;
    case 'staging':
      return process.env.VITE_APP_REACT_APP_PROD_URL;
    case 'development':
    default:
      return process.env.VITE_APP_REACT_APP_DEV_URL;
  }
}
