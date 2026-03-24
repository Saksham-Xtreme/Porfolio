import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "typewriter-effect";
import "./mobile.css";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: "LinkUp – Real-Time Video Call & Chat",
    desc: "Real-time communication platform supporting 1:1 video calls and messaging using WebRTC peer-to-peer connections. Features Google OAuth login, JWT-based authentication, Socket.IO signaling, and persistent chat with MongoDB.",
    tags: ["React", "Node.js", "Express", "MongoDB", "WebRTC", "Socket.IO", "JWT", "Google OAuth"],
    demo: "https://link-up-sak.vercel.app/",
    github: "https://github.com/Saksham-Xtreme/LinkUp",
  },
  {
    id: 2,
    title: "Basera – Property Listing Platform",
    desc: "Full-stack property listing platform where users can create listings, upload images with Cloudinary, add reviews, and simulate bookings using a RESTful MVC architecture.",
    tags: ["Node.js", "Express", "MongoDB", "EJS", "Cloudinary"],
    demo: "https://basera-tijc.onrender.com/",
    github: "https://github.com/Saksham-Xtreme/Basera",
  },
  {
    id: 3,
    title: "PUBLIC THREAD – CRUD Chat Application",
    desc: "Full-stack chat application using Node.js, Express.js, MongoDB. Built REST APIs and implemented Create, Read, Update, Delete operations.",
    tags: ["Node.js", "Express", "MongoDB", "REST API"],
    demo: "https://publicthread.onrender.com/chats",
    github: "https://github.com/Saksham-Xtreme/YOUR_PUBLIC_THREAD",
  },
  {
    id: 4,
    title: "JaanRaksha – Emergency Response System",
    desc: "Real-time emergency response web application using Firebase Authentication and Realtime Database. Implemented role-based access for citizens, responders, and administrators.",
    tags: ["React", "Firebase", "Realtime DB", "Authentication"],
    demo: "https://jaan-raksha-firebase-4w5s2nymm-sakshams-projects-2387838f.vercel.app/",
    github: "https://github.com/Saksham-Xtreme/JaanRaksha_Firebase",
  }
];
const SKILLS = {
  Frontend: [
    { name: "React ", level: 89 },
    { name: "HTML", level: 88 },
    { name: "CSS / Tailwind CSS", level: 92 },
    { name: "Javascript", level: 91 },
  ],
  Backend: [
    { name: "Node.js ", level: 90 },
    { name: "Express", level: 82 },
    { name: "REST API Design", level: 93 },
  ],
  Database: [
    { name: "MongoDB", level: 88 },
    { name: "MySQL", level: 81 },
  ],
  Deployment: [
    { name: "Render", level: 87 },
    { name: "Vercel", level: 93 },
  ],
};
const TERMINAL_RESPONSES = {

  help: `
Available commands:

whoami      — identity
education   — education info
skills      — technical skills
projects    — list projects
contact     — contact info

github      — open GitHub
linkedin    — open LinkedIn
resume      — open resume

hello       — greeting
jarvis      — summon assistant
coffee      — increase energy
motivate    — motivation
joke        — random joke
system      — system information
date        — current system date
sudo hire   — special command

clear       — clear terminal
`,

  whoami: `
┌──────────────────────────────┐
│ Saksham Tripathi             │
│ Full Stack Developer         │
│ MERN Stack • Web Security    │
│ React • Node • MongoDB       │
└──────────────────────────────┘

Status: Available for hire
Location: India
`,

  education: `
B.Tech Computer Science Engineering
Noida Institute of Engineering and Technology
CGPA: 7.53
Duration: 2024 – 2028
`,

  skills: `
Frontend:
React, JavaScript, Tailwind, HTML, CSS

Backend:
Node.js, Express.js

Database:
MongoDB, MySQL, Firebase

Languages:
C++, Python, C

Tools:
Git, GitHub, Vercel, VS Code
`,

  projects: `
Projects:

1. JaanRaksha – Emergency Response System
   Stack: React, Firebase

2. PUBLIC THREAD – CRUD Chat Application
   Stack: Node.js, Express, MongoDB

Use GitHub command to view source code.
`,

  contact: `
Email: shivbhau2108@gmail.com
GitHub: github.com/Saksham-Xtreme
LinkedIn: linkedin.com/in/saksham-tripathi-7b25b0330

Response time: < 24 hours
`,

  hello: `
Hello 👋
Welcome to SakshamOS.

Type "help" to see available commands.
`,

  jarvis: `
Jarvis initialized.

How can I assist you, Saksham?
`,

  coffee: `
☕ Coffee brewed successfully.

Energy level: 100%
Productivity boost activated.
`,

  motivate: `
You are one commit away from success.

Keep building.
`,

  system: `
System Information:

OS: SakshamOS v1.0
Kernel: React + Framer Motion
Architecture: MERN Stack
Status: Fully Operational
Security: Enabled
`,

  date: () => {
    return new Date().toString();
  },

  "sudo hire": `
Permission granted.

Initializing hiring protocol...

Offer letter ready.
Welcome aboard.
`,

  joke: () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "There are only 10 types of people: those who understand binary and those who don't.",
      "I don't always test my code, but when I do, I do it in production.",
      "Debugging: Removing needles from the haystack.",
      "Programmer: A machine that turns coffee into code."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },

  github: () => {
    window.open("https://github.com/Saksham-Xtreme", "_blank");
    return "Opening GitHub profile...";
  },

  linkedin: () => {
    window.open(
      "https://linkedin.com/in/saksham-tripathi-7b25b0330",
      "_blank"
    );
    return "Opening LinkedIn profile...";
  },

  resume: () => {
    window.open("/Saksham_Instep_Resume.pdf", "_blank");
    return "Opening resume...";
  }

};

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  sage: "#ccd5ae",
  cream1: "#e9edc9",
  cream2: "#fefae0",
  peach: "#faedcd",
  tan: "#d4a373",
};

// ─── WINDOW MANAGER HOOK ─────────────────────────────────────────────────────
// zRef is a plain ref — never triggers re-renders, never has stale closure issues.
// All setWindows calls use functional updaters to always read fresh state.
function useWindowManager() {
  const [windows, setWindows] = useState({});
  const zRef = useRef(100);

  // ✅ Load saved window state on startup
  useEffect(() => {
    const saved = localStorage.getItem("saksham_windows");
    if (saved) {
      setWindows(JSON.parse(saved));
    }
  }, []);

  // ✅ Save window state whenever it changes
  useEffect(() => {
    localStorage.setItem("saksham_windows", JSON.stringify(windows));
  }, [windows]);

  const openWindow = useCallback((id) => {
    setWindows((prev) => {
      const existing = prev[id];
      const newZ = ++zRef.current;
      return {
        ...prev,
        [id]: {
          id,
          open: true,
          minimized: false,
          z: newZ,
          // Preserve position if window already existed
          pos: existing?.pos ?? {
            x: 80 + Math.random() * 140,
            y: 60 + Math.random() * 100,
          },
        },
      };
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], open: false, minimized: false },
      };
    });
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], minimized: !prev[id].minimized },
      };
    });
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows((prev) => {
      if (!prev[id]) return prev;
      const newZ = ++zRef.current;
      return {
        ...prev,
        [id]: { ...prev[id], z: newZ },
      };
    });
  }, []);

  return { windows, openWindow, closeWindow, focusWindow, minimizeWindow };
}

// ─── ORBIT TEXT ──────────────────────────────────────────────────────────────
// Uses a stable unique ID per instance to avoid SVG defs collisions.
function OrbitText({ text, radius = 118 }) {
  const pathId = useRef(`orbit-${Math.random().toString(36).slice(2, 9)}`).current;
  const size = (radius + 24) * 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`${-(radius + 24)} ${-(radius + 24)} ${size} ${size}`}
        style={{ overflow: "visible", position: "absolute" }}
      >
        <defs>
          {/* Near-complete circle: end point is epsilon away from start to avoid degenerate arc */}
          <path
            id={pathId}
            d={`M 0,${-radius} A ${radius},${radius} 0 1,1 -0.001,${-radius}`}
          />
        </defs>
        <text
          style={{
            fontSize: "10.5px",
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontWeight: 600,
            fill: C.tan,
            letterSpacing: "0.2em",
          }}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            <animate
              attributeName="startOffset"
              from="0%"
              to="100%"
              dur="20s"
              repeatCount="indefinite"
            />
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

// --------- PROFILE CENTER _--------------
function ProfileCenter() {

  const radius = 110

  const TECH = [
    "React","Node.js","MongoDB","Express",
    "JavaScript","Ejs","C++","SQL",
    "HTML","CSS","Tailwind","Git"
  ]

  const globeRef = useRef(null)
  const containerRef = useRef(null)

  const rotation = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0.2, y: 0.3 })

  // Generate Fibonacci sphere once
  const basePoints = useRef(
    TECH.map((tech, i) => {

      const phi = Math.acos(1 - 2 * (i + 0.5) / TECH.length)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)

      return {
        tech,
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi)
      }
    })
  )

  useEffect(() => {

    let frame

    const animate = () => {

      rotation.current.x += velocity.current.x
      rotation.current.y += velocity.current.y

      const rx = rotation.current.x * Math.PI / 180
      const ry = rotation.current.y * Math.PI / 180

      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)

      const nodes = globeRef.current.children

      basePoints.current.forEach((p, i) => {

        // Rotate around X
        let y = p.y * cosX - p.z * sinX
        let z = p.y * sinX + p.z * cosX

        // Rotate around Y
        let x = p.x * cosY + z * sinY
        z = -p.x * sinY + z * cosY

        const depth = (z + radius) / (2 * radius)

        const node = nodes[i]

        node.style.transform = `
          translate3d(${x}px, ${y}px, 0)
          scale(${0.6 + depth})
        `

        node.style.opacity = 0.25 + depth * 0.75
        node.style.zIndex = Math.floor(depth * 1000)
      })

      frame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frame)

  }, [])

  const handleMouseMove = (e) => {

    const rect = containerRef.current.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    velocity.current.y = (x - centerX) / 80
    velocity.current.x = -(y - centerY) / 80
  }

  const handleMouseLeave = () => {
    velocity.current = { x: 0.2, y: 0.3 }
  }

  return (

    <div
      style={{
        position: "absolute",
        top: 24,
        bottom: 90,
        color:"black",
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <div className="profile-center-wrapper" style={{ display: "flex", gap: 100, alignItems: "center" }}>

        {/* INTERACTIVE DEPTH GLOBE */}
        <div
          className="globe-container"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: 320,
            height: 320,
            perspective: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab"
          }}
        >

          {/* Globe Core */}
          <div
            className="globe-core"
            style={{
              position: "absolute",
              width: 240,
              height: 240,
              color:"black",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, rgba(212,163,115,0.3), transparent 70%)",
              border: "1px solid rgba(212,163,115,0.4)"
            }}
          />

          {/* Rotating Points */}
          <div
            ref={globeRef}
            style={{
              width: 0,
              height: 0,
              position: "relative"
            }}
          >
            {TECH.map((tech) => (
              <div
                key={tech}
                style={{
                  position: "absolute",
                  color:"black",
                  left: 0,
                  top: 0,
                  transform: "translate(-50%, -50%)",
                  willChange: "transform, opacity"
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    fontSize: 12,
                    borderRadius: 10,
                    color:"black",
                    background: "#fefae0",
                    border: "1px solid #d4a373",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                    fontWeight: 600,
                    whiteSpace: "nowrap"
                  }}
                >
                  {tech}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PROFILE SIDE */}
        <div style={{ width: 420 }}>

          <motion.img
            src="/profile.jpg"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              width: 120,
              color:"black",
              height: 120,
              borderRadius: "50%",
              border: "4px solid #d4a373",
              marginBottom: 16
            }}
          />

          <div style={{ fontSize: 24, color:"black", fontWeight: 700, marginBottom: 6 }}>
            Saksham Tripathi
          </div>

          <Typewriter
            options={{ delay: 24 }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Building secure, scalable full-stack applications.")
                .pauseFor(200)
                .typeString("<br/>Specialized in React, Node.js, MongoDB, and backend architecture.")
                .pauseFor(200)
                .typeString("<br/>Focused on production-grade engineering and security.")
                .pauseFor(200)
                .typeString("<br/>Solved 170+ LeetCode problems • Rating 1707.")
                .pauseFor(200)
                .typeString("<br/>From New Delhi, India")
                .start()
            }}
          />

          {/* CTA Buttons */}
            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 14,
                alignItems: "center"
              }}
            >
            
              {/* GitHub */}
              <motion.a
                href="https://github.com/Saksham-Xtreme"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  background: "#24292e",
                  color: "#fff",
                  fontFamily: "'DM Sans', system-ui",
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)"
                }}
              >
                GitHub
              </motion.a>
            
              {/* LinkedIn */}
              <motion.a
                href="https://linkedin.com/in/saksham-tripathi-7b25b0330"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  background: "#0A66C2",
                  color: "#fff",
                  fontFamily: "'DM Sans', system-ui",
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)"
                }}
              >
                LinkedIn
              </motion.a>
            
            </div>

        </div>

      </div>

    </div>
  )
}


// ─── DESKTOP ICON ─────────────────────────────────────────────────────────────
function DesktopIcon({ id, label, emoji, onClick }) {
  const handleClick = useCallback(() => onClick(id), [id, onClick]);
  return (
    <motion.div
      whileHover={{ scale: 1.12, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      style={{ width: 72, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", userSelect: "none" }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          background: `linear-gradient(145deg, ${C.cream2}, ${C.peach})`,
          boxShadow: `0 4px 20px rgba(212,163,115,0.25), inset 0 1px 0 rgba(255,255,255,0.8)`,
          border: `1px solid rgba(212,163,115,0.3)`,
        }}
      >
        {emoji}
      </div>
      <span
        style={{
          fontSize: 11,
          fontFamily: "'DM Sans', system-ui",
          fontWeight: 500,
          color: "#4a3728",
          textShadow: `0 1px 3px rgba(254,250,224,0.9)`,
          background: "rgba(254,250,224,0.7)",
          borderRadius: 4,
          padding: "1px 4px",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ─── DRAGGABLE WINDOW ─────────────────────────────────────────────────────────
function Window({ id, title, emoji, children, zIndex, onClose, onMinimize, onFocus, initialPos }) {
  // Stop propagation on traffic light buttons so drag and focus don't fire.
  const stopAndClose = useCallback((e) => { e.stopPropagation(); onClose(id); }, [id, onClose]);
  const stopAndMin = useCallback((e) => { e.stopPropagation(); onMinimize(id); }, [id, onMinimize]);
  const handleFocus = useCallback(() => onFocus(id), [id, onFocus]);

  return (
    <motion.div
      className="window"
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={{ scale: 0.86, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.82, opacity: 0, y: 16, transition: { duration: 0.16 } }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      onMouseDown={handleFocus}
      style={{
        position: "fixed",
        left: initialPos.x,
        top: initialPos.y,
        zIndex,
        width: 520,
        maxWidth: "calc(100vw - 32px)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: `0 30px 80px rgba(74,55,40,0.22), 0 2px 8px rgba(74,55,40,0.12), 0 0 0 1px rgba(212,163,115,0.22)`,
        touchAction: "none",
      }}
    >
      {/* Title bar / drag handle */}
      <div
        style={{
          height: 40,
          background: `linear-gradient(180deg, ${C.peach} 0%, ${C.cream1} 100%)`,
          borderBottom: `1px solid rgba(212,163,115,0.3)`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          cursor: "grab",
          userSelect: "none",
          position: "relative",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, position: "relative", zIndex: 2 }}>
          <TrafficLight color="#ff6058" border="#e14940" symbol="✕" onMouseDown={(e) => e.stopPropagation()} onClick={stopAndClose} title="Close" />
          <TrafficLight color="#ffbd2e" border="#e1a116" symbol="−" onMouseDown={(e) => e.stopPropagation()} onClick={stopAndMin} title="Minimize" />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#29ca41", border: "1px solid #1aab2e", flexShrink: 0 }} />
        </div>

        {/* Centered title */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 13,
            fontFamily: "'DM Sans', system-ui",
            fontWeight: 600,
            color: "#4a3728",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {emoji} {title}
        </span>
      </div>

      {/* Content — stopPropagation prevents scroll from triggering drag */}
      <div
        className="window-content"
        style={{
          background: C.cream2,
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  );
}

function TrafficLight({ color, border, symbol, onClick, onMouseDown, title }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 13,
        height: 13,
        borderRadius: "50%",
        background: color,
        border: `1px solid ${border}`,
        cursor: "pointer",
        flexShrink: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 7,
        color: hovered ? "rgba(0,0,0,0.5)" : "transparent",
        lineHeight: 1,
      }}
    >
      {symbol}
    </button>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 20
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          border: `2px solid ${C.tan}`,
          boxShadow: `0 4px 16px rgba(212,163,115,0.25)`,
          background: `linear-gradient(135deg, ${C.sage}, ${C.tan})`,
        }}>
          <img
            src="/profile.jpg"
            alt="Saksham Tripathi"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>

        <div>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 22,
            color: "#3a2a1e",
            fontWeight: 700,
            margin: "0 0 3px"
          }}>
            Saksham Tripathi
          </h2>

          <p style={{
            fontFamily: "'DM Sans', system-ui",
            fontSize: 13,
            color: C.tan,
            fontWeight: 500,
            margin: "0 0 4px"
          }}>
            Full Stack Developer • MERN Stack
          </p>

          <p style={{
            fontFamily: "'DM Sans', system-ui",
            fontSize: 12,
            color: "#7a6a5a",
            margin: 0
          }}>
            India · Open for Internships and Opportunities
          </p>
        </div>
      </div>

      {/* Bio */}
      <p style={{
        fontFamily: "'DM Sans', system-ui",
        fontSize: 13.5,
        color: "#4a3728",
        lineHeight: 1.75,
        margin: "0 0 20px"
      }}>
        I am a Full Stack Developer specializing in the MERN stack, from New Delhi, India. Currently pursuing a B.Tech
        in Computer Science and Engineering with a focus on Security. I build scalable and secure
        web applications using React, Node.js, Express, and MongoDB.

        <br /><br />

        I have built real-world applications including an Emergency Response System and a
        full-stack chat platform using Node.js, Express, and MongoDB.

        <br /><br />

        I am actively strengthening my problem-solving skills through Data Structures and
        Algorithms and regularly practice competitive programming on LeetCode.
      </p>

      {/* LeetCode Section */}
<div style={{ marginBottom: 24 }}>
  <h3 style={{
    fontFamily: "'DM Sans', system-ui",
    fontSize: 10,
    fontWeight: 700,
    color: C.tan,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 12
  }}>
    Competitive Programming
  </h3>

  <div style={{
    background: C.peach,
    padding: 14,
    borderRadius: 10,
    border: `1px solid rgba(212,163,115,0.3)`
  }}>
    
    <div style={{
      fontFamily: "'DM Sans', system-ui",
      fontSize: 13,
      color: "#4a3728",
      marginBottom: 6,
      fontWeight: 600
    }}>
      🧠 LeetCode Profile
    </div>

    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 12,
      color: "#5a4a3a",
      lineHeight: 1.7
    }}>
      Problems Solved: 200+ <br/>
      Contest Rating: 1712 <br/>
      Global Rank: Top 12.38%  <br/>
      Primary Language: C++ <br/>
      Core Areas: Arrays, Hash Tables, Dynamic Programming, Binary Search
    </div>

    <a
      href="https://leetcode.com/u/sakshamtechie/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: 10,
        padding: "6px 12px",
        background: C.tan,
        color: "#fff",
        borderRadius: 8,
        fontSize: 12,
        textDecoration: "none",
        fontFamily: "'DM Sans', system-ui",
        fontWeight: 600
      }}
    >
      View Full LeetCode Profile →
    </a>

  </div>
</div>

      {/* Timeline */}
      <div>
        <h3 style={{
          fontFamily: "'DM Sans', system-ui",
          fontSize: 10,
          fontWeight: 700,
          color: C.tan,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 12
        }}>
          Timeline
        </h3>

        {[
          {
            year: "2026",
            event: "Focused on MERN stack development, and PUBLIC THREAD full-stack applications"
          },
          {
            year: "2025",
            event: "Built JaanRaksha "
          },
          {
            year: "2025",
            event: "Learned programming fundamentals and Data Structures"
          },
          {
            year: "2024",
            event: "Started B.Tech in Computer Science and Engineering at NIET"
          },
          
        ].map(item => (
          <div key={item.year} style={{
            display: "flex",
            gap: 12,
            marginBottom: 10
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: C.tan,
              fontWeight: 600,
              flexShrink: 0
            }}>
              {item.year}
            </span>

            <p style={{
              fontFamily: "'DM Sans', system-ui",
              fontSize: 12.5,
              color: "#5a4a3a",
              margin: 0
            }}>
              {item.event}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 14 }}>
      {PROJECTS.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          whileHover={{ y: -2 }}
          style={{
            borderRadius: 12,
            padding: "14px 16px",
            background: C.peach,
            border: `1px solid rgba(212,163,115,0.28)`,
            boxShadow: "0 2px 8px rgba(212,163,115,0.1)",
          }}
        >
          <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 15, color: "#3a2a1e", fontWeight: 700, margin: "0 0 4px" }}>
            {p.title}
          </h3>
          <p style={{ fontFamily: "'DM Sans', system-ui", fontSize: 12.5, color: "#5a4a3a", lineHeight: 1.6, margin: "0 0 10px" }}>
            {p.desc}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {p.tags.map((t) => (
                <span key={t} style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", background: C.cream1, color: C.tan, border: `1px solid ${C.sage}`, fontWeight: 600, borderRadius: 20, padding: "2px 8px" }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
            <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', system-ui",
                  fontWeight: 600,
                  background: C.sage,
                  color: "#3a2a1e",
                  textDecoration: "none"
                }}
              >
                GitHub
            </a>

            <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', system-ui",
                  fontWeight: 600,
                  background: C.tan,
                  color: "#fff",
                  textDecoration: "none"
                }}
              >
                Demo
            </a>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function SkillBar({ name, level, delay }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "'DM Sans', system-ui", fontSize: 12, color: "#4a3728", fontWeight: 500 }}>{name}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.tan, fontWeight: 600 }}>{level}%</span>
      </div>
      <div style={{ height: 5, background: C.cream1, borderRadius: 9999, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.85, delay, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 9999, background: `linear-gradient(90deg, ${C.sage}, ${C.tan})` }}
        />
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 28px" }}>
      {Object.entries(SKILLS).map(([cat, items], ci) => (
        <div key={cat}>
          <h3 style={{ fontFamily: "'DM Sans', system-ui", fontSize: 10, fontWeight: 700, color: C.tan, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px" }}>
            {cat}
          </h3>
          {items.map((s, i) => (
            <SkillBar key={s.name} name={s.name} level={s.level} delay={ci * 0.08 + i * 0.06} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const API = import.meta.env.VITE_API_URL;
  
      console.log("Sending:", form);
  
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      console.log("Status:", res.status);
  
      const data = await res.json();
      console.log("Response:", data);
  
      if (data.success) {
        setSent(true);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };
  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid rgba(212,163,115,0.4)`,
    background: C.cream1,
    fontFamily: "'DM Sans', system-ui",
    fontSize: 13,
    color: "#3a2a1e",
    outline: "none",
    boxSizing: "border-box",
    display: "block",
  };

  return (
    <div style={{ padding: 24 }}>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0" }}
          >
            <span style={{ fontSize: 48 }}>✅</span>
            <p style={{ fontFamily: "'DM Sans', system-ui", fontSize: 15, color: "#3a2a1e", fontWeight: 600, marginTop: 12 }}>Message sent!</p>
            <p style={{ fontFamily: "'DM Sans', system-ui", fontSize: 12, color: "#7a6a5a", marginTop: 4 }}>I'll get back to you soon.</p>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}>
            <div className="contact-row" style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <input style={inputStyle} placeholder="Your Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <input style={inputStyle} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </div>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 96, marginBottom: 12 }}
              placeholder="Your message..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              style={{ width: "100%", padding: "10px 0", borderRadius: 10, background: C.tan, color: "#fff", fontFamily: "'DM Sans', system-ui", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}
            >
              Send Message
            </motion.button>
            <div  style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {["📧 shivbhau2108@gmail.com", "🐙 https://github.com/Saksham-Xtreme", "💼 www.linkedin.com/in/saksham-tripathi-7b25b0330"].map((c) => (
                <span key={c} style={{ fontFamily: "'DM Sans', system-ui", fontSize: 11, color: "#7a6a5a" }}>{c}</span>
              ))}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
// ------------- RESUME ---------------
function Resume() {
  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: 12,
          padding: 20,
          background: C.cream1,
          border: `1px solid rgba(212,163,115,0.28)`,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11.5,
          color: "#5a4a3a",
          lineHeight: 1.9,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "#3a2a1e",
            marginBottom: 2,
          }}
        >
          SAKSHAM TRIPATHI
        </div>

        <div style={{ color: C.tan, marginBottom: 8 }}>
          Full Stack Developer • MERN Stack Developer
        </div>

        <div style={{ marginBottom: 14 }}>
          📧 shivbhau2108@gmail.com  
          <br />
          💻 github.com/Saksham-Xtreme  
          <br />
          🔗 linkedin.com/in/saksham-tripathi-7b25b0330 
          <br />
          📍 India
        </div>

        {/* Education */}
        <div
          style={{
            fontWeight: 700,
            color: C.tan,
            marginBottom: 4,
          }}
        >
          EDUCATION
        </div>

        <div>
          B.Tech in Computer Science and Engineering
        </div>

        <div style={{ paddingLeft: 12, marginBottom: 12 }}>
          Noida Institute of Engineering and Technology  
          <br />
          CGPA: 7.53  
          <br />
          2024 – 2028
        </div>

        {/* Projects */}
        <div
          style={{
            fontWeight: 700,
            color: C.tan,
            marginBottom: 4,
          }}
        >
          PROJECTS
        </div>

        

        <div>
          LinkUp – Real-Time Video Call & Chat Platform
        </div>
        
        <div style={{ paddingLeft: 12, marginBottom: 8 }}>
          → 1:1 video calls and real-time messaging  
          <br />
          → WebRTC peer-to-peer communication  
          <br />
          → React, Node.js, Express.js, MongoDB, Socket.IO  
        </div>
        
        <div>
          Basera – Property Listing Platform
        </div>
        
        <div style={{ paddingLeft: 12, marginBottom: 8 }}>
          → Full-stack Property listing platform  
          <br />
          → Node.js, Express.js, MongoDB, EJS  
          <br />
          → Image uploads with Cloudinary and authentication with Passport.js  
        </div>
        
        <div>
          PUBLIC THREAD – CRUD Chat Application
        </div>
        
        <div style={{ paddingLeft: 12, marginBottom: 8 }}>
          → Full-stack chat application  
          <br />
          → Node.js, Express.js, MongoDB  
          <br />
          → REST API architecture  
        </div>
        
        <div>
          JaanRaksha – Emergency Response System
        </div>
        
        <div style={{ paddingLeft: 12, marginBottom: 12 }}>
          → Real-time emergency response web app  
          <br />
          → Firebase Authentication and Realtime Database  
          <br />
          → Role-based access system  
        </div>

        {/* Skills */}
        <div
          style={{
            fontWeight: 700,
            color: C.tan,
            marginBottom: 4,
          }}
        >
          SKILLS
        </div>

        <div style={{ marginBottom: 12 }}>
          Languages: C++, Python, C  
          <br />
          Frontend: React, JavaScript, HTML, CSS, Tailwind  
          <br />
          Backend: Node.js, Express.js  
          <br />
          Database: MongoDB, MySQL, Firebase  
          <br />
          Tools: Git, GitHub, VS Code, Vercel  
        </div>

        {/* Achievements */}
        <div
          style={{
            fontWeight: 700,
            color: C.tan,
            marginBottom: 4,
          }}
        >
          ACHIEVEMENTS
        </div>

        <div>
          → 5★ rating in C++ on HackerRank  
          <br />
          → Solved 170+ DSA problems on LeetCode  
          <br />
          → LeetCode Contest Rating: 1700+
        </div>
      </div>

      {/* Download Button */}
      <motion.a
        href="/Saksham_Instep_Resume.pdf"
        download
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        style={{
          padding: "10px 32px",
          borderRadius: 10,
          background: C.tan,
          color: "#fff",
          fontFamily: "'DM Sans', system-ui",
          fontWeight: 700,
          fontSize: 13,
          border: "none",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        ⬇ Download Resume PDF
      </motion.a>
    </div>
  );
}

// ─── TERMINAL ─────────────────────────────────────────────────────────────────
function Terminal() {
  const [history, setHistory] = useState([
    { type: "output", text: 'Welcome to SakshamOS v1.0.0\nType "help" to see available commands.' },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = useCallback(
    (e) => {
      if (e.key !== "Enter") return;
      const raw = input.trim();
      const cmd = raw.toLowerCase();
      if (!cmd) return;

      setHistory((h) => [...h, { type: "input", text: `$ ${raw}` }]);
      setInput("");

      setTimeout(() => {
        if (cmd === "clear") {
          setHistory([]);
          return;
        }
        let res;

        const entry = TERMINAL_RESPONSES[cmd];
        
        if (!entry) {
          res = `command not found: ${raw}\nType "help" for available commands.`;
        } else if (typeof entry === "function") {
          res = entry();
        } else {
          res = entry;
        }        setHistory((h) => [...h, { type: "output", text: res }]);
      }, 100);
    },
    [input]
  );

  return (
    <div
      style={{ background: "#1a1610", minHeight: 320, padding: 20, fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: 12, color: "#c8b89a", lineHeight: 1.75, cursor: "text" }}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((h, i) => (
        <div key={i} style={{ color: h.type === "input" ? C.tan : "#c8b89a", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {h.text}
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
        <span style={{ color: C.tan, flexShrink: 0 }}>$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e8d8c4", fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: 12, caretColor: C.tan }}
          placeholder="type a command..."
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

// ─── WINDOW CONFIGS ───────────────────────────────────────────────────────────
const WINDOW_DEFS = {
  about:    { title: "About Me",  emoji: "👤", component: About },
  projects: { title: "Projects",  emoji: "🚀", component: Projects },
  skills:   { title: "Skills",    emoji: "⚡", component: Skills },
  contact:  { title: "Contact",   emoji: "📬", component: Contact },
  resume:   { title: "Resume",    emoji: "📄", component: Resume },
  terminal: { title: "Terminal",  emoji: "💻", component: Terminal },
};

const ICONS = [
  { id: "about",    label: "About Me",  emoji: "👤" },
  { id: "projects", label: "Projects",  emoji: "🚀" },
  { id: "skills",   label: "Skills",    emoji: "⚡" },
  { id: "contact",  label: "Contact",   emoji: "📬" },
  { id: "resume",   label: "Resume",    emoji: "📄" },
  { id: "terminal", label: "Terminal",  emoji: "💻" },
];

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function MenuClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontSize: 11, color: "#7a6a5a" }}>
      {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      &nbsp;&nbsp;
      {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
    </span>
  );
}

// ─── DESKTOP ──────────────────────────────────────────────────────────────────
export default function Desktop() {
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow } = useWindowManager();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(ellipse at 20% 30%, ${C.sage}55 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, ${C.tan}33 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${C.cream1} 0%, ${C.peach} 100%)
        `,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(212,163,115,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,163,115,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Menu bar */}
      <div
        style={{
          height: 24,
          background: "rgba(254,250,224,0.82)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid rgba(212,163,115,0.18)`,
          position: "relative",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#3a2a1e" }}>🧑‍💻</span>
          {["Finder", "File", "Edit", "View", "Go", "Window"].map((m) => (
            <span key={m} style={{ fontSize: 12, fontWeight: 500, color: "#3a2a1e", cursor: "default" }}>{m}</span>
          ))}
        </div>
        <MenuClock />
      </div>

      {/* Profile center */}
      <div style={{ position: "absolute", inset: 0, top: 24 }}>
        <ProfileCenter />
      </div>

      {/* Desktop icons — left (all icons) */}
        <div 
          className="desktop-icons" 
          style={{
          position: "absolute",
          top: 60,
          left: 28,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          zIndex: 10
        }}>
          {ICONS.map((icon) => (
            <DesktopIcon key={icon.id} {...icon} onClick={openWindow} />
          ))}
        </div>

      {/* Windows */}
      <AnimatePresence>
        {Object.values(windows).map((win) => {
          if (!win || !win.open || win.minimized) return null;
          const def = WINDOW_DEFS[win.id];
          if (!def) return null;
          const Comp = def.component;
          return (
            <Window
              key={win.id}
              id={win.id}
              title={def.title}
              emoji={def.emoji}
              zIndex={win.z}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              initialPos={win.pos}
            >
              <Comp />
            </Window>
          );
        })}
      </AnimatePresence>

      {/* Dock */}
      <div
        className="dock"
        style={{
          position: "fixed",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: "8px 14px",
          background: "rgba(254,250,224,0.62)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          border: `1px solid rgba(212,163,115,0.28)`,
          boxShadow: `0 8px 32px rgba(74,55,40,0.14)`,
          zIndex: 99998,
        }}
      >
        {ICONS.map((icon) => {
          const winState = windows[icon.id];
          const isOpen = winState?.open === true && winState?.minimized !== true;
          return (
            <motion.button
              key={icon.id}
              whileHover={{ scale: 1.28, y: -7 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openWindow(icon.id)}
              title={icon.label}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(145deg, ${C.cream2}, ${C.peach})`,
                border: `1px solid rgba(212,163,115,0.28)`,
                boxShadow: `0 2px 8px rgba(212,163,115,0.18)`,
                cursor: "pointer",
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {icon.emoji}
              {isOpen && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: C.tan,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
