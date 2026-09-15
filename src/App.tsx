import { Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./contexts/AuthContext";
import { PlanProvider } from "./contexts/PlanContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ConfigBanner } from "./components/ConfigBanner";
import { DemoBanner } from "./components/DemoBanner";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { ChoosePlan } from "./pages/ChoosePlan";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

function App() {
  return (
    <AuthProvider>
      <PlanProvider>
        <DemoBanner />
        <ConfigBanner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/choose-plan"
            element={
              <ProtectedRoute>
                <ChoosePlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PlanProvider>
      <Analytics />
    </AuthProvider>
  );
}

export default App;
