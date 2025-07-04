import { useEffect, useState } from "react";
import { getAllUsers, deleteUserById, signUp } from "../services/api";

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
    <>
      <form onSubmit={handleAddUser} style={{ marginBottom: "1rem" }}>
        <input
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleInputChange}
          required
        />
        <select name="role" value={newUser.role} onChange={handleInputChange}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={user.role === "admin"}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default UsersList;
