import { useState, useMemo } from "react";
import { supabase } from "../supabaseclient";

// ── All 6 themes ──────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "dusty-rose",
    label: "Dusty Rose",
    description: "Warm terracotta & cream",
    bg: "#fdf6ee", primary: "#5c2d1e", accent: "#c9956b", accentLight: "#e8d5b0",
    preview: ["#5c2d1e", "#c9956b", "#e8d5b0", "#fdf6ee"],
  },
  {
    id: "midnight-gold",
    label: "Midnight Gold",
    description: "Deep navy & champagne",
    bg: "#0f1b2d", primary: "#d4af37", accent: "#c9a227", accentLight: "#2a3f5f",
    preview: ["#d4af37", "#c9a227", "#2a3f5f", "#0f1b2d"],
  },
  {
    id: "sage-garden",
    label: "Sage Garden",
    description: "Soft greens & botanical",
    bg: "#f2f5f0", primary: "#2d4a35", accent: "#7a9e7e", accentLight: "#c8dfc8",
    preview: ["#2d4a35", "#7a9e7e", "#c8dfc8", "#f2f5f0"],
  },
  {
    id: "blush-cream",
    label: "Blush Cream",
    description: "Soft pinks & ivory",
    bg: "#fdf0f0", primary: "#7a3050", accent: "#e8a0b0", accentLight: "#f5d5df",
    preview: ["#7a3050", "#e8a0b0", "#f5d5df", "#fdf0f0"],
  },
  {
    id: "lavender-mist",
    label: "Lavender Mist",
    description: "Dreamy purples & silver",
    bg: "#f5f3fb", primary: "#4a2d7a", accent: "#9b7ec8", accentLight: "#d8cef0",
    preview: ["#4a2d7a", "#9b7ec8", "#d8cef0", "#f5f3fb"],
  },
  {
    id: "obsidian-pearl",
    label: "Obsidian Pearl",
    description: "Charcoal & ivory elegance",
    bg: "#f8f6f2", primary: "#1a1a1a", accent: "#8a7a6a", accentLight: "#d8d0c8",
    preview: ["#1a1a1a", "#8a7a6a", "#d8d0c8", "#f8f6f2"],
  },
];

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ loginData, setLoginData, handleLogin, loading, loginError }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #fdf6ee 0%, #f5e6d3 50%, #ede0d4 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "Georgia, 'Times New Roman', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        .login-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e8d5b0;
          border-radius: 12px;
          background: rgba(255,255,255,0.8);
          font-size: 15px;
          font-family: Georgia, serif;
          color: #5c2d1e;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .login-input:focus {
          border-color: #c9956b;
          box-shadow: 0 0 0 3px rgba(201,149,107,0.15);
        }
        .login-input::placeholder { color: #c9a882; }
        .login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #5c2d1e, #8a4a2e);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-family: Georgia, serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          -webkit-tap-highlight-color: transparent;
        }
        .login-btn:active { transform: scale(0.98); opacity: 0.9; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .petal {
          position: absolute;
          width: 8px; height: 14px;
          border-radius: 50% 50% 50% 0;
          opacity: 0.4;
          animation: floatPetal linear infinite;
        }
        @keyframes floatPetal {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Floating petals */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="petal" style={{
          background: ["#e76f51","#f4a261","#c9956b","#d4a574","#e8d5b0","#c8976a","#f4a261","#e76f51"][i],
          left: `${10 + i * 11}%`,
          animationDuration: `${5 + i * 0.8}s`,
          animationDelay: `${i * 0.6}s`,
        }} />
      ))}

      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: 24,
        padding: "40px 28px 36px",
        boxShadow: "0 8px 40px rgba(92,45,30,0.12), 0 1px 0 rgba(255,255,255,0.8) inset",
        border: "1px solid rgba(232,213,176,0.6)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Top decoration */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 10, lineHeight: 1 }}>♡</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 500,
            color: "#5c2d1e",
            fontStyle: "italic",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}>
            Wedding Admin
          </h1>
          <div style={{ width: 40, height: 1, background: "#e8d5b0", margin: "0 auto 8px" }} />
          <p style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "#c9956b",
            textTransform: "uppercase",
            margin: 0,
            fontFamily: "Georgia, serif",
          }}>
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {loginError && (
          <div style={{
            background: "#fff1f2",
            border: "1px solid #fca5a5",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>⚠</span>
            <span style={{ fontSize: 13, color: "#dc2626" }}>{loginError}</span>
          </div>
        )}

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, letterSpacing: 2, color: "#a07850", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Username
            </label>
            <input
              className="login-input"
              placeholder="Enter your username"
              value={loginData.username}
              onChange={e => setLoginData({ ...loginData, username: e.target.value })}
              autoComplete="username"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, letterSpacing: 2, color: "#a07850", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                autoComplete="current-password"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ paddingRight: 48 }}
              />
              <button
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 4,
                  color: "#c9956b", fontSize: 16, lineHeight: 1,
                }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading || !loginData.username || !loginData.password}
            style={{ marginTop: 6 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center", fontSize: 11, color: "#c9a882",
          marginTop: 24, marginBottom: 0, fontStyle: "italic",
        }}>
          For the couple's eyes only ♡
        </p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function RSVPDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [wedding, setWedding] = useState(null);
  const [weddingForm, setWeddingForm] = useState({
    bride: "", groom: "", date: "", time: "", venue: "", address: "", dress_code: "",
  });
  const [selectedTheme, setSelectedTheme] = useState("dusty-rose");
  const [program, setProgram] = useState([]);
  const [newProgram, setNewProgram] = useState({ time: "", event: "" });
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState({ date: "", description: "" });
  const [rsvp, setRsvps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ── Admin Login ───────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoading(true);
    setLoginError("");

    const { data: adminData, error: adminError } = await supabase
      .from("adminprofile")
      .select("*")
      .eq("username", loginData.username)
      .eq("password", loginData.password)
      .single();

    if (adminError || !adminData) {
      setLoginError("Invalid username or password");
      setLoading(false);
      return;
    }

    setAdmin(adminData);
    let weddingData = null;

    if (adminData.wedding_id) {
      const { data, error: weddingError } = await supabase
        .from("weddings").select("*").eq("id", adminData.wedding_id).single();
      if (weddingError) console.error("Failed to fetch wedding:", weddingError);
      else weddingData = data;
    }

    if (!weddingData) {
      const { data: newWedding, error: createErr } = await supabase
        .from("weddings")
        .insert([{ bride: "", groom: "", date: null, time: "", venue: "", address: "", dress_code: "", program: "[]", milestone: "[]", theme_id: "dusty-rose", created_at: new Date() }])
        .select().single();
      if (createErr) { console.error("Failed to create wedding:", createErr); setLoading(false); return; }
      weddingData = newWedding;
      await supabase.from("adminprofile").update({ wedding_id: weddingData.id }).eq("id", adminData.id);
    }

    setWedding(weddingData);
    setWeddingForm({
      bride: weddingData.bride || "", groom: weddingData.groom || "",
      date: weddingData.date || "", time: weddingData.time || "",
      venue: weddingData.venue || "", address: weddingData.address || "",
      dress_code: weddingData.dress_code || "",
    });
    setSelectedTheme(weddingData.theme_id || "dusty-rose");

    try { const p = weddingData.program ? JSON.parse(weddingData.program) : []; setProgram(Array.isArray(p) ? p : []); } catch { setProgram([]); }
    try { const m = weddingData.milestone ? JSON.parse(weddingData.milestone) : []; setMilestones(Array.isArray(m) ? m : []); } catch { setMilestones([]); }

    setLoading(false);
    fetchRsvps(weddingData.id);
  };

  const fetchRsvps = async (weddingId) => {
    setLoading(true);
    const { data, error } = await supabase.from("rsvp").select("*").eq("wedding_id", weddingId).order("created_at", { ascending: true });
    if (!error) setRsvps(data || []);
    setLoading(false);
  };

  const updateWedding = async () => {
    if (!wedding) return;
    setLoading(true);
    const { data, error } = await supabase.from("weddings").update({ ...weddingForm }).eq("id", wedding.id).select().single();
    if (!error) { setWedding(data); alert("Wedding details updated!"); }
    else console.error("Failed to update wedding:", error);
    setLoading(false);
  };

  const saveTheme = async (themeId) => {
    if (!wedding) return;
    setSelectedTheme(themeId);
    const { error } = await supabase.from("weddings").update({ theme_id: themeId }).eq("id", wedding.id);
    if (error) console.error("Failed to save theme:", error);
  };

  const addProgramItem = () => {
    if (!newProgram.time || !newProgram.event) return;
    setProgram(prev => [...prev, { time: newProgram.time, event: newProgram.event }]);
    setNewProgram({ time: "", event: "" });
  };
  const removeProgramItem = (index) => setProgram(prev => prev.filter((_, i) => i !== index));
  const saveProgram = async () => {
    if (!wedding) return;
    setLoading(true);
    const { error } = await supabase.from("weddings").update({ program: JSON.stringify(program) }).eq("id", wedding.id);
    if (!error) alert("Program saved!"); else console.error("Failed to save program:", error);
    setLoading(false);
  };

  const addMilestone = () => {
    if (!newMilestone.date || !newMilestone.description) return;
    setMilestones(prev => [...prev, { date: newMilestone.date, description: newMilestone.description }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewMilestone({ date: "", description: "" });
  };
  const removeMilestone = (index) => setMilestones(prev => prev.filter((_, i) => i !== index));
  const saveMilestones = async () => {
    if (!wedding) return;
    setLoading(true);
    const { error } = await supabase.from("weddings").update({ milestone: JSON.stringify(milestones) }).eq("id", wedding.id);
    if (!error) alert("Milestones saved!"); else console.error("Failed to save milestones:", error);
    setLoading(false);
  };

  const deleteRsvp = async (id) => {
    const { error } = await supabase.from("rsvp").delete().eq("id", id);
    if (!error) fetchRsvps(wedding.id);
    setDeleteConfirm(null);
  };
  const clearAll = async () => {
    const { error } = await supabase.from("rsvp").delete().eq("wedding_id", wedding.id);
    if (!error) fetchRsvps(wedding.id);
  };

  const filtered = useMemo(() => {
    return rsvp
      .filter(r => filter === "attending" ? r.attending : filter === "declining" ? !r.attending : true)
      .filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));
  }, [rsvp, filter, search]);

  const attending = rsvp.filter(r => r.attending);
  const declining = rsvp.filter(r => !r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + (r.guests || 1), 0);

  const exportCSV = () => {
    const header = ["Name", "Status", "Guests", "Note"];
    const rows = rsvp.map(r => [`"${r.name || ""}"`, r.attending ? "Attending" : "Declining", r.attending ? (r.guests || 1) : 0, `"${(r.note || "").replace(/"/g, "'")}"`]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "rsvp.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Shared input/button styles ────────────────────────────────────────────
  const inputStyle = { flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #e0d0c0", fontSize: 14, outline: "none", fontFamily: "inherit", color: "#3a2010", background: "#fff", boxSizing: "border-box" };
  const btnPrimary = { padding: "10px 22px", background: "#5c2d1e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", letterSpacing: 0.5, whiteSpace: "nowrap" };
  const btnDanger = { padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" };
  const sectionHead = { fontSize: 18, fontWeight: 600, color: "#3a2010", marginBottom: 6, fontFamily: "Georgia, serif" };
  const sectionSub = { fontSize: 12, color: "#a07850", marginBottom: 18, marginTop: 0 };

  // ── Show login if not authed ──────────────────────────────────────────────
  if (!admin) {
    return <LoginScreen loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} loading={loading} loginError={loginError} />;
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "Georgia, serif", color: "#c9956b", fontStyle: "italic", fontSize: 15 }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 60px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{`
        .dash-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #e0d0c0; font-size: 14px; outline: none; font-family: inherit; color: #3a2010; background: #fff; box-sizing: border-box; }
        .dash-input:focus { border-color: #c9956b; box-shadow: 0 0 0 2px rgba(201,149,107,0.15); }
        .section-divider { height: 1px; background: linear-gradient(to right, transparent, #e8d5b0, transparent); margin: 8px 0 32px; border: none; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 36, paddingBottom: 24, borderBottom: "1px solid #f0e0cc" }}>
        <div style={{ fontSize: 22, color: "#c9956b", marginBottom: 6 }}>♡</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 500, color: "#5c2d1e", fontStyle: "italic", margin: "0 0 4px" }}>Wedding Dashboard</h1>
        <p style={{ fontSize: 11, letterSpacing: 3, color: "#c9956b", textTransform: "uppercase", margin: 0 }}>Admin Panel</p>
      </div>

      {/* ── Wedding Details ── */}
      <h2 style={sectionHead}>Wedding Details</h2>
      <p style={sectionSub}>Basic information shown on the invitation.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {[["Bride", "bride"], ["Groom", "groom"], ["Venue", "venue"], ["Address", "address"], ["Dress Code", "dress_code"]].map(([label, key]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, letterSpacing: 1.5, color: "#a07850", textTransform: "uppercase" }}>{label}</label>
            <input className="dash-input" value={weddingForm[key]} onChange={e => setWeddingForm({ ...weddingForm, [key]: e.target.value })} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: 11, letterSpacing: 1.5, color: "#a07850", textTransform: "uppercase" }}>Date</label>
            <input className="dash-input" type="date" value={weddingForm.date?.split("T")[0] || ""} onChange={e => setWeddingForm({ ...weddingForm, date: e.target.value })} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 120 }}>
            <label style={{ fontSize: 11, letterSpacing: 1.5, color: "#a07850", textTransform: "uppercase" }}>Time</label>
            <input className="dash-input" type="time" value={weddingForm.time || ""} onChange={e => setWeddingForm({ ...weddingForm, time: e.target.value })} />
          </div>
        </div>
      </div>
      <button onClick={updateWedding} disabled={loading} style={{ ...btnPrimary, width: "100%", padding: "12px", marginBottom: 0, letterSpacing: 1 }}>
        Save Wedding Details
      </button>
      <hr className="section-divider" />

      {/* ── Theme Picker ── */}
      <h2 style={sectionHead}>Invitation Theme</h2>
      <p style={sectionSub}>Choose a visual style. Saved instantly when selected.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 0 }}>
        {THEMES.map(t => {
          const isSelected = selectedTheme === t.id;
          return (
            <div key={t.id} onClick={() => saveTheme(t.id)} style={{
              border: `2px solid ${isSelected ? t.primary : "#e5e5e5"}`,
              borderRadius: 12, overflow: "hidden", cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: isSelected ? `0 0 0 3px ${t.accent}44` : "0 1px 3px rgba(0,0,0,0.06)",
              transform: isSelected ? "scale(1.02)" : "scale(1)",
            }}>
              <div style={{ display: "flex", height: 44 }}>
                {t.preview.map((color, i) => <div key={i} style={{ flex: 1, background: color }} />)}
              </div>
              <div style={{ padding: "10px 12px", background: t.bg, borderTop: `1px solid ${t.accentLight}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 12, color: t.primary }}>{t.label}</span>
                  {isSelected && <span style={{ fontSize: 9, background: t.primary, color: t.bg, padding: "2px 7px", borderRadius: 20 }}>Active</span>}
                </div>
                <span style={{ fontSize: 10, color: t.accent }}>{t.description}</span>
              </div>
            </div>
          );
        })}
      </div>
      <hr className="section-divider" />

      {/* ── Wedding Program ── */}
      <h2 style={sectionHead}>Wedding Program</h2>
      <p style={sectionSub}>Events shown on the Details page of the invitation.</p>
      <div style={{ marginBottom: 12 }}>
        {program.length === 0 && <p style={{ color: "#bbb", fontStyle: "italic", fontSize: 13, marginBottom: 12 }}>No program items yet.</p>}
        {program.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, padding: "10px 12px", border: "1px solid #ede0cc", borderRadius: 8, background: "#fffaf5" }}>
            <span style={{ minWidth: 70, fontWeight: 600, fontSize: 13, color: "#c9956b" }}>{item.time}</span>
            <span style={{ flex: 1, fontSize: 14, color: "#3a2010" }}>{item.event}</span>
            <button onClick={() => removeProgramItem(i)} style={btnDanger}>Remove</button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input type="time" value={newProgram.time} onChange={e => setNewProgram({ ...newProgram, time: e.target.value })} style={{ ...inputStyle, flex: "0 0 130px", minWidth: 0 }} />
        <input value={newProgram.event} onChange={e => setNewProgram({ ...newProgram, event: e.target.value })} placeholder="e.g. Ceremony, First Dance..." style={{ ...inputStyle, minWidth: 0 }} onKeyDown={e => e.key === "Enter" && addProgramItem()} />
        <button onClick={addProgramItem} style={btnPrimary}>Add</button>
      </div>
      <button onClick={saveProgram} disabled={loading} style={{ ...btnPrimary, width: "100%", padding: "12px", letterSpacing: 1 }}>Save Program</button>
      <hr className="section-divider" />

      {/* ── Milestones ── */}
      <h2 style={sectionHead}>Our Story / Milestones</h2>
      <p style={sectionSub}>Timeline shown on the Story page of the invitation.</p>
      <div style={{ marginBottom: 12 }}>
        {milestones.length === 0 && <p style={{ color: "#bbb", fontStyle: "italic", fontSize: 13, marginBottom: 12 }}>No milestones yet.</p>}
        {milestones.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, padding: "10px 12px", border: "1px solid #ede0cc", borderRadius: 8, background: "#fffaf5" }}>
            <span style={{ minWidth: 120, fontWeight: 600, fontSize: 12, color: "#c9956b", whiteSpace: "nowrap", paddingTop: 1 }}>
              {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span style={{ flex: 1, fontSize: 13, color: "#3a2010", lineHeight: 1.5 }}>{item.description}</span>
            <button onClick={() => removeMilestone(i)} style={btnDanger}>Remove</button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input type="date" value={newMilestone.date} onChange={e => setNewMilestone({ ...newMilestone, date: e.target.value })} style={{ ...inputStyle, flex: "0 0 150px", minWidth: 0 }} />
        <input value={newMilestone.description} onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })} placeholder="e.g. We met at a coffee shop..." style={{ ...inputStyle, minWidth: 0 }} onKeyDown={e => e.key === "Enter" && addMilestone()} />
        <button onClick={addMilestone} style={btnPrimary}>Add</button>
      </div>
      <button onClick={saveMilestones} disabled={loading} style={{ ...btnPrimary, width: "100%", padding: "12px", letterSpacing: 1 }}>Save Milestones</button>
      <hr className="section-divider" />

      {/* ── RSVP Responses ── */}
      <h2 style={sectionHead}>RSVP Responses</h2>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total", value: rsvp.length, color: "#5c2d1e", bg: "#fdf6ee" },
          { label: "Attending", value: attending.length, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Declining", value: declining.length, color: "#dc2626", bg: "#fff1f2" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.color, opacity: 0.7, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "#a07850", textAlign: "center", marginBottom: 20, marginTop: -10 }}>
        {totalGuests} total seats reserved
      </p>

      {/* Search + filters */}
      <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "attending", "declining"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${filter === f ? "#5c2d1e" : "#ddd"}`,
            fontSize: 12, cursor: "pointer", flex: 1,
            background: filter === f ? "#5c2d1e" : "#fff",
            color: filter === f ? "#fff" : "#666",
            textTransform: "capitalize", letterSpacing: 0.5,
          }}>{f}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {rsvp.length > 0 && (
          <button onClick={exportCSV} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, cursor: "pointer", background: "#fff", color: "#5c2d1e" }}>
            Export CSV
          </button>
        )}
        <button onClick={clearAll} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fee2e2", color: "#dc2626", fontSize: 12, cursor: "pointer" }}>
          Clear All
        </button>
      </div>

      {/* RSVP list */}
      {filtered.length === 0 ? (
        <p style={{ color: "#bbb", fontStyle: "italic", textAlign: "center", fontSize: 13 }}>No RSVPs found.</p>
      ) : (
        filtered.map(r => (
          <div key={r.id} style={{ border: `1px solid ${r.attending ? "#86efac" : "#fca5a5"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10, background: r.attending ? "#f0fdf4" : "#fff1f2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: 14, color: "#3a2010" }}>{r.name}</strong>
                <span style={{ marginLeft: 8, fontSize: 12, color: r.attending ? "#16a34a" : "#dc2626" }}>
                  {r.attending ? "✓ Attending" : "✗ Declining"}
                </span>
              </div>
              {deleteConfirm === r.id ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => deleteRsvp(r.id)} style={{ padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Delete</button>
                  <button onClick={() => setDeleteConfirm(null)} style={{ padding: "4px 10px", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "#fff" }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(r.id)} style={btnDanger}>Delete</button>
              )}
            </div>
            {r.attending && <div style={{ fontSize: 12, color: "#555", marginTop: 5 }}>Guests: {r.guests || 1}</div>}
            {r.note && <div style={{ fontSize: 12, color: "#777", marginTop: 4, fontStyle: "italic" }}>"{r.note}"</div>}
          </div>
        ))
      )}
    </div>
  );
}