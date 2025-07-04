import { useNavigate } from "react-router-dom";
import UsersList from "../pages/UsersList";

function Welcome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Your role: {user?.role}</p>
      <button onClick={handleLogout}>Logout</button>
      {user?.role === "admin" && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>This section is only visible to admin users.</p>
          <UsersList />
        </div>
      )}
    </div>
  );
}

export default Welcome;
