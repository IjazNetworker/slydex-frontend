import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "slydex" && password === "123456") {
      // ✅ save login
      localStorage.setItem("isAdmin", "true");

      // ✅ redirect
      navigate("/admin/orders");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0f0f0f",
      color: "#fff"
    }}>
      <form onSubmit={handleLogin} style={{
        width: 300,
        padding: 25,
        background: "#1a1a1a",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 10, borderRadius: 5, border: "none" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 5, border: "none" }}
        />

        {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}

        <button style={{
          padding: 10,
          background: "#facc15",
          border: "none",
          borderRadius: 5,
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          Login
        </button>
      </form>
    </div>
  );
}