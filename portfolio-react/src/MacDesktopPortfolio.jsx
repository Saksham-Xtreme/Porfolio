/**
 * REFACTORED PORTFOLIO — Saksham Tripathi
 * Backend-Focused Full Stack Engineer
 *
 * Architecture: Single-page, section-scroll layout (no fake OS chrome)
 * Stack: React, Tailwind-ish inline CSS design system, Lucide icons
 * Design ref: Linear / Railway engineer portfolio — dark+light adaptive
 *
 * Design tokens live in one object (DS) — change once, updates everywhere.
 * No percentages on skills, no globe, no Finder menu bar, no typewriter effect.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import "./portfolio.css";

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
const DS = {
  // Palette — slate-based, professional
  bg:        "#0f0f0f",
  surface:   "#161616",
  surfaceHi: "#1e1e1e",
  border:    "#262626",
  borderHi:  "#333333",
  text:      "#e5e5e5",
  textMuted: "#737373",
  textDim:   "#404040",
  accent:    "#f97316",   // orange-500 — warm, engineering-credible
  accentDim: "#431407",   // orange-950

  // Type scale
  fontMono:  "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  fontSans:  "'Inter', 'system-ui', sans-serif",

  // Spacing
  gap4:  "4px",
  gap8:  "8px",
  gap12: "12px",
  gap16: "16px",
  gap24: "24px",
  gap32: "32px",
  gap48: "48px",
  gap64: "64px",

  // Radius
  r4:  "4px",
  r8:  "8px",
  r12: "12px",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = ["About", "Projects", "Skills", "Achievements", "Experience", "Contact"];

const PROJECTS = [
  {
    id: "linkup",
    title: "LinkUp",
    subtitle: "Real-Time Video Call & Chat Platform",
    problem: "Users needed peer-to-peer video and persistent messaging without a centralized media server.",
    architecture: "Browser-to-browser WebRTC connection negotiated via a Socket.IO signaling layer on Node.js. Google OAuth issues short-lived JWTs; chat history persists in MongoDB.",
    challenges: [
      "Implementing ICE candidate exchange and SDP offer/answer handling for NAT traversal",
      "Designing stateful Socket.IO rooms to handle mid-call reconnections gracefully",
      "JWT refresh strategy that survives tab re-opens without forcing re-auth",
    ],
    impact: "End-to-end latency under 150ms on local network; zero-dependency peer connection (no TURN fallback on LAN).",
    stack: ["React", "Node.js", "Express", "MongoDB", "WebRTC", "Socket.IO", "JWT", "Google OAuth"],
    github: "https://github.com/Saksham-Xtreme/LinkUp",
    demo: "https://link-up-sak.vercel.app/",
  },
  {
    id: "basera",
    title: "Basera",
    subtitle: "Property Listing Platform",
    problem: "Landlords needed a way to list properties with image uploads and receive booking inquiries without a third-party service.",
    architecture: "MVC architecture on Express/MongoDB. Images streamed directly to Cloudinary via multer middleware — no disk I/O on the server. Passport.js local strategy with session persistence.",
    challenges: [
      "Handling Cloudinary upload errors without leaving orphaned database records",
      "Designing the review sub-document schema to support pagination without separate collection lookups",
    ],
    impact: "Supports full CRUD lifecycle for listings; Cloudinary integration reduces server storage costs to zero.",
    stack: ["Node.js", "Express", "MongoDB", "EJS", "Cloudinary", "Passport.js"],
    github: "https://github.com/Saksham-Xtreme/Basera",
    demo: "https://basera-tijc.onrender.com/",
  },
  {
    id: "jaan",
    title: "JaanRaksha",
    subtitle: "Emergency Response System",
    problem: "Emergency coordination between citizens, first responders, and admins required real-time data sync across roles with strict access control.",
    architecture: "Firebase Realtime Database listeners push updates in under 200ms. Three-role RBAC (citizen / responder / admin) enforced both client-side and via Firebase Security Rules.",
    challenges: [
      "Writing Firebase Security Rules that prevent citizens from reading responder assignment data",
      "Designing the incident state machine (reported → assigned → resolved) with concurrent updates",
    ],
    impact: "Sub-200ms incident update propagation; role isolation verified via Firebase emulator test suite.",
    stack: ["React", "Firebase Auth", "Firebase Realtime DB"],
    github: "https://github.com/Saksham-Xtreme/JaanRaksha_Firebase",
    demo: "https://jaan-raksha-firebase-4w5s2nymm-sakshams-projects-2387838f.vercel.app/",
  },
  {
    id: "thread",
    title: "PUBLIC THREAD",
    subtitle: "CRUD Chat Application",
    problem: "Needed a minimal reference implementation of REST-based CRUD patterns for a chat context.",
    architecture: "RESTful API on Express with Mongoose models. Clean separation of route handlers, controllers, and data layer.",
    challenges: [
      "Designing idempotent PATCH vs PUT semantics for message edit history",
    ],
    impact: "Fully functional CRUD API; serves as a reference for REST API design patterns.",
    stack: ["Node.js", "Express", "MongoDB", "REST API"],
    github: "https://github.com/Saksham-Xtreme/YOUR_PUBLIC_THREAD",
    demo: "https://publicthread.onrender.com/chats",
  },
];

const SKILLS = {
  Languages:      ["C++", "JavaScript", "Python", "C"],
  Backend:        ["Node.js", "Express.js", "REST API", "Socket.IO", "WebRTC", "JWT", "Redis"],
  Frontend:       ["React", "HTML5", "CSS3", "Tailwind CSS"],
  Databases:      ["MongoDB", "MySQL", "Firebase Realtime DB"],
  Infrastructure: ["Vercel", "Render", "Cloudinary", "Git", "GitHub"],
  Concepts:       ["MERN Stack", "MVC Architecture", "RBAC", "WebSocket", "OAuth 2.0"],
};

const ACHIEVEMENTS = [
  {
    icon: "trophy",
    metric: "829 / 40,616",
    label: "Rank — LeetCode Weekly Contest 491",
    detail: "Top 2% globally",
  },
  {
    icon: "code",
    metric: "270+",
    label: "Problems solved on LeetCode",
    detail: "Rating 1712 • Primary: C++",
  },
  {
    icon: "star",
    metric: "5★",
    label: "HackerRank C++ rating",
    detail: "Verified certification",
  },
  {
    icon: "percent",
    metric: "Top 12%",
    label: "LeetCode global rank",
    detail: "Active contest participant",
  },
];

const EXPERIENCE = {
  company: "Prodigy InfoTech",
  role: "Web Development Intern",
  period: "2025",
  description:
    "Completed structured internship focused on full-stack web development. Built and delivered assigned projects using React and Node.js, with emphasis on component architecture and API integration.",
  stack: ["React", "Node.js", "JavaScript", "REST APIs"],
  deliverables: [
    "Delivered assigned project milestones on schedule",
    "Implemented UI components and integrated backend APIs",
    "Followed code review process and incorporated feedback",
  ],
};

// ─── ICONS (inline SVG — no external dep required) ───────────────────────────
function Icon({ name, size = 16, color = "currentColor", style = {} }) {
  const paths = {
    github:    "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
    linkedin:  "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
    leetcode:  "M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z",
    external:  "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
    trophy:    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z",
    code:      "M16 18l6-6-6-6M8 6l-6 6 6 6",
    star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    percent:   "M19 5 5 19M9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm11 11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z",
    mail:      "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    briefcase: "M20 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
    arrowright:"M5 12h14M12 5l7 7-7 7",
    menu:      "M3 12h18M3 6h18M3 18h18",
    x:         "M18 6 6 18M6 6l12 12",
    check:     "M20 6 9 17l-5-5",
  };

  const d = paths[name];
  if (!d) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
function Btn({ href, onClick, variant = "outline", size = "", children }) {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ""}`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ id, children, hero = false }) {
  return (
    <section
      id={id}
      className={`section${hero ? " section--hero" : ""}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ label, title }) {
  return (
    <div>
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`nav${scrolled ? " nav--scrolled" : ""}`}
    >
      <div className="nav__inner">
        <button
          onClick={() => scrollTo("hero")}
          className="nav__logo"
          aria-label="Back to top"
        >
          saksham.dev
        </button>

        <ul role="list" className="nav__links">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                onClick={() => scrollTo(item.toLowerCase())}
                className="nav__link-btn"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="nav__mobile-toggle"
        >
          <Icon name={open ? "x" : "menu"} size={20} />
        </button>
      </div>

      {open && (
        <div className="nav__drawer">
          <ul role="list" className="nav__drawer-list">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="nav__drawer-btn"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Section id="hero" hero>
      <div className="hero__badge" aria-label="Availability status">
        <span className="hero__badge-dot" aria-hidden="true" />
        <span className="hero__badge-text">Open to internships</span>
      </div>

      <h1 className="hero__name">Saksham Tripathi</h1>

      <p className="hero__title">Backend-Focused Full Stack Engineer</p>

      <p className="hero__desc">
        Building scalable web applications with Node.js, React, MongoDB, Socket.IO, and WebRTC.
        First-year B.Tech CSE — Prodigy InfoTech intern — Top 2% on LeetCode.
      </p>

      <div className="hero__ctas">
        <Btn href="/Saksham_Instep_Resume.pdf" variant="primary">
          View Resume
          <Icon name="external" size={14} />
        </Btn>
        <Btn href="https://github.com/Saksham-Xtreme">
          <Icon name="github" size={14} />
          GitHub
        </Btn>
        <Btn href="https://linkedin.com/in/saksham-tripathi-7b25b0330">
          <Icon name="linkedin" size={14} />
          LinkedIn
        </Btn>
        <Btn href="https://leetcode.com/u/sakshamtechie/">
          <Icon name="leetcode" size={14} />
          LeetCode
        </Btn>
      </div>
    </Section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <Section id="about" style={{ borderTop: `1px solid ${DS.border}` }}>
      <SectionHeading label="01 — About" title="Who I am" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
        className="about-grid"
      >
        {/* Bio */}
        <div>
          <p
            style={{
              fontFamily: DS.fontSans,
              fontSize: "15px",
              color: DS.textMuted,
              lineHeight: 1.8,
              margin: "0 0 16px",
            }}
          >
            First-year B.Tech Computer Science student at NIET (CGPA 7.53), specializing in
            backend architecture and real-time systems. I build full-stack applications with a
            strong focus on the server side — authentication, data modeling, API design, and
            WebSocket communication.
          </p>
          <p
            style={{
              fontFamily: DS.fontSans,
              fontSize: "15px",
              color: DS.textMuted,
              lineHeight: 1.8,
              margin: "0",
            }}
          >
            Completed an internship at Prodigy InfoTech and maintain a Top 2% LeetCode ranking
            through active competitive programming in C++.
          </p>
        </div>

        {/* Quick facts */}
        <dl
          style={{
            background: DS.surface,
            border: `1px solid ${DS.border}`,
            borderRadius: DS.r12,
            padding: "20px",
            margin: 0,
          }}
        >
          {[
            ["Degree", "B.Tech CSE, NIET — 2024–2028"],
            ["CGPA", "7.53 / 10"],
            ["Focus", "Backend, real-time systems"],
            ["Location", "India"],
            ["Status", "Open for internships"],
          ].map(([key, val]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: `1px solid ${DS.border}`,
                gap: "16px",
              }}
            >
              <dt
                style={{
                  fontFamily: DS.fontMono,
                  fontSize: "11px",
                  color: DS.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  flexShrink: 0,
                }}
              >
                {key}
              </dt>
              <dd
                style={{
                  fontFamily: DS.fontSans,
                  fontSize: "13px",
                  color: DS.text,
                  textAlign: "right",
                  margin: 0,
                }}
              >
                {val}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      style={{
        background: DS.surface,
        border: `1px solid ${DS.border}`,
        borderRadius: DS.r12,
        padding: "24px",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = DS.borderHi)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = DS.border)}
    >
      {/* Header */}
      <div style={{ marginBottom: "12px" }}>
        <h3
          style={{
            fontFamily: DS.fontSans,
            fontSize: "17px",
            fontWeight: 600,
            color: DS.text,
            margin: "0 0 4px",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: DS.fontSans,
            fontSize: "13px",
            color: DS.textMuted,
            margin: 0,
          }}
        >
          {project.subtitle}
        </p>
      </div>

      {/* Problem */}
      <div style={{ marginBottom: "16px" }}>
        <span
          style={{
            fontFamily: DS.fontMono,
            fontSize: "10px",
            color: DS.accent,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Problem
        </span>
        <p
          style={{
            fontFamily: DS.fontSans,
            fontSize: "14px",
            color: DS.textMuted,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {project.problem}
        </p>
      </div>

      {/* Expandable: architecture + challenges */}
      {expanded && (
        <>
          <div style={{ marginBottom: "16px" }}>
            <span
              style={{
                fontFamily: DS.fontMono,
                fontSize: "10px",
                color: DS.accent,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Architecture
            </span>
            <p
              style={{
                fontFamily: DS.fontSans,
                fontSize: "14px",
                color: DS.textMuted,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {project.architecture}
            </p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <span
              style={{
                fontFamily: DS.fontMono,
                fontSize: "10px",
                color: DS.accent,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Engineering Challenges
            </span>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
              {project.challenges.map((c, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "8px",
                    fontFamily: DS.fontSans,
                    fontSize: "13px",
                    color: DS.textMuted,
                    lineHeight: 1.55,
                  }}
                >
                  <Icon name="arrowright" size={14} color={DS.accent} style={{ marginTop: "2px", flexShrink: 0 }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {project.impact && (
            <div
              style={{
                background: DS.surfaceHi,
                border: `1px solid ${DS.border}`,
                borderRadius: DS.r8,
                padding: "12px 14px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: DS.fontMono,
                  fontSize: "10px",
                  color: "#22c55e",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Impact
              </span>
              <p style={{ fontFamily: DS.fontSans, fontSize: "13px", color: DS.text, margin: 0, lineHeight: 1.6 }}>
                {project.impact}
              </p>
            </div>
          )}
        </>
      )}

      {/* Stack */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {project.stack.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: DS.fontMono,
              fontSize: "11px",
              color: DS.textMuted,
              background: DS.surfaceHi,
              border: `1px solid ${DS.border}`,
              borderRadius: DS.r4,
              padding: "2px 8px",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: DS.fontSans,
            fontSize: "12px",
            color: DS.textMuted,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse project details" : "Expand project details"}
        >
          {expanded ? "Less" : "Architecture & challenges"}
          <Icon name="arrowright" size={12} color={DS.textMuted} style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          <Btn href={project.github} variant="outline" style={{ padding: "5px 12px", fontSize: "12px" }}>
            <Icon name="github" size={13} />
            GitHub
          </Btn>
          <Btn href={project.demo} variant="outline" style={{ padding: "5px 12px", fontSize: "12px" }}>
            <Icon name="external" size={13} />
            Demo
          </Btn>
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <Section id="projects" style={{ borderTop: `1px solid ${DS.border}` }}>
      <SectionHeading label="02 — Projects" title="What I've built" />
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <Section id="skills" style={{ borderTop: `1px solid ${DS.border}` }}>
      <SectionHeading label="03 — Skills" title="Technical capabilities" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {Object.entries(SKILLS).map(([cat, items]) => (
          <div
            key={cat}
            style={{
              background: DS.surface,
              border: `1px solid ${DS.border}`,
              borderRadius: DS.r12,
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontFamily: DS.fontMono,
                fontSize: "11px",
                color: DS.accent,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 14px",
              }}
            >
              {cat}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {items.map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontFamily: DS.fontSans,
                    fontSize: "12px",
                    color: DS.text,
                    background: DS.surfaceHi,
                    border: `1px solid ${DS.border}`,
                    borderRadius: DS.r4,
                    padding: "4px 10px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
function Achievements() {
  return (
    <Section id="achievements" style={{ borderTop: `1px solid ${DS.border}` }}>
      <SectionHeading label="04 — Achievements" title="Competitive programming" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {ACHIEVEMENTS.map((a) => (
          <div
            key={a.label}
            style={{
              background: DS.surface,
              border: `1px solid ${DS.border}`,
              borderRadius: DS.r12,
              padding: "20px",
            }}
          >
            <Icon name={a.icon} size={18} color={DS.accent} style={{ marginBottom: "12px" }} />
            <div
              style={{
                fontFamily: DS.fontSans,
                fontSize: "22px",
                fontWeight: 700,
                color: DS.text,
                marginBottom: "4px",
                letterSpacing: "-0.02em",
              }}
            >
              {a.metric}
            </div>
            <div
              style={{
                fontFamily: DS.fontSans,
                fontSize: "13px",
                color: DS.textMuted,
                marginBottom: "4px",
                lineHeight: 1.5,
              }}
            >
              {a.label}
            </div>
            <div
              style={{
                fontFamily: DS.fontMono,
                fontSize: "11px",
                color: DS.textDim,
              }}
            >
              {a.detail}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
function Experience() {
  return (
    <Section id="experience" style={{ borderTop: `1px solid ${DS.border}` }}>
      <SectionHeading label="05 — Experience" title="Work history" />
      <div
        style={{
          background: DS.surface,
          border: `1px solid ${DS.border}`,
          borderRadius: DS.r12,
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontFamily: DS.fontSans, fontSize: "16px", fontWeight: 600, color: DS.text, margin: "0 0 4px" }}>
              {EXPERIENCE.role}
            </h3>
            <p style={{ fontFamily: DS.fontSans, fontSize: "14px", color: DS.textMuted, margin: 0 }}>
              {EXPERIENCE.company}
            </p>
          </div>
          <span
            style={{
              fontFamily: DS.fontMono,
              fontSize: "12px",
              color: DS.textDim,
              background: DS.surfaceHi,
              border: `1px solid ${DS.border}`,
              borderRadius: DS.r4,
              padding: "4px 10px",
              flexShrink: 0,
            }}
          >
            {EXPERIENCE.period}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontFamily: DS.fontSans, fontSize: "14px", color: DS.textMuted, lineHeight: 1.7, margin: "0 0 16px" }}>
          {EXPERIENCE.description}
        </p>

        {/* Deliverables */}
        <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
          {EXPERIENCE.deliverables.map((d, i) => (
            <li key={i} style={{ display: "flex", gap: "8px", fontFamily: DS.fontSans, fontSize: "13px", color: DS.textMuted, lineHeight: 1.55 }}>
              <Icon name="check" size={14} color={DS.accent} style={{ marginTop: "2px", flexShrink: 0 }} />
              {d}
            </li>
          ))}
        </ul>

        {/* Stack */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {EXPERIENCE.stack.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: DS.fontMono,
                fontSize: "11px",
                color: DS.textMuted,
                background: DS.surfaceHi,
                border: `1px solid ${DS.border}`,
                borderRadius: DS.r4,
                padding: "2px 8px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const API = import.meta?.env?.VITE_API_URL ?? "";
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try email directly.");
      }
    } catch {
      setError("Network error. You can reach me at sakshamtripathi021@gmail.com");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: DS.r8,
    border: `1px solid ${DS.border}`,
    background: DS.surface,
    fontFamily: DS.fontSans,
    fontSize: "14px",
    color: DS.text,
    outline: "none",
    boxSizing: "border-box",
    display: "block",
    transition: "border-color 0.15s",
  };

  return (
    <Section id="contact" style={{ borderTop: `1px solid ${DS.border}` }}>
      <SectionHeading label="06 — Contact" title="Get in touch" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
        className="contact-grid"
      >
        {/* Links */}
        <div>
          <p style={{ fontFamily: DS.fontSans, fontSize: "15px", color: DS.textMuted, lineHeight: 1.7, margin: "0 0 24px" }}>
            Open to internship opportunities and interesting engineering conversations.
            Response time under 24 hours.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "mail", label: "sakshamtripathi021@gmail.com", href: "mailto:sakshamtripathi021@gmail.com" },
              { icon: "linkedin", label: "saksham-tripathi-7b25b0330", href: "https://linkedin.com/in/saksham-tripathi-7b25b0330" },
              { icon: "github", label: "Saksham-Xtreme", href: "https://github.com/Saksham-Xtreme" },
              { icon: "leetcode", label: "sakshamtechie", href: "https://leetcode.com/u/sakshamtechie/" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: DS.fontSans,
                  fontSize: "14px",
                  color: DS.textMuted,
                  textDecoration: "none",
                  padding: "10px 14px",
                  borderRadius: DS.r8,
                  border: `1px solid ${DS.border}`,
                  background: DS.surface,
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DS.borderHi;
                  e.currentTarget.style.color = DS.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DS.border;
                  e.currentTarget.style.color = DS.textMuted;
                }}
              >
                <Icon name={l.icon} size={16} />
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <div
            style={{
              background: DS.surface,
              border: `1px solid ${DS.border}`,
              borderRadius: DS.r12,
              padding: "32px",
              textAlign: "center",
            }}
          >
            <Icon name="check" size={32} color="#22c55e" style={{ marginBottom: "12px" }} />
            <p style={{ fontFamily: DS.fontSans, fontSize: "16px", fontWeight: 600, color: DS.text, margin: "0 0 4px" }}>
              Message sent
            </p>
            <p style={{ fontFamily: DS.fontSans, fontSize: "13px", color: DS.textMuted, margin: 0 }}>
              I'll get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="form-row">
                <div>
                  <label htmlFor="name" style={{ fontFamily: DS.fontSans, fontSize: "12px", color: DS.textMuted, display: "block", marginBottom: "6px" }}>
                    Name
                  </label>
                  <input
                    id="name"
                    style={inputStyle}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    onFocus={(e) => (e.target.style.borderColor = DS.accent)}
                    onBlur={(e) => (e.target.style.borderColor = DS.border)}
                  />
                </div>
                <div>
                  <label htmlFor="email" style={{ fontFamily: DS.fontSans, fontSize: "12px", color: DS.textMuted, display: "block", marginBottom: "6px" }}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    style={inputStyle}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    onFocus={(e) => (e.target.style.borderColor = DS.accent)}
                    onBlur={(e) => (e.target.style.borderColor = DS.border)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" style={{ fontFamily: DS.fontSans, fontSize: "12px", color: DS.textMuted, display: "block", marginBottom: "6px" }}>
                  Message
                </label>
                <textarea
                  id="message"
                  style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                  placeholder="What are you working on?"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                  onFocus={(e) => (e.target.style.borderColor = DS.accent)}
                  onBlur={(e) => (e.target.style.borderColor = DS.border)}
                />
              </div>

              {error && (
                <p style={{ fontFamily: DS.fontSans, fontSize: "13px", color: "#f87171", margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  borderRadius: DS.r8,
                  background: DS.accent,
                  color: "#fff",
                  border: "none",
                  fontFamily: DS.fontSans,
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {loading ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${DS.border}`,
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: DS.fontMono,
          fontSize: "12px",
          color: DS.textDim,
          margin: 0,
        }}
      >
        Built by Saksham Tripathi — React, Node.js, MongoDB
      </p>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  return (
    <>
      {/* Skip to main content — styled via portfolio.css .skip-link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}