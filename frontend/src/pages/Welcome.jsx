import { useNavigate } from "react-router-dom";

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
    </div>
  );
}

export default Welcome;
