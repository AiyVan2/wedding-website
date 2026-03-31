import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";

export default function TestConnection() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("adminprofile") // your exact table name
        .select("*"); // get all rows
      if (error) setError(error.message);
      else setData(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Supabase Connection Test</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && data.length > 0 ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data found (table might be empty or RLS prevents access)</p>
      )}
    </div>
  );
}