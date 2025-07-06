import { useEffect, useState } from "react";
import { getAllUsers, deleteUserById, signUp } from "../../services/api";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "customer",
    password: "",
  });

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const response = await deleteUserById(id);
    if (response) {
      fetchUsers();
    } else {
      console.error("Failed to delete user:", response);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const response = await signUp(newUser);
    if (response) {
      fetchUsers();
      setNewUser({ username: "", email: "", role: "customer", password: "" });
    } else {
      console.error("Failed to add user");
    }
  };

  return (
    <div style={{ color: "#1e293b" }}>
      <div style={{
        backgroundColor: "#f8fafc",
        padding: "24px",
        borderRadius: "12px",
        marginBottom: "24px",
        border: "1px solid #e2e8f0"
        
      }}>
        <h3 style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "16px",
          color: "#1e293b"
        }}>
          Add New User
        </h3>
        <form onSubmit={handleAddUser} style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "16px"
        }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Username *
            </label>
            <input
              name="username"
              placeholder="Username"
              value={newUser.username}
              onChange={handleInputChange}
              required
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "white",
                color: "#1e293b",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
            <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", display: "block" }}>
              Choose a unique username for the user
            </small>
          </div>
          <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Email*
            </label>
          <input
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#1e293b",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
            <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", display: "block" }}>
              Choose your email for the user
            </small>
          </div>
          <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Password*
            </label>
                      <input
              name="password"
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              required
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "white",
                color: "#1e293b",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
            <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", display: "block" }}>
              Must be at least 8 characters and include a special character
            </small>
            </div>
            <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Role*
            </label>
          <select 
            name="role" 
            value={newUser.role} 
            onChange={handleInputChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#1e293b",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          
            </div>
            <div>
          <button
            type="submit"
            style={{
              background: "#3b82f6",
              marginTop: "26px",
              color: "white",
              padding: "12px 50px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#2563eb";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#3b82f6";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Add User
          </button>
          </div>
        </form>
      </div>

      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "20px",
        color: "#1e293b",
        padding: "0 40px",
        boxSizing: "border-box"
      }}>
        Users List
      </h2>

      {users.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#64748b",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "2px dashed #cbd5e1"
        }}>
          <p style={{ fontSize: "1.1rem", margin: 0 }}>
            No users found. Add your first user above!
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0"
              }}>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>Username</th>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>Email</th>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>Role</th>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>Addresses</th>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <td style={{
                    padding: "16px",
                    color: "#1e293b",
                    fontSize: "14px"
                  }}>{user.username}</td>
                  <td style={{
                    padding: "16px",
                    color: "#1e293b",
                    fontSize: "14px"
                  }}>{user.email}</td>
                  <td style={{
                    padding: "16px",
                    color: "#1e293b",
                    fontSize: "14px"
                  }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: user.role === "admin" ? "#fef2f2" : "#f0fdf4",
                      color: user.role === "admin" ? "#dc2626" : "#059669"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{
                    padding: "16px",
                    color: "#1e293b",
                    fontSize: "14px"
                  }}>
                    {user.addresses && user.addresses.length > 0 ? (
                      user.addresses.map((address) => (
                        <div key={address.id} style={{
                          marginBottom: "4px",
                          fontSize: "12px",
                          color: "#64748b"
                        }}>
                          {address.street}, {address.city}, {address.province},{" "}
                          {address.country}, {address.zip}
                        </div>
                      ))
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: "12px" }}>No addresses</span>
                    )}
                  </td>
                  <td style={{
                    padding: "16px"
                  }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === "admin"}
                      style={{
                        background: user.role === "admin" ? "#9ca3af" : "#ef4444",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        border: "none",
                        fontWeight: "500",
                        cursor: user.role === "admin" ? "not-allowed" : "pointer",
                        fontSize: "12px",
                        opacity: user.role === "admin" ? 0.5 : 1
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersList;
