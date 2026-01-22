import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F0F0F",
        wood: "#2B1E14",
        gold: "#C9A14A",
        sand: "#E6D3B1",
        slate: "#2E2E2E"
      }
    }
  },
  plugins: []
};

export default config;
