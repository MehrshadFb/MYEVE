import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import LandingPage from "./pages/LandingPage";
import Featured from "./pages/Featured";
import Vehicles from "./pages/Vehicles";
import About from "./pages/About";
import ShoppingCart from "./pages/ShoppingCart";
import CartNotSignedIn from "./pages/CartNotSignedIn";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure smooth transition from loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null; // Let the HTML loading state show
  }

  const isLoggedIn = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route path="/featured" element={<Featured />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route
          path="/welcome"
          element={isLoggedIn ? <Welcome /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
