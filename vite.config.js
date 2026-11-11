import { defineConfig } from 'vite';

// Expose AUTH0_DOMAIN and AUTH0_CLIENT_ID to the browser bundle.
// A SPA client id is public; do not put a client secret in this app.
export default defineConfig({
  envPrefix: 'AUTH0_',
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
});
