import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // หรือ 'localhost' หรือไม่ใส่ host ก็ได้
    port: 5173,
  },
});
