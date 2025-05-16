import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Se quiser forçar usar IPv4 e não IPv6:
    host: '127.0.0.1',
  },
});

