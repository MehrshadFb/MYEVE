import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./context/useAuth";
import SignIn from "./pages/notsignedin/SignIn";
import SignUp from "./pages/notsignedin/SignUp";
import Manage from "./pages/signedin/Manage";
import Profile from "./pages/signedin/Profile";
import AddVehicle from "./pages/signedin/AddVehicle";
import LandingPage from "./pages/notsignedin/LandingPage";
import Featured from "./pages/notsignedin/Featured";
import Vehicles from "./pages/notsignedin/Vehicles";
import About from "./pages/notsignedin/About";
import ShoppingCart from "./pages/notsignedin/ShoppingCart";
import VehicleDetail from "./pages/notsignedin/VehicleDetail";

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure smooth transition from loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading || isLoading) {
    return null; // Let the HTML loading state show
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/manage"
          element={isAuthenticated ? <Manage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/signin" />}
        />
        <Route
          path="/add-vehicle"
          element={isAuthenticated ? <AddVehicle /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
