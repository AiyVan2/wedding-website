import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Defaults (shown when admin hasn't saved anything yet) ──────────────────
const DEFAULTS = {
  bride: "Isabella Santos",
  groom: "Marco Reyes",
  date: new Date("2026-03-30T16:00:00"),
  dateLabel: "March 30, 2026",
  day: "Saturday",
  time: "Four o'clock in the afternoon",
  venue: "The Grand Rose Garden",
  address: "123 Blossom Lane, Tagaytay City, Cavite",
  mapsUrl: "https://maps.google.com/?q=Tagaytay+City+Cavite+Philippines",
  dressCode: "Formal Attire — Dusty Rose & Sage",
  program: [
    { time: "3:30 PM", event: "Guest arrival & seating" },
    { time: "4:00 PM", event: "Ceremony begins" },
    { time: "4:45 PM", event: "Exchange of vows & rings" },
    { time: "5:00 PM", event: "Cocktail hour" },
    { time: "6:30 PM", event: "Reception dinner" },
    { time: "8:00 PM", event: "First dance & program" },
    { time: "10:00 PM", event: "Send-off & farewell" },
  ],
  story: [
    { year: "2018", label: "First met", text: "A rainy Tuesday at a mutual friend's party. Marco spilled coffee on Isabella's book — she laughed instead of being mad." },
    { year: "2020", label: "First date", text: "A picnic in the park that turned into a four-hour conversation about everything and nothing." },
    { year: "2022", label: "Moved in", text: "A tiny apartment, two cats, and the realization that home isn't a place — it's a person." },
    { year: "2024", label: "He proposed", text: "On the same rainy Tuesday six years later, in the same spot where coffee was spilled and a love story began." },
  ],
  photos: [
    { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80", caption: "Our first trip together" },
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80", caption: "The proposal" },
    { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80", caption: "Pre-wedding shoot" },
    { url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80", caption: "Just us" },
    { url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80", caption: "Our families" },
    { url: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400&q=80", caption: "Forever starts here" },
  ],
};

function buildWedding() {
  const saved = JSON.parse(localStorage.getItem("wedding_config") || "{}");

  let parsedDate = DEFAULTS.date;
  let dateLabel = DEFAULTS.dateLabel;
  let day = DEFAULTS.day;

  if (saved.date) {
    const timeStr = saved.time ? saved.time : "16:00";
    parsedDate = new Date(`${saved.date}T${timeStr}:00`);
    dateLabel = parsedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    day = parsedDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  return {
    ...DEFAULTS,
    bride: saved.bride || DEFAULTS.bride,
    groom: saved.groom || DEFAULTS.groom,
    date: parsedDate,
    dateLabel,
    day,
    time: saved.time || DEFAULTS.time,
    venue: saved.venue || DEFAULTS.venue,
    address: saved.address || DEFAULTS.address,
    dressCode: saved.dressCode || DEFAULTS.dressCode,
    story: saved.story?.length ? saved.story : DEFAULTS.story,
    photos: saved.photos?.length ? saved.photos : DEFAULTS.photos,
    program: saved.program?.length ? saved.program : DEFAULTS.program,
  };
}

// ── Hooks & Helpers ───────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = targetDate - new Date();
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

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};

const Petal = ({ style }) => (
  <div style={{
    position: "absolute", width: 10, height: 16,
    borderRadius: "50% 50% 50% 0", background: style.color,
    opacity: 0.7, transform: `rotate(${style.rot}deg)`,
    left: style.left, top: style.top, pointerEvents: "none",
    animation: `fall ${style.dur}s ease ${style.delay}s infinite`,
  }} />
);

// ── Pages ─────────────────────────────────────────────────────────────────────

function EnvelopePage({ onNext }) {
  const [open, setOpen] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleEnvClick = (e) => {
    if (e.target.closest("[data-viewbtn]")) return;
    if (!open) {
      setOpen(true);
      setLifting(true);
      setTimeout(() => setRevealed(true), 850);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 24, padding: 32, background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 4, color: "#c9956b", textTransform: "uppercase" }}>
        {open ? (revealed ? "tap · view details" : "") : "tap envelope to open"}
      </p>
      <div onClick={handleEnvClick} style={{ position: "relative", width: "min(600px, 92vw)", aspectRatio: "600 / 380", cursor: "pointer" }}>
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: "#c8976a", borderRadius: 8, zIndex: 2 }} />
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: "#b5835a", clipPath: "polygon(0% 0%, 0% 100%, 50% 63%)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: "#b5835a", clipPath: "polygon(100% 0%, 100% 100%, 50% 63%)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: "26.3%", left: 0, right: 0, bottom: 0, background: "#d4a574", clipPath: "polygon(0% 100%, 100% 100%, 50% 63%)", zIndex: 2 }} />
        <motion.div
          animate={{ y: open ? "-115%" : "0%" }}
          transition={{ duration: 0.85, ease: [0.34, 1.1, 0.64, 1] }}
          style={{ position: "absolute", bottom: "9%", left: "6%", width: "88%", height: "56%", background: "#fffdf7", borderRadius: 8, border: "0.5px solid #e8d5b0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, zIndex: lifting ? 4 : 1, pointerEvents: "none", boxShadow: "0 2px 16px rgba(92,45,30,0.08)" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, letterSpacing: 3, color: "#c9956b", textTransform: "uppercase" }}>you are cordially invited</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,3.5vw,30px)", color: "#5c2d1e", fontStyle: "italic" }}>You are Invited!</span>
          <div style={{ width: 48, height: 1, background: "#e8d5b0" }} />
          <span style={{ fontSize: 11, color: "#a07850", letterSpacing: 1 }}>to celebrate a wedding</span>
          {revealed && (
            <motion.button data-viewbtn="true" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={onNext}
              style={{ marginTop: 6, padding: "9px 26px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 24, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", pointerEvents: "all" }}>
              View Details
            </motion.button>
          )}
        </motion.div>
        <motion.div
          animate={{ rotateX: open ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: "73.7%", background: "#e76f51", clipPath: "polygon(0% 35.7%, 100% 35.7%, 50% 100%)", transformOrigin: "50% 35.7%", zIndex: lifting ? 1 : 3 }}
        />
      </div>
    </motion.div>
  );
}

function CoverPage({ onNext, wedding }) {
  const petals = Array.from({ length: 16 }, (_, i) => ({
    color: ["#e76f51","#f4a261","#e9c46a","#d4a574"][i % 4],
    rot: Math.random() * 360, left: `${Math.random() * 100}%`,
    top: `${-10 - Math.random() * 10}%`,
    dur: 4 + Math.random() * 3, delay: Math.random() * 4,
  }));
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 32, position: "relative", overflow: "hidden", background: "#fdf6ee" }}>
      <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:0.7}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {petals.map((p, i) => <Petal key={i} style={p} />)}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 20 }}>the wedding of</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,8vw,72px)", color: "#5c2d1e", fontStyle: "italic", lineHeight: 1.1, marginBottom: 8 }}>{wedding.bride}</h1>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,5vw,40px)", color: "#c9956b", marginBottom: 8 }}>&amp;</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,8vw,72px)", color: "#5c2d1e", fontStyle: "italic", lineHeight: 1.1, marginBottom: 32 }}>{wedding.groom}</h1>
        <div style={{ width: 60, height: 1, background: "#e8d5b0", margin: "0 auto 24px" }} />
        <p style={{ fontSize: 12, letterSpacing: 3, color: "#a07850", textTransform: "uppercase", marginBottom: 40 }}>{wedding.dateLabel} · {wedding.day}</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
          style={{ padding: "14px 40px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
          Open Invitation
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function DateTimePage({ onNext, wedding }) {
  const { d, h, m, s } = useCountdown(wedding.date);
  const CountBox = ({ val, label }) => (
    <div style={{ textAlign: "center", minWidth: 64 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,8vw,56px)", color: "#5c2d1e", fontWeight: 500, lineHeight: 1 }}>{String(val).padStart(2, "0")}</div>
      <div style={{ fontSize: 10, letterSpacing: 3, color: "#c9956b", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
    </div>
  );
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 24 }}>save the date</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,10vw,80px)", color: "#5c2d1e", fontStyle: "italic", lineHeight: 1, marginBottom: 12 }}>{wedding.dateLabel}</h2>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,4vw,24px)", color: "#a07850", marginBottom: 4 }}>{wedding.day}</p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(14px,3vw,20px)", color: "#c9956b", fontStyle: "italic", marginBottom: 48 }}>{wedding.time}</p>
      <div style={{ width: 60, height: 1, background: "#e8d5b0", marginBottom: 32 }} />
      <p style={{ fontSize: 10, letterSpacing: 4, color: "#c9956b", textTransform: "uppercase", marginBottom: 20 }}>counting down</p>
      <div style={{ display: "flex", gap: "clamp(16px,4vw,40px)", alignItems: "center", marginBottom: 48 }}>
        <CountBox val={d} label="days" />
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#e8d5b0", marginBottom: 16 }}>:</span>
        <CountBox val={h} label="hours" />
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#e8d5b0", marginBottom: 16 }}>:</span>
        <CountBox val={m} label="mins" />
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#e8d5b0", marginBottom: 16 }}>:</span>
        <CountBox val={s} label="secs" />
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function VenuePage({ onNext, wedding }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 24 }}>where to find us</p>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📍</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,48px)", color: "#5c2d1e", fontStyle: "italic", marginBottom: 8 }}>{wedding.venue}</h2>
      <p style={{ fontSize: 14, color: "#a07850", lineHeight: 1.8, marginBottom: 32 }}>{wedding.address}</p>
      <div style={{ width: "min(480px,90vw)", borderRadius: 12, overflow: "hidden", border: "0.5px solid #e8d5b0", marginBottom: 24, height: 220 }}>
        <iframe title="venue map" width="100%" height="220" style={{ border: 0, display: "block" }} loading="lazy"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Tagaytay+City,Cavite,Philippines" />
      </div>
      <motion.a href={wedding.mapsUrl} target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        style={{ display: "inline-block", padding: "12px 32px", border: "1px solid #5c2d1e", color: "#5c2d1e", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", marginBottom: 40 }}>
        View on Google Maps
      </motion.a>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function StoryPage({ onNext, wedding }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 600, margin: "0 auto", textAlign: "center", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 12 }}>our story</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: "#5c2d1e", fontStyle: "italic", marginBottom: 40 }}>How it all began</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%", marginBottom: 40 }}>
        {wedding.story.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
            style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 32, textAlign: "left" }}>
            <div style={{ minWidth: 56, textAlign: "right" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#c9956b", fontStyle: "italic" }}>{item.year}</div>
            </div>
            <div style={{ width: 1, background: "#e8d5b0", minHeight: 60, marginTop: 6, flexShrink: 0, position: "relative" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9956b", position: "absolute", left: -3.5, top: 6 }} />
            </div>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "#5c2d1e", fontWeight: 500, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: "#a07850", lineHeight: 1.7 }}>{item.text}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function GalleryPage({ onNext, wedding }) {
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  const handleScroll = () => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollLeft / ref.current.offsetWidth);
    setActive(idx);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 0", textAlign: "center", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 12, padding: "0 24px" }}>memories</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: "#5c2d1e", fontStyle: "italic", marginBottom: 32, padding: "0 24px" }}>Our Gallery</h2>
      <div ref={ref} onScroll={handleScroll}
        style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: 16, width: "100%", paddingBottom: 8, paddingLeft: 24, paddingRight: 24, scrollbarWidth: "none" }}>
        {wedding.photos.map((p, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }}
            style={{ flexShrink: 0, width: "min(340px,80vw)", scrollSnapAlign: "center", borderRadius: 12, overflow: "hidden", border: "0.5px solid #e8d5b0", position: "relative" }}>
            <img src={p.url} alt={p.caption} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "12px 16px", background: "#fffdf7" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: "#5c2d1e", fontStyle: "italic" }}>{p.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 20, marginBottom: 32 }}>
        {wedding.photos.map((_, i) => (
          <div key={i} style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 3, background: i === active ? "#5c2d1e" : "#e8d5b0", transition: "all 0.3s" }} />
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function DetailsPage({ onNext, wedding }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 560, margin: "0 auto", textAlign: "center", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 12 }}>the details</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: "#5c2d1e", fontStyle: "italic", marginBottom: 32 }}>Program &amp; Dress Code</h2>
      <div style={{ background: "#fffdf7", border: "0.5px solid #e8d5b0", borderRadius: 12, padding: "20px 24px", width: "100%", marginBottom: 24, textAlign: "left" }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#c9956b", textTransform: "uppercase", marginBottom: 12 }}>👗 Dress code</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "#5c2d1e", fontStyle: "italic" }}>{wedding.dressCode}</p>
      </div>
      <div style={{ background: "#fffdf7", border: "0.5px solid #e8d5b0", borderRadius: 12, padding: "20px 24px", width: "100%", marginBottom: 40 }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#c9956b", textTransform: "uppercase", marginBottom: 16 }}>⛪ Program</p>
        {wedding.program.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < wedding.program.length - 1 ? "0.5px solid #f0e6d3" : "none" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: "#c9956b", minWidth: 64 }}>{item.time}</span>
            <span style={{ fontSize: 13, color: "#5c2d1e", textAlign: "right" }}>{item.event}</span>
          </div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        RSVP Now
      </motion.button>
    </motion.div>
  );
}

function RSVPPage({ onNext }) {
  const [form, setForm] = useState({ name: "", attend: null, guests: 1, note: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || form.attend === null) return;
    const existing = JSON.parse(localStorage.getItem("rsvps") || "[]");
    existing.push(form);
    localStorage.setItem("rsvps", JSON.stringify(existing));
    setSubmitted(true);
    setTimeout(onNext, 2000);
  };

  if (submitted) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 32, background: "#fdf6ee" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: "#5c2d1e", fontStyle: "italic", marginBottom: 8 }}>See you there!</h2>
          <p style={{ fontSize: 13, color: "#a07850" }}>Your RSVP has been received.</p>
        </motion.div>
      </motion.div>
    );
  }

  const inputStyle = { width: "100%", padding: "12px 16px", border: "0.5px solid #e8d5b0", borderRadius: 8, background: "#fffdf7", fontSize: 14, color: "#5c2d1e", outline: "none", fontFamily: "inherit" };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 480, margin: "0 auto", textAlign: "center", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 12 }}>kindly reply</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: "#5c2d1e", fontStyle: "italic", marginBottom: 32 }}>Will you join us?</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", marginBottom: 24 }}>
        <input style={inputStyle} placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <div style={{ display: "flex", gap: 12 }}>
          {["Joyfully accepts", "Regretfully declines"].map((label, i) => (
            <button key={i} onClick={() => setForm({ ...form, attend: i === 0 })}
              style={{ flex: 1, padding: "12px 8px", border: `1.5px solid ${form.attend === (i === 0) && form.attend !== null ? "#5c2d1e" : "#e8d5b0"}`, borderRadius: 8, background: form.attend === (i === 0) && form.attend !== null ? "#5c2d1e" : "#fffdf7", color: form.attend === (i === 0) && form.attend !== null ? "#fffdf7" : "#a07850", fontSize: 12, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>
              {label}
            </button>
          ))}
        </div>
        {form.attend && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fffdf7", border: "0.5px solid #e8d5b0", borderRadius: 8, padding: "10px 16px" }}>
              <span style={{ fontSize: 13, color: "#a07850", flex: 1 }}>Number of guests</span>
              <button onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })} style={{ width: 28, height: 28, border: "0.5px solid #e8d5b0", borderRadius: "50%", background: "none", cursor: "pointer", color: "#5c2d1e", fontSize: 16 }}>−</button>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#5c2d1e", minWidth: 24, textAlign: "center" }}>{form.guests}</span>
              <button onClick={() => setForm({ ...form, guests: Math.min(10, form.guests + 1) })} style={{ width: 28, height: 28, border: "0.5px solid #e8d5b0", borderRadius: "50%", background: "none", cursor: "pointer", color: "#5c2d1e", fontSize: 16 }}>+</button>
            </div>
          </motion.div>
        )}
        <textarea style={{ ...inputStyle, resize: "none", height: 80 }} placeholder="A note for the couple (optional)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
        style={{ padding: "14px 48px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", opacity: form.name && form.attend !== null ? 1 : 0.5 }}>
        Send RSVP
      </motion.button>
    </motion.div>
  );
}

function GiftPage({ onNext }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 480, margin: "0 auto", textAlign: "center", background: "#fdf6ee" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 12 }}>with gratitude</p>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,44px)", color: "#5c2d1e", fontStyle: "italic", marginBottom: 16 }}>Your presence is the greatest gift</h2>
      <p style={{ fontSize: 14, color: "#a07850", lineHeight: 1.8, marginBottom: 32 }}>
        Your love and presence at our celebration is more than enough.<br />
        But if you wish to bless us further, we've made it easy:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginBottom: 40 }}>
        {[{ label: "GCash", value: "09XX-XXX-XXXX" }, { label: "BDO Account", value: "0012-3456-7890" }].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "#fffdf7", border: "0.5px solid #e8d5b0", borderRadius: 10 }}>
            <span style={{ fontSize: 12, letterSpacing: 2, color: "#c9956b", textTransform: "uppercase" }}>{item.label}</span>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "#5c2d1e" }}>{item.value}</span>
          </div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{ padding: "14px 40px", background: "#5c2d1e", color: "#fffdf7", border: "none", borderRadius: 40, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
        Continue
      </motion.button>
    </motion.div>
  );
}

function ThankYouPage({ wedding }) {
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`, delay: Math.random() * 3, dur: 3 + Math.random() * 2,
  }));
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40, textAlign: "center", position: "relative", overflow: "hidden", background: "#fdf6ee" }}>
      <style>{`@keyframes rise{0%{transform:translateY(0) scale(1);opacity:0.6}100%{transform:translateY(-110vh) scale(0.5);opacity:0}}`}</style>
      {hearts.map((h, i) => (
        <div key={i} style={{ position: "absolute", left: h.left, bottom: "-5%", fontSize: 20, animation: `rise ${h.dur}s ease ${h.delay}s infinite`, pointerEvents: "none" }}>♡</div>
      ))}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 5, color: "#c9956b", textTransform: "uppercase", marginBottom: 24 }}>from our hearts</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,8vw,64px)", color: "#5c2d1e", fontStyle: "italic", lineHeight: 1.2, marginBottom: 24 }}>
          We can't wait to<br />celebrate with you
        </h1>
        <div style={{ width: 60, height: 1, background: "#e8d5b0", margin: "0 auto 24px" }} />
        <p style={{ fontSize: 14, color: "#a07850", lineHeight: 1.8, maxWidth: 360, margin: "0 auto 40px" }}>
          Thank you for being a part of our story.<br />
          See you on <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: "#5c2d1e" }}>{wedding.dateLabel}</span>.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,5vw,36px)", color: "#c9956b", fontStyle: "italic" }}>
          {wedding.bride} &amp; {wedding.groom}
        </p>
        <div style={{ marginTop: 32, fontSize: 28, letterSpacing: 8 }}>♡ ♡ ♡</div>
      </motion.div>
    </motion.div>
  );
}

// ── Nav Dots ──────────────────────────────────────────────────────────────────
const PAGE_LABELS = ["Envelope", "Cover", "Date", "Venue", "Story", "Gallery", "Details", "RSVP", "Gift", "Thank You"];

function NavDots({ current, total }) {
  return (
    <div style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 100 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} title={PAGE_LABELS[i]} style={{ width: i === current ? 8 : 5, height: i === current ? 8 : 5, borderRadius: "50%", background: i === current ? "#5c2d1e" : "#e8d5b0", transition: "all 0.3s" }} />
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
const PAGES = [EnvelopePage, CoverPage, DateTimePage, VenuePage, StoryPage, GalleryPage, DetailsPage, RSVPPage, GiftPage, ThankYouPage];

export default function WeddingInvite() {
  const [page, setPage] = useState(0);
  const wedding = buildWedding();
  const next = () => setPage(p => Math.min(p + 1, PAGES.length - 1));
  const Page = PAGES[page];

  return (
    <div style={{ background: "#fdf6ee", minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{`html,body,#root{background:#fdf6ee!important;margin:0;padding:0;}*{box-sizing:border-box;}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
      <NavDots current={page} total={PAGES.length} />
      <AnimatePresence mode="wait">
        <Page key={page} onNext={next} wedding={wedding} />
      </AnimatePresence>
    </div>
  );
}