import { useState, useEffect, useRef } from "react";

// ── Themes ────────────────────────────────────────────────────────────────────
export const THEMES = {
  "dusty-rose": {
    id: "dusty-rose",
    name: "Dusty Rose & Sage",
    preview: ["#fdf6ee", "#5c2d1e", "#c9956b", "#e8d5b0"],
    colors: {
      bg: "#fdf6ee",
      cardBg: "#fffdf7",
      primary: "#5c2d1e",
      accent: "#c9956b",
      accentLight: "#e8d5b0",
      text: "#a07850",
      textDark: "#5c2d1e",
      envelopeBody: "#c8976a",
      envelopeSide: "#b5835a",
      envelopeBottom: "#d4a574",
      envelopeFlap: "#e76f51",
      petalColors: ["#e76f51", "#f4a261", "#e9c46a", "#d4a574"],
    },
  },
  "midnight-gold": {
    id: "midnight-gold",
    name: "Midnight Navy & Gold",
    preview: ["#0f1b2d", "#d4af37", "#c9a227", "#2a3f5f"],
    colors: {
      bg: "#0f1b2d",
      cardBg: "#162236",
      primary: "#d4af37",
      accent: "#c9a227",
      accentLight: "#2a3f5f",
      text: "#8fa8c8",
      textDark: "#e8d8a0",
      envelopeBody: "#1e3a5f",
      envelopeSide: "#163050",
      envelopeBottom: "#254875",
      envelopeFlap: "#d4af37",
      petalColors: ["#d4af37", "#f0d060", "#c9a227", "#e8c840"],
    },
  },
  "sage-garden": {
    id: "sage-garden",
    name: "Sage Garden",
    preview: ["#f2f5f0", "#2d4a35", "#7a9e7e", "#c8dfc8"],
    colors: {
      bg: "#f2f5f0",
      cardBg: "#f8fbf7",
      primary: "#2d4a35",
      accent: "#7a9e7e",
      accentLight: "#c8dfc8",
      text: "#5a7a5e",
      textDark: "#2d4a35",
      envelopeBody: "#7a9e7e",
      envelopeSide: "#6a8e6e",
      envelopeBottom: "#9ab89e",
      envelopeFlap: "#4a7a50",
      petalColors: ["#7a9e7e", "#a8c8a8", "#5a8e60", "#c8dfc8"],
    },
  },
  "blush-cream": {
    id: "blush-cream",
    name: "Blush & Cream",
    preview: ["#fdf0f0", "#7a3050", "#e8a0b0", "#f5d5df"],
    colors: {
      bg: "#fdf0f0",
      cardBg: "#fff8f8",
      primary: "#7a3050",
      accent: "#e8a0b0",
      accentLight: "#f5d5df",
      text: "#b07080",
      textDark: "#7a3050",
      envelopeBody: "#e8a0b0",
      envelopeSide: "#d88898",
      envelopeBottom: "#f0b8c8",
      envelopeFlap: "#c07090",
      petalColors: ["#e8a0b0", "#f5c0d0", "#c07090", "#f0d0d8"],
    },
  },
};

const DEFAULT_THEME_ID = "dusty-rose";

// ── Default State ─────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  bride: "",
  groom: "",
  date: "",
  time: "",
  venue: "",
  address: "",
  dressCode: "",
  themeId: DEFAULT_THEME_ID,
  story: [
    { year: "2018", label: "First met", text: "A rainy Tuesday at a mutual friend's party. Marco spilled coffee on Isabella's book — she laughed instead of being mad." },
    { year: "2020", label: "First date", text: "A picnic in the park that turned into a four-hour conversation about everything and nothing." },
    { year: "2022", label: "Moved in", text: "A tiny apartment, two cats, and the realization that home isn't a place — it's a person." },
    { year: "2024", label: "He proposed", text: "On the same rainy Tuesday six years later, in the same spot where coffee was spilled and a love story began." },
  ],
  photos: [],
  program: [
    { time: "3:30 PM", event: "Guest arrival & seating" },
    { time: "4:00 PM", event: "Ceremony begins" },
    { time: "4:45 PM", event: "Exchange of vows & rings" },
    { time: "5:00 PM", event: "Cocktail hour" },
    { time: "6:30 PM", event: "Reception dinner" },
    { time: "8:00 PM", event: "First dance & program" },
    { time: "10:00 PM", event: "Send-off & farewell" },
  ],
};

// ── Shared Styles (neutral, don't depend on theme) ────────────────────────────
const s = {
  input: {
    padding: "10px 14px", border: "1px solid #e0d0c0", borderRadius: 6,
    fontSize: 14, width: "100%", fontFamily: "inherit", background: "#fffdf9",
    color: "#3a1a0e", outline: "none", boxSizing: "border-box",
  },
  textarea: {
    padding: "10px 14px", border: "1px solid #e0d0c0", borderRadius: 6,
    fontSize: 14, width: "100%", fontFamily: "inherit", background: "#fffdf9",
    color: "#3a1a0e", outline: "none", resize: "vertical", minHeight: 72,
    boxSizing: "border-box",
  },
  label: {
    fontSize: 11, fontWeight: 700, color: "#a07050", marginBottom: 5,
    display: "block", textTransform: "uppercase", letterSpacing: 1.2,
  },
  card: {
    background: "#fffdf7", border: "1px solid #ecddc8", borderRadius: 10,
    padding: "18px 18px 14px", marginBottom: 10,
  },
  addBtn: {
    padding: "9px 20px", background: "transparent", color: "#5c2d1e",
    border: "1.5px dashed #c9956b", borderRadius: 8, fontSize: 12,
    letterSpacing: 1, cursor: "pointer", fontFamily: "inherit", width: "100%",
    marginTop: 4,
  },
  removeBtn: {
    background: "none", border: "none", color: "#c9956b", cursor: "pointer",
    fontSize: 20, lineHeight: 1, padding: "0 4px", flexShrink: 0,
  },
  saveBtn: {
    padding: "14px 40px", background: "#5c2d1e", color: "#fff",
    border: "none", borderRadius: 40, fontSize: 13, letterSpacing: 2,
    textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
    width: "100%", marginTop: 8,
  },
  section: {
    background: "#fff8f2", border: "1px solid #ecddc8", borderRadius: 14,
    padding: "24px 22px", marginBottom: 24,
  },
  moveBtn: {
    background: "none", border: "1px solid #e0d0c0", borderRadius: 4,
    cursor: "pointer", fontSize: 12, color: "#a07050", padding: "3px 8px",
    lineHeight: 1.4, flexShrink: 0,
  },
};

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: "#5c2d1e", fontStyle: "italic", margin: "0 0 4px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 12, color: "#b08060", margin: "0 0 12px" }}>{subtitle}</p>}
      <div style={{ height: 1, background: "#ecddc8" }} />
    </div>
  );
}

// ── Theme Switcher ────────────────────────────────────────────────────────────
function ThemeSwitcher({ currentThemeId, onChange }) {
  return (
    <div style={s.section}>
      <SectionHeader
        title="Invite Theme"
        subtitle="Choose a colour palette. It applies instantly to the wedding invite page."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {Object.values(THEMES).map((theme) => {
          const isActive = theme.id === currentThemeId;
          const [bg, primary, accent, light] = theme.preview;
          return (
            <button
              key={theme.id}
              onClick={() => onChange(theme.id)}
              style={{
                border: `2px solid ${isActive ? primary : "#e0d0c0"}`,
                borderRadius: 12,
                background: isActive ? "#fffdf7" : "#fff",
                padding: "16px 18px",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                boxShadow: isActive ? `0 0 0 3px ${accent}40` : "none",
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              {/* Colour swatches */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[bg, primary, accent, light].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
                ))}
              </div>

              {/* Mini invite preview */}
              <div style={{ background: bg, borderRadius: 8, padding: "10px 12px", marginBottom: 10, border: `1px solid ${light}` }}>
                <div style={{ height: 6, width: "60%", background: accent, borderRadius: 3, marginBottom: 5, opacity: 0.6 }} />
                <div style={{ height: 10, width: "80%", background: primary, borderRadius: 3, marginBottom: 4 }} />
                <div style={{ height: 10, width: "70%", background: primary, borderRadius: 3, marginBottom: 6 }} />
                <div style={{ height: 1, background: light, marginBottom: 6 }} />
                <div style={{ height: 6, width: "45%", background: accent, borderRadius: 3, opacity: 0.5 }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#3a1a0e", fontWeight: isActive ? 700 : 400, fontFamily: "Georgia, serif", fontStyle: isActive ? "italic" : "normal" }}>
                  {theme.name}
                </span>
                {isActive && (
                  <span style={{ fontSize: 10, background: primary, color: "#fff", borderRadius: 20, padding: "3px 10px", letterSpacing: 1, textTransform: "uppercase" }}>
                    Active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 11, color: "#b08060", marginTop: 14, fontStyle: "italic" }}>
        💡 Click Save All Changes in the Settings tab after selecting a theme to apply it to the invite.
      </p>
    </div>
  );
}

// ── RSVP Dashboard ────────────────────────────────────────────────────────────
function RSVPDashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("rsvps") || "[]");
    setRsvps(data);
  }, []);

  const attending = rsvps.filter(r => r.attend === true);
  const declining = rsvps.filter(r => r.attend === false);
  const totalGuests = attending.reduce((sum, r) => sum + (r.guests || 1), 0);

  const filtered = rsvps
    .filter(r => {
      if (filter === "attending") return r.attend === true;
      if (filter === "declining") return r.attend === false;
      return true;
    })
    .filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));

  const deleteRsvp = (idx) => {
    const target = filtered[idx];
    const realIdx = rsvps.indexOf(target);
    const updated = rsvps.filter((_, i) => i !== realIdx);
    setRsvps(updated);
    localStorage.setItem("rsvps", JSON.stringify(updated));
    setDeleteConfirm(null);
  };

  const clearAll = () => {
    setRsvps([]);
    localStorage.setItem("rsvps", JSON.stringify([]));
    setDeleteConfirm(null);
  };

  const exportCSV = () => {
    const header = ["Name", "Status", "Guests", "Note"];
    const rows = rsvps.map(r => [
      `"${r.name || ""}"`,
      r.attend ? "Attending" : "Declining",
      r.attend ? (r.guests || 1) : 0,
      `"${(r.note || "").replace(/"/g, "'")}"`,
    ]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "rsvps.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const statBox = (label, value, color, sub) => (
    <div style={{ flex: 1, background: "#fffdf7", border: "1px solid #ecddc8", borderRadius: 12, padding: "16px 18px", textAlign: "center", minWidth: 100 }}>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 36, color, fontStyle: "italic", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#a07050", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#c9956b", marginTop: 2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={s.section}>
      <SectionHeader title="RSVP Responses" subtitle="All guest responses submitted through the invite page." />
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {statBox("Total RSVPs", rsvps.length, "#5c2d1e")}
        {statBox("Attending", attending.length, "#4a7c4e", `${totalGuests} seat${totalGuests !== 1 ? "s" : ""} total`)}
        {statBox("Declining", declining.length, "#c0392b")}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input style={{ ...s.input, flex: 1, minWidth: 160, fontSize: 13 }} placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "attending", "declining"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #e0d0c0", background: filter === f ? "#5c2d1e" : "#fffdf7", color: filter === f ? "#fff" : "#a07050", fontSize: 11, cursor: "pointer", textTransform: "capitalize", letterSpacing: 0.5, fontFamily: "inherit" }}>
              {f}
            </button>
          ))}
        </div>
        {rsvps.length > 0 && (
          <button onClick={exportCSV} style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #c9956b", background: "transparent", color: "#c9956b", fontSize: 11, cursor: "pointer", letterSpacing: 0.5, fontFamily: "inherit" }}>
            ↓ Export CSV
          </button>
        )}
      </div>
      {rsvps.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#c9956b", fontStyle: "italic", fontSize: 14 }}>No RSVPs yet. They'll appear here once guests respond.</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "#c9956b", fontStyle: "italic", fontSize: 13 }}>No results match your search.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((r, i) => (
            <div key={i} style={{ background: "#fffdf7", border: `1px solid ${r.attend ? "#c8e6c9" : "#ffccbc"}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.attend ? "#4a7c4e" : "#c0392b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, fontFamily: "Georgia, serif" }}>
                {(r.name || "?")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: "#3a1a0e", fontWeight: 600 }}>{r.name}</span>
                  <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20, background: r.attend ? "#e8f5e9" : "#fbe9e7", color: r.attend ? "#4a7c4e" : "#c0392b", letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {r.attend ? "Attending" : "Declining"}
                  </span>
                  {r.attend && <span style={{ fontSize: 11, color: "#a07050" }}>👥 {r.guests || 1} guest{(r.guests || 1) !== 1 ? "s" : ""}</span>}
                </div>
                {r.note && <p style={{ fontSize: 12, color: "#a07050", margin: "6px 0 0", fontStyle: "italic", lineHeight: 1.5 }}>"{r.note}"</p>}
              </div>
              {deleteConfirm === i ? (
                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#c0392b" }}>Remove?</span>
                  <button onClick={() => deleteRsvp(i)} style={{ padding: "4px 10px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Yes</button>
                  <button onClick={() => setDeleteConfirm(null)} style={{ padding: "4px 10px", background: "none", border: "1px solid #e0d0c0", borderRadius: 6, fontSize: 11, cursor: "pointer", color: "#a07050" }}>No</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(i)} style={{ ...s.removeBtn, fontSize: 16, color: "#e0c8b0", flexShrink: 0 }}>×</button>
              )}
            </div>
          ))}
        </div>
      )}
      {rsvps.length > 0 && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          {deleteConfirm === "all" ? (
            <span style={{ fontSize: 12 }}>
              <span style={{ color: "#c0392b", marginRight: 8 }}>Clear all RSVPs?</span>
              <button onClick={clearAll} style={{ padding: "4px 12px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", marginRight: 6 }}>Yes, clear</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: "4px 12px", background: "none", border: "1px solid #e0d0c0", borderRadius: 6, fontSize: 11, cursor: "pointer", color: "#a07050" }}>Cancel</button>
            </span>
          ) : (
            <button onClick={() => setDeleteConfirm("all")} style={{ fontSize: 11, color: "#c9956b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>
              Clear all RSVPs
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Story Editor ──────────────────────────────────────────────────────────────
function StoryEditor({ story, onChange }) {
  const update = (i, field, val) => onChange(story.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const add = () => onChange([...story, { year: "", label: "", text: "" }]);
  const remove = (i) => onChange(story.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const next = [...story]; const swap = i + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[i], next[swap]] = [next[swap], next[i]]; onChange(next);
  };
  return (
    <div style={s.section}>
      <SectionHeader title="Our Story" subtitle="Add as many milestones as you like. Use ↑ ↓ to reorder." />
      {story.map((item, i) => (
        <div key={i} style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "#c9956b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Milestone {i + 1}</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button style={s.moveBtn} onClick={() => move(i, -1)}>↑</button>
              <button style={s.moveBtn} onClick={() => move(i, 1)}>↓</button>
              <button style={s.removeBtn} onClick={() => remove(i)}>×</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: "0 0 100px" }}>
              <label style={s.label}>Year</label>
              <input style={s.input} value={item.year} onChange={e => update(i, "year", e.target.value)} placeholder="2024" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Label</label>
              <input style={s.input} value={item.label} onChange={e => update(i, "label", e.target.value)} placeholder="He proposed" />
            </div>
          </div>
          <label style={s.label}>Story text</label>
          <textarea style={s.textarea} value={item.text} onChange={e => update(i, "text", e.target.value)} placeholder="Tell the story of this moment..." />
        </div>
      ))}
      <button style={s.addBtn} onClick={add}>+ Add Milestone</button>
    </div>
  );
}

// ── Gallery Editor ────────────────────────────────────────────────────────────
function GalleryEditor({ photos, onChange }) {
  const fileInputRef = useRef(null);
  const handleFiles = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => onChange(prev => [...prev, { url: ev.target.result, caption: file.name.replace(/\.[^.]+$/, "") }]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  const updateCaption = (i, val) => onChange(photos.map((p, idx) => idx === i ? { ...p, caption: val } : p));
  const remove = (i) => onChange(photos.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const next = [...photos]; const swap = i + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[i], next[swap]] = [next[swap], next[i]]; onChange(next);
  };
  return (
    <div style={s.section}>
      <SectionHeader title="Gallery" subtitle="Upload photos from your device. Edit captions and reorder as needed." />
      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFiles} />
      <button style={{ ...s.addBtn, marginBottom: 16 }} onClick={() => fileInputRef.current.click()}>📷 Upload Photos (select multiple)</button>
      {photos.length === 0 && <p style={{ fontSize: 13, color: "#c9956b", textAlign: "center", padding: "12px 0", fontStyle: "italic" }}>No photos yet — click above to upload!</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ ...s.card, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <img src={p.url} alt={p.caption} style={{ width: "100%", height: 105, objectFit: "cover", borderRadius: 6, display: "block" }} />
              <button onClick={() => remove(i)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(92,45,30,0.85)", border: "none", borderRadius: "50%", color: "#fff", width: 22, height: 22, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            <input style={{ ...s.input, fontSize: 12, padding: "6px 10px" }} value={p.caption} onChange={e => updateCaption(i, e.target.value)} placeholder="Caption..." />
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ ...s.moveBtn, flex: 1 }} onClick={() => move(i, -1)}>← Left</button>
              <button style={{ ...s.moveBtn, flex: 1 }} onClick={() => move(i, 1)}>Right →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Program Editor ────────────────────────────────────────────────────────────
function ProgramEditor({ program, onChange }) {
  const update = (i, field, val) => onChange(program.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const add = () => onChange([...program, { time: "", event: "" }]);
  const remove = (i) => onChange(program.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const next = [...program]; const swap = i + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[i], next[swap]] = [next[swap], next[i]]; onChange(next);
  };
  return (
    <div style={s.section}>
      <SectionHeader title="Program" subtitle="Add, remove, or reorder schedule items." />
      {program.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input style={{ ...s.input, flex: "0 0 100px", fontSize: 13 }} value={item.time} onChange={e => update(i, "time", e.target.value)} placeholder="4:00 PM" />
          <input style={{ ...s.input, flex: 1, fontSize: 13 }} value={item.event} onChange={e => update(i, "event", e.target.value)} placeholder="Ceremony begins" />
          <button style={s.moveBtn} onClick={() => move(i, -1)}>↑</button>
          <button style={s.moveBtn} onClick={() => move(i, 1)}>↓</button>
          <button style={s.removeBtn} onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button style={s.addBtn} onClick={add}>+ Add Program Item</button>
    </div>
  );
}

// ── Tab Nav ───────────────────────────────────────────────────────────────────
function TabNav({ active, onChange }) {
  const tabs = [
    { id: "rsvp", label: "💌 RSVPs" },
    { id: "theme", label: "🎨 Theme" },
    { id: "settings", label: "⚙️ Settings" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ padding: "10px 22px", borderRadius: 30, border: "1.5px solid", borderColor: active === t.id ? "#5c2d1e" : "#e0d0c0", background: active === t.id ? "#5c2d1e" : "#fffdf7", color: active === t.id ? "#fff" : "#a07050", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", fontStyle: active === t.id ? "italic" : "normal", transition: "all 0.2s" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState("rsvp");
  const [wedding, setWedding] = useState(DEFAULT_STATE);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wedding_config") || "{}");
    setWedding(prev => ({
      ...prev, ...data,
      themeId: data.themeId || DEFAULT_THEME_ID,
      story: data.story?.length ? data.story : prev.story,
      photos: data.photos?.length ? data.photos : prev.photos,
      program: data.program?.length ? data.program : prev.program,
    }));
  }, []);

  const handleChange = (e) => setWedding(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const setTheme = (themeId) => setWedding(prev => ({ ...prev, themeId }));
  const setStory = (story) => setWedding(prev => ({ ...prev, story }));
  const setPhotos = (updater) => setWedding(prev => ({ ...prev, photos: typeof updater === "function" ? updater(prev.photos) : updater }));
  const setProgram = (program) => setWedding(prev => ({ ...prev, program }));

  const handleSave = () => {
    localStorage.setItem("wedding_config", JSON.stringify(wedding));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: 700, margin: "0 auto", fontFamily: "Georgia, serif", background: "#fdf6ee", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, color: "#5c2d1e", fontStyle: "italic", margin: "0 0 6px" }}>Admin Dashboard</h1>
        <p style={{ color: "#b08060", fontSize: 13, margin: 0 }}>Manage your wedding invite and track guest responses.</p>
      </div>

      <TabNav active={tab} onChange={setTab} />

      {tab === "rsvp" && <RSVPDashboard />}

      {tab === "theme" && (
        <>
          <ThemeSwitcher currentThemeId={wedding.themeId} onChange={setTheme} />
          <button onClick={handleSave} style={{ ...s.saveBtn, background: savedMsg ? "#4a7c4e" : "#5c2d1e" }}>
            {savedMsg ? "✓ Theme Saved!" : "Save Theme"}
          </button>
          {savedMsg && <p style={{ textAlign: "center", color: "#5c2d1e", fontSize: 13, marginTop: 10, fontStyle: "italic" }}>Refresh the invite page to see the new theme.</p>}
        </>
      )}

      {tab === "settings" && (
        <>
          <div style={s.section}>
            <SectionHeader title="Basic Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={s.label}>Bride's Name</label><input style={s.input} name="bride" value={wedding.bride} onChange={handleChange} placeholder="Isabella Santos" /></div>
              <div><label style={s.label}>Groom's Name</label><input style={s.input} name="groom" value={wedding.groom} onChange={handleChange} placeholder="Marco Reyes" /></div>
              <div><label style={s.label}>Wedding Date</label><input style={s.input} name="date" value={wedding.date} onChange={handleChange} type="date" /></div>
              <div><label style={s.label}>Time (24h format)</label><input style={s.input} name="time" value={wedding.time} onChange={handleChange} placeholder="16:00" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={s.label}>Venue Name</label><input style={s.input} name="venue" value={wedding.venue} onChange={handleChange} placeholder="The Grand Rose Garden" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={s.label}>Address</label><input style={s.input} name="address" value={wedding.address} onChange={handleChange} placeholder="123 Blossom Lane, Tagaytay City, Cavite" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={s.label}>Dress Code</label><input style={s.input} name="dressCode" value={wedding.dressCode} onChange={handleChange} placeholder="Formal Attire — Dusty Rose & Sage" /></div>
            </div>
          </div>
          <StoryEditor story={wedding.story} onChange={setStory} />
          <GalleryEditor photos={wedding.photos} onChange={setPhotos} />
          <ProgramEditor program={wedding.program} onChange={setProgram} />
          <button onClick={handleSave} style={{ ...s.saveBtn, background: savedMsg ? "#4a7c4e" : "#5c2d1e" }}>
            {savedMsg ? "✓ Saved Successfully!" : "Save All Changes"}
          </button>
          {savedMsg && <p style={{ textAlign: "center", color: "#5c2d1e", fontSize: 13, marginTop: 10, fontStyle: "italic" }}>Refresh the invite page to see your updates.</p>}
        </>
      )}
    </div>
  );
}