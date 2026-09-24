import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Backend runs on :5001. Proxying keeps everything same-origin (no CORS issues).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5001",
      "/socket.io": { target: "http://localhost:5001", ws: true },
    },
  },
});
