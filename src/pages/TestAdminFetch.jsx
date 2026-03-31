import { useState } from "react";
import { supabase } from "../supabaseclient";

export default function TestAdminFetch() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("adminprofile") // exact table name
      .select("*")
      .eq("username", loginData.username)
      .eq("password", loginData.password) // plain text only for testing
      .limit(1)
      .maybeSingle(); // fetch a single row

    if (error || !data) {
      setErrorMsg(error?.message || "No admin found");
      setAdmin(null);
    } else {
      setAdmin(data);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Admin Fetch</h2>
      <input
        type="text"
        placeholder="Username"
        value={loginData.username}
        onChange={(e) =>
          setLoginData({ ...loginData, username: e.target.value })
        }
        style={{ marginBottom: 10 }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) =>
          setLoginData({ ...loginData, password: e.target.value })
        }
        style={{ marginBottom: 10 }}
      />
      <br />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Fetch Admin"}
      </button>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {admin && (
        <div style={{ marginTop: 20 }}>
          <h3>Admin Data:</h3>
          <pre>{JSON.stringify(admin, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}