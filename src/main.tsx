import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { OnboardingProvider } from "@/features/onboarding/OnboardingContext";

createRoot(document.getElementById("root")!).render(
  <OnboardingProvider>
    <App />
  </OnboardingProvider>
);
