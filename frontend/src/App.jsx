import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";

function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/welcome" : "/signin"} />}
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/welcome"
          element={isLoggedIn ? <Welcome /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
