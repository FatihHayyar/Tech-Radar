import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // event listener ekleyeceksen buraya
    },
    baseUrl: "http://localhost:5173", // frontend dev server adresi
  },
});
