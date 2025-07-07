import { useNavigate } from "react-router-dom";
import UsersList from "../pages/UsersList";
import AddressList from "../pages/AddressList";
import { Link } from "react-router-dom";

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
      <Link 
    to="/featured" 
    style={{
      background: "#3b82f6",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: "600",
      display: "inline-block"
    }}
    onMouseEnter={(e) => {
      e.target.style.background = "#2563eb";
      e.target.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "#3b82f6";
      e.target.style.transform = "translateY(0)";
    }}
  >
    Home
  </Link>
      {user?.role === "admin" && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>This section is only visible to admin users.</p>
          <UsersList />
        </div>
      )}
      {user?.role === "customer" && (
        <div>
          <h2>Customer Dashboard</h2>
          <p>This section is only visible to regular users.</p>
          <AddressList />
        </div>
      )}
    </div>
    
  );
}

export default Welcome;
