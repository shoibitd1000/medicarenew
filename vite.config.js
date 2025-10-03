import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  function getApiBaseUrl() {
    switch (env.VITE_NODE_ENV) {
      case "production":
        return env.VITE_BASE_URL_PROD;
      case "staging":
        return env.VITE_BASE_URL_STAGING;
      case "development":
        return env.VITE_BASE_URL_DEV;
      default:
        return env.VITE_BASE_URL_PROD; // fallback to production
    }
  }

  return {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/MobileApp_API": {
          target: getApiBaseUrl(),
          changeOrigin: true,
        },
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_NODE_ENV),
    },
  };
});
