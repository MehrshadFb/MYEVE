import { useState } from "react";
import { fetchUsers } from "./services/api";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFetchUsers = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetchUsers();
      setUsers(response.data);
      setSuccess(`Fetched ${response.data.length} users successfully!`);
    } catch (err) {
      setError("Failed to fetch users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          age: formData.age ? parseInt(formData.age) : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("User created successfully!");
        setFormData({ name: "", email: "", age: "" }); // Reset form
        // Optionally refresh the users list
        handleFetchUsers();
      } else {
        setError(result.message || "Failed to create user");
      }
    } catch (err) {
      setError("Failed to create user: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full Stack User Management</h1>

        {/* Messages */}
        {error && (
          <div
            style={{
              color: "white",
              backgroundColor: "#dc3545",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            {error}
            <button
              onClick={clearMessages}
              style={{
                position: "absolute",
                right: "10px",
                top: "5px",
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div
            style={{
              color: "white",
              backgroundColor: "#28a745",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            {success}
            <button
              onClick={clearMessages}
              style={{
                position: "absolute",
                right: "10px",
                top: "5px",
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Add User Form */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
            color: "#333",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h2 style={{ marginTop: "0", color: "#333" }}>Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                placeholder="Enter full name"
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                placeholder="Enter email address"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Age (optional):
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                max="120"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                placeholder="Enter age"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                backgroundColor: isSubmitting ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                marginBottom: "10px",
              }}
            >
              {isSubmitting ? "Creating User..." : "Add User"}
            </button>
          </form>
        </div>

        {/* Fetch Users Button */}
        <button
          onClick={handleFetchUsers}
          disabled={loading}
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "30px",
          }}
        >
          {loading ? "Loading..." : "Fetch All Users"}
        </button>

        {/* Users List */}
        {users.length > 0 && (
          <div style={{ maxWidth: "600px", width: "100%" }}>
            <h2>Users ({users.length})</h2>
            <div
              style={{
                display: "grid",
                gap: "15px",
                textAlign: "left",
              }}
            >
              {users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    color: "#333",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", color: "#007bff" }}>
                        {user.name}
                      </h3>
                      <p style={{ margin: "0 0 5px 0" }}>
                        <strong>Email:</strong> {user.email}
                      </p>
                      {user.age && (
                        <p style={{ margin: "0 0 5px 0" }}>
                          <strong>Age:</strong> {user.age}
                        </p>
                      )}
                      <p
                        style={{
                          margin: "0",
                          fontSize: "12px",
                          color: "#6c757d",
                        }}
                      >
                        <strong>Created:</strong>{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      style={{
                        backgroundColor: user.isActive ? "#28a745" : "#dc3545",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {users.length === 0 && !loading && (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            No users found. Add some users or click "Fetch All Users" to load
            existing ones.
          </p>
        )}
      </header>
    </div>
  );
}

export default App;
