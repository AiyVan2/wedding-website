import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseclient";

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = {
  "dusty-rose": {
    bg: "#fdf6ee", cardBg: "#fffdf7", primary: "#5c2d1e", accent: "#c9956b",
    accentLight: "#e8d5b0", text: "#a07850", textDark: "#5c2d1e",
    envelopeBody: "#c8976a", envelopeSide: "#b5835a", envelopeBottom: "#d4a574",
    envelopeFlap: "#e76f51", petalColors: ["#e76f51", "#f4a261", "#e9c46a", "#d4a574"],
  },
  "midnight-gold": {
    bg: "#0f1b2d", cardBg: "#162236", primary: "#d4af37", accent: "#c9a227",
    accentLight: "#2a3f5f", text: "#8fa8c8", textDark: "#e8d8a0",
    envelopeBody: "#1e3a5f", envelopeSide: "#163050", envelopeBottom: "#254875",
    envelopeFlap: "#d4af37", petalColors: ["#d4af37", "#f0d060", "#c9a227", "#e8c840"],
  },
  "sage-garden": {
    bg: "#f2f5f0", cardBg: "#f8fbf7", primary: "#2d4a35", accent: "#7a9e7e",
    accentLight: "#c8dfc8", text: "#5a7a5e", textDark: "#2d4a35",
    envelopeBody: "#7a9e7e", envelopeSide: "#6a8e6e", envelopeBottom: "#9ab89e",
    envelopeFlap: "#4a7a50", petalColors: ["#7a9e7e", "#a8c8a8", "#5a8e60", "#c8dfc8"],
  },
  "blush-cream": {
    bg: "#fdf0f0", cardBg: "#fff8f8", primary: "#7a3050", accent: "#e8a0b0",
    accentLight: "#f5d5df", text: "#b07080", textDark: "#7a3050",
    envelopeBody: "#e8a0b0", envelopeSide: "#d88898", envelopeBottom: "#f0b8c8",
    envelopeFlap: "#c07090", petalColors: ["#e8a0b0", "#f5c0d0", "#c07090", "#f0d0d8"],
  },

  // ── NEW ──────────────────────────────────────────────────────────────────
  "lavender-mist": {
    bg: "#f5f3fb", cardBg: "#faf8ff", primary: "#4a2d7a", accent: "#9b7ec8",
    accentLight: "#d8cef0", text: "#7a6a9a", textDark: "#4a2d7a",
    envelopeBody: "#9b7ec8", envelopeSide: "#8a6ab8", envelopeBottom: "#b09ed8",
    envelopeFlap: "#6a4aa0", petalColors: ["#9b7ec8", "#c0a8e8", "#7a5ab0", "#d8cef0"],
  },
  "obsidian-pearl": {
    bg: "#f8f6f2", cardBg: "#fffefb", primary: "#1a1a1a", accent: "#8a7a6a",
    accentLight: "#d8d0c8", text: "#6a6058", textDark: "#1a1a1a",
    envelopeBody: "#8a7a6a", envelopeSide: "#7a6a5a", envelopeBottom: "#a09080",
    envelopeFlap: "#3a3530", petalColors: ["#8a7a6a", "#b0a090", "#5a5048", "#d8d0c8"],
  },
};


const DEFAULT_THEME = THEMES["dusty-rose"];

// ── Fallback defaults ─────────────────────────────────────────────────────────
const DEFAULTS = {
  bride: "The Bride",
  groom: "The Groom",
  dateLabel: "",
  day: "",
  time: "",
  venue: "",
  address: "",
  dressCode: "",
  mapsUrl: "https://maps.google.com",
  story: [],
  photos: [],
  program: [],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function formatDay(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
}
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${suffix}`;
}
function buildMapsUrl(address) {
  if (!address) return "https://maps.google.com";
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

// ── Countdown Hook ────────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!targetDate) return;
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// ── Animation ─────────────────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};

const Petal = ({ style, color }) => (
  <div style={{
    position: "absolute", width: 10, height: 16,
    borderRadius: "50% 50% 50% 0", background: color,
    opacity: 0.7, transform: `rotate(${style.rot}deg)`,
    left: style.left, top: style.top, pointerEvents: "none",
    animation: `fall ${style.dur}s ease ${style.delay}s infinite`,
  }} />
);

// ── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#fdf6ee" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 16, animation: "pulse 1.5s ease infinite" }}>♡</div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "#c9956b", fontStyle: "italic", letterSpacing: 2 }}>
          Loading your invitation...
        </p>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}}`}</style>
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────

function EnvelopePage({ onNext, wedding }) {
  const { theme } = wedding;
  const [open, setOpen] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleEnvClick = (e) => {
    if (e.target.closest("[data-viewbtn]")) return;
    if (!open) { setOpen(true); setLifting(true); setTimeout(() => setRevealed(true), 850); }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 24, padding: 32, background: theme.bg }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 4, color: theme.accent, textTransform: "uppercase" }}>
        {open ? (revealed ? "tap · view details" : "") : "tap envelope to open"}
      </p>
      <div onClick={handleEnvClick} style={{ position: "relative", width: "min(600px, 92vw)", aspectRatio: "600 / 380", cursor: "pointer" }}>
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: theme.envelopeBody, borderRadius: 8, zIndex: 2 }} />
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: theme.envelopeSide, clipPath: "polygon(0% 0%, 0% 100%, 50% 63%)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: theme.envelopeSide, clipPath: "polygon(100% 0%, 100% 100%, 50% 63%)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: theme.envelopeBottom, clipPath: "polygon(0% 100%, 100% 100%, 50% 63%)", zIndex: 2 }} />
        <motion.div
          animate={{ y: open ? "-115%" : "0%" }}
          transition={{ duration: 0.85, ease: [0.34, 1.1, 0.64, 1] }}
          style={{ position: "absolute", bottom: "9%", left: "6%", width: "88%", height: "56%", background: theme.cardBg, borderRadius: 8, border: `0.5px solid ${theme.accentLight}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, zIndex: lifting ? 4 : 1, pointerEvents: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, letterSpacing: 3, color: theme.accent, textTransform: "uppercase" }}>you are cordially invited</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,3.5vw,30px)", color: theme.primary, fontStyle: "italic" }}>You are Invited!</span>
          <div style={{ width: 48, height: 1, background: theme.accentLight }} />
          <span style={{ fontSize: 11, color: theme.text, letterSpacing: 1 }}>to celebrate a wedding</span>
          {revealed && (
            <motion.button data-viewbtn="true" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={onNext}
              style={{ marginTop: 6, padding: "9px 26px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 24, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", pointerEvents: "all" }}>
              View Details
            </motion.button>
          )}
        </motion.div>
        <motion.div
          animate={{ rotateX: open ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: "73.7%", background: theme.envelopeFlap, clipPath: "polygon(0% 35.7%, 100% 35.7%, 50% 100%)", transformOrigin: "50% 35.7%", zIndex: lifting ? 1 : 3 }}
        />
      </div>
    </motion.div>
  );
}

function CoverPage({ onNext, wedding }) {
  const { theme } = wedding;
  const petals = Array.from({ length: 16 }, (_, i) => ({
    color: theme.petalColors[i % theme.petalColors.length],
    rot: Math.random() * 360, left: `${Math.random() * 100}%`,
    top: `${-10 - Math.random() * 10}%`,
    dur: 4 + Math.random() * 3, delay: Math.random() * 4,
  }));
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 32, position: "relative", overflow: "hidden", background: theme.bg }}>
      <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:0.7}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {petals.map((p, i) => <Petal key={i} style={p} color={p.color} />)}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 20 }}>the wedding of</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,8vw,72px)", color: theme.primary, fontStyle: "italic", lineHeight: 1.1, marginBottom: 8 }}>{wedding.bride}</h1>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,5vw,40px)", color: theme.accent, marginBottom: 8 }}>&amp;</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,8vw,72px)", color: theme.primary, fontStyle: "italic", lineHeight: 1.1, marginBottom: 32 }}>{wedding.groom}</h1>
        <div style={{ width: 60, height: 1, background: theme.accentLight, margin: "0 auto 24px" }} />
        <p style={{ fontSize: 12, letterSpacing: 3, color: theme.text, textTransform: "uppercase", marginBottom: 40 }}>
          {wedding.dateLabel} {wedding.day ? `· ${wedding.day}` : ""}
        </p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
          style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
          Open Invitation
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function DateTimePage({ onNext, wedding }) {
  const { theme } = wedding;
  const { d, h, m, s } = useCountdown(wedding.rawDate);
  const CountBox = ({ val, label }) => (
    <div style={{ textAlign: "center", minWidth: 64 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,8vw,56px)", color: theme.primary, fontWeight: 500, lineHeight: 1 }}>{String(val ?? 0).padStart(2, "0")}</div>
      <div style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
    </div>
  );
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center", background: theme.bg }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 24 }}>save the date</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,10vw,80px)", color: theme.primary, fontStyle: "italic", lineHeight: 1, marginBottom: 12 }}>{wedding.dateLabel}</h2>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,4vw,24px)", color: theme.text, marginBottom: 4 }}>{wedding.day}</p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(14px,3vw,20px)", color: theme.accent, fontStyle: "italic", marginBottom: 48 }}>{wedding.time}</p>
      <div style={{ width: 60, height: 1, background: theme.accentLight, marginBottom: 32 }} />
      <p style={{ fontSize: 10, letterSpacing: 4, color: theme.accent, textTransform: "uppercase", marginBottom: 20 }}>counting down</p>
      <div style={{ display: "flex", gap: "clamp(16px,4vw,40px)", alignItems: "center", marginBottom: 48 }}>
        <CountBox val={d} label="days" />
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: theme.accentLight, marginBottom: 16 }}>:</span>
        <CountBox val={h} label="hours" />
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: theme.accentLight, marginBottom: 16 }}>:</span>
        <CountBox val={m} label="mins" />
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: theme.accentLight, marginBottom: 16 }}>:</span>
        <CountBox val={s} label="secs" />
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function VenuePage({ onNext, wedding }) {
  const { theme } = wedding;
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center", background: theme.bg }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 24 }}>where to find us</p>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📍</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,48px)", color: theme.primary, fontStyle: "italic", marginBottom: 8 }}>{wedding.venue}</h2>
      <p style={{ fontSize: 14, color: theme.text, lineHeight: 1.8, marginBottom: 32 }}>{wedding.address}</p>
      <div style={{ width: "min(480px,90vw)", borderRadius: 12, overflow: "hidden", border: `0.5px solid ${theme.accentLight}`, marginBottom: 24, height: 220 }}>
        <iframe
          title="venue map" width="100%" height="220"
          style={{ border: 0, display: "block" }} loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodeURIComponent(wedding.address || "Philippines")}`}
        />
      </div>
      <motion.a href={wedding.mapsUrl} target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        style={{ display: "inline-block", padding: "12px 32px", border: `1px solid ${theme.primary}`, color: theme.primary, borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", marginBottom: 40 }}>
        View on Google Maps
      </motion.a>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function StoryPage({ onNext, wedding }) {
  const { theme } = wedding;
  if (!wedding.story?.length) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center", background: theme.bg }}>
        <p style={{ color: theme.text, fontStyle: "italic", marginBottom: 32 }}>No story milestones added yet.</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
          style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
          Continue
        </motion.button>
      </motion.div>
    );
  }
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 600, margin: "0 auto", textAlign: "center", background: theme.bg }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 12 }}>our story</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: theme.primary, fontStyle: "italic", marginBottom: 40 }}>How it all began</h2>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: 40 }}>
        {wedding.story.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
            style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 32, textAlign: "left" }}>
            {/* ── Date column ── */}
            <div style={{ minWidth: 120, textAlign: "right" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, color: theme.accent, fontStyle: "italic", lineHeight: 1.4 }}>
                {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            {/* ── Timeline line + dot ── */}
            <div style={{ width: 1, background: theme.accentLight, minHeight: 60, marginTop: 6, flexShrink: 0, position: "relative" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, position: "absolute", left: -3.5, top: 6 }} />
            </div>
            {/* ── Description ── */}
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.7 }}>{item.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function GalleryPage({ onNext, wedding }) {
  const { theme } = wedding;
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const handleScroll = () => {
    if (!ref.current) return;
    setActive(Math.round(ref.current.scrollLeft / ref.current.offsetWidth));
  };
  if (!wedding.photos?.length) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center", background: theme.bg }}>
        <p style={{ color: theme.text, fontStyle: "italic", marginBottom: 32 }}>No gallery photos added yet.</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
          style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
          Continue
        </motion.button>
      </motion.div>
    );
  }
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 0", textAlign: "center", background: theme.bg }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 12, padding: "0 24px" }}>memories</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: theme.primary, fontStyle: "italic", marginBottom: 32, padding: "0 24px" }}>Our Gallery</h2>
      <div ref={ref} onScroll={handleScroll}
        style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: 16, width: "100%", paddingBottom: 8, paddingLeft: 24, paddingRight: 24, scrollbarWidth: "none" }}>
        {wedding.photos.map((p, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }}
            style={{ flexShrink: 0, width: "min(340px,80vw)", scrollSnapAlign: "center", borderRadius: 12, overflow: "hidden", border: `0.5px solid ${theme.accentLight}` }}>
            <img src={p.url} alt={p.caption} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "12px 16px", background: theme.cardBg }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: theme.primary, fontStyle: "italic", margin: 0 }}>{p.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 20, marginBottom: 32 }}>
        {wedding.photos.map((_, i) => (
          <div key={i} style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 3, background: i === active ? theme.primary : theme.accentLight, transition: "all 0.3s" }} />
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function DetailsPage({ onNext, wedding }) {
  const { theme } = wedding;
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 560, margin: "0 auto", textAlign: "center", background: theme.bg }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 12 }}>the details</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: theme.primary, fontStyle: "italic", marginBottom: 32 }}>Program &amp; Dress Code</h2>

      {wedding.dressCode && (
        <div style={{ background: theme.cardBg, border: `0.5px solid ${theme.accentLight}`, borderRadius: 12, padding: "20px 24px", width: "100%", marginBottom: 24, textAlign: "left" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, textTransform: "uppercase", marginBottom: 12 }}>👗 Dress Code</p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: theme.primary, fontStyle: "italic", margin: 0 }}>{wedding.dressCode}</p>
        </div>
      )}

      {wedding.program?.length > 0 && (
        <div style={{ background: theme.cardBg, border: `0.5px solid ${theme.accentLight}`, borderRadius: 12, padding: "20px 24px", width: "100%", marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, textTransform: "uppercase", marginBottom: 16 }}>⛪ Program</p>
          {wedding.program.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < wedding.program.length - 1 ? `0.5px solid ${theme.accentLight}` : "none" }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: theme.accent, minWidth: 72, textAlign: "left" }}>
                {item.time}
              </span>
              <span style={{ fontSize: 13, color: theme.primary, textAlign: "right", flex: 1 }}>
                {item.event}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {!wedding.dressCode && !wedding.program?.length && (
        <p style={{ color: theme.text, fontStyle: "italic", marginBottom: 32 }}>No details added yet.</p>
      )}

      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: theme.primary, color: theme.cardBg, border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        RSVP Now
      </motion.button>
    </motion.div>
  );
}

function RSVPPage({ onNext, wedding }) {
  const { theme } = wedding;

  const [form, setForm] = useState({
    name: "",
    attending: null,
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name.trim() || form.attending === null) {
      setError("Please enter your name and select if you're attending.");
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: err } = await supabase.from("rsvp").insert([{
      wedding_id: wedding.id,
      name: form.name.trim(),
      attending: form.attending,
      message: form.message.trim() || null,
    }]);

    if (err) {
      console.error("RSVP Insert Error:", err);
      if (err.message?.includes("row-level security") || err.code === "42501") {
        setError("RSVP submission blocked. Please ask the couple to enable public inserts.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setTimeout(onNext, 2200);
  };

  if (submitted) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 32, background: theme.bg }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: theme.primary, fontStyle: "italic", marginBottom: 8 }}>Thank you!</h2>
          <p style={{ fontSize: 13, color: theme.text }}>Your RSVP has been received.</p>
        </motion.div>
      </motion.div>
    );
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", border: `0.5px solid ${theme.accentLight}`,
    borderRadius: 8, background: theme.cardBg, fontSize: 14,
    color: theme.primary, outline: "none", fontFamily: "inherit",
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 480, margin: "0 auto", textAlign: "center", background: theme.bg }}>

      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 12 }}>kindly reply</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: theme.primary, fontStyle: "italic", marginBottom: 32 }}>Will you join us?</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", marginBottom: 24 }}>
        <input
          style={inputStyle}
          placeholder="Your full name *"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <div style={{ display: "flex", gap: 12 }}>
          {["Joyfully accepts", "Regretfully declines"].map((label, i) => {
            const isSelected = form.attending === (i === 0);
            return (
              <button
                key={i}
                onClick={() => setForm({ ...form, attending: i === 0 })}
                style={{
                  flex: 1, padding: "12px 8px",
                  border: `1.5px solid ${isSelected ? theme.primary : theme.accentLight}`,
                  borderRadius: 8,
                  background: isSelected ? theme.primary : theme.cardBg,
                  color: isSelected ? theme.cardBg : theme.text,
                  fontSize: 12, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit"
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <textarea
          style={{ ...inputStyle, resize: "none", height: 100 }}
          placeholder="A sweet note for the couple (optional)"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {error && <p style={{ color: "#c0392b", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{error}</p>}

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={submitting || !form.name.trim() || form.attending === null}
        style={{
          padding: "14px 48px",
          background: theme.primary,
          color: theme.cardBg,
          border: "none",
          borderRadius: 40,
          fontSize: 12,
          letterSpacing: 3,
          textTransform: "uppercase",
          cursor: "pointer",
          opacity: (form.name.trim() && form.attending !== null && !submitting) ? 1 : 0.6
        }}
      >
        {submitting ? "Sending..." : "Send RSVP"}
      </motion.button>
    </motion.div>
  );
}

function ThankYouPage({ wedding }) {
  const { theme } = wedding;
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`, delay: Math.random() * 3, dur: 3 + Math.random() * 2,
  }));
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40, textAlign: "center", position: "relative", overflow: "hidden", background: theme.bg }}>
      <style>{`@keyframes rise{0%{transform:translateY(0) scale(1);opacity:0.6}100%{transform:translateY(-110vh) scale(0.5);opacity:0}}`}</style>
      {hearts.map((h, i) => (
        <div key={i} style={{ position: "absolute", left: h.left, bottom: "-5%", fontSize: 20, color: theme.accent, animation: `rise ${h.dur}s ease ${h.delay}s infinite`, pointerEvents: "none" }}>♡</div>
      ))}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: theme.accent, textTransform: "uppercase", marginBottom: 24 }}>from our hearts</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,8vw,64px)", color: theme.primary, fontStyle: "italic", lineHeight: 1.2, marginBottom: 24 }}>
          We can't wait to<br />celebrate with you
        </h1>
        <div style={{ width: 60, height: 1, background: theme.accentLight, margin: "0 auto 24px" }} />
        <p style={{ fontSize: 14, color: theme.text, lineHeight: 1.8, maxWidth: 360, margin: "0 auto 40px" }}>
          Thank you for being a part of our story.<br />
          See you on <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: theme.primary }}>{wedding.dateLabel}</span>.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,5vw,36px)", color: theme.accent, fontStyle: "italic" }}>
          {wedding.bride} &amp; {wedding.groom}
        </p>
        <div style={{ marginTop: 32, fontSize: 28, letterSpacing: 8, color: theme.accent }}>♡ ♡ ♡</div>
      </motion.div>
    </motion.div>
  );
}

// ── Nav Dots ──────────────────────────────────────────────────────────────────
const PAGE_LABELS = ["Envelope", "Cover", "Date", "Venue", "Story", "Gallery", "Details", "RSVP", "Thank You"];

function NavDots({ current, total, theme }) {
  return (
    <div style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 100 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} title={PAGE_LABELS[i]} style={{ width: i === current ? 8 : 5, height: i === current ? 8 : 5, borderRadius: "50%", background: i === current ? theme.primary : theme.accentLight, transition: "all 0.3s" }} />
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
const PAGES = [EnvelopePage, CoverPage, DateTimePage, VenuePage, StoryPage, GalleryPage, DetailsPage, RSVPPage, ThankYouPage];

export default function WeddingInvite({ adminId }) {
  const [page, setPage] = useState(0);
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWedding = async () => {
      setLoading(true);
      try {
        const WEDDING_ID = process.env.REACT_APP_WEDDING_ID;

        const { data: w, error: wErr } = await supabase
          .from("weddings")
          .select("*")
          .eq("id", WEDDING_ID)
          .single();

        if (wErr || !w) throw new Error("Wedding not found");

        const theme = THEMES[w.theme_id] || DEFAULT_THEME;
        const dateLabel = formatDateLabel(w.date);
        const day = formatDay(w.date);
        const timeFormatted = formatTime(w.time);
        const mapsUrl = buildMapsUrl(w.address);

        // ── Parse program
        const parseProgram = () => {
          try {
            const p = typeof w.program === "string" ? JSON.parse(w.program) : w.program;
            return Array.isArray(p) ? p : [];
          } catch { return []; }
        };

        // ── Parse milestone
        const parseMilestone = () => {
          try {
            const m = typeof w.milestone === "string" ? JSON.parse(w.milestone) : w.milestone;
            return Array.isArray(m) ? m : [];
          } catch { return []; }
        };

        setWedding({
          id: w.id,
          bride: w.bride || DEFAULTS.bride,
          groom: w.groom || DEFAULTS.groom,
          rawDate: w.date,
          dateLabel: dateLabel || DEFAULTS.dateLabel,
          day: day || DEFAULTS.day,
          time: timeFormatted || DEFAULTS.time,
          venue: w.venue || DEFAULTS.venue,
          address: w.address || DEFAULTS.address,
          dressCode: w.dress_code || DEFAULTS.dressCode,
          mapsUrl,
          story: parseMilestone(),   // ← reads from milestone column
          photos: Array.isArray(w.photos) ? w.photos : [],
          program: parseProgram(),
          theme,
        });
      } catch (err) {
        console.error("WeddingInvite fetch error:", err.message);
      }
      setLoading(false);
    };

    fetchWedding();
  }, []);

  if (loading) return <LoadingScreen />;
  if (!wedding) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "#c9956b", fontStyle: "italic" }}>
        Wedding not found.
      </p>
    </div>
  );

  const next = () => setPage(p => Math.min(p + 1, PAGES.length - 1));
  const Page = PAGES[page];
  const { theme } = wedding;

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{`html,body,#root{background:${theme.bg}!important;margin:0;padding:0;}*{box-sizing:border-box;}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
      <NavDots current={page} total={PAGES.length} theme={theme} />
      <AnimatePresence mode="wait">
        <Page key={page} onNext={next} wedding={wedding} />
      </AnimatePresence>
    </div>
  );
}