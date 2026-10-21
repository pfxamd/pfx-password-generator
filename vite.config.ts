import { pfxReleasePlugin } from "./scripts/pfx-release.mjs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), pfxReleasePlugin()],
});
