import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5174,

    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },

      "/socket.io": {
        target: "http://localhost:5001",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});