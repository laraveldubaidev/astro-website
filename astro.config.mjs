// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel/serverless';
// https://astro.build/config
export default defineConfig({
    vite: {
    plugins: [tailwindcss()],
  },
  output: 'server', // required for API routes or SSR
  adapter: vercel(),

});
