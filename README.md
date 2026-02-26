# 🖥️ SakshamOS — Interactive 3D Developer Portfolio

A macOS-inspired interactive developer portfolio built with React + Vite + Framer Motion, featuring a fully custom-built 3D technology globe, draggable windows, terminal simulation, and animated UI.

## 🌐 Live Demo

Deploy via Vercel: [https://sakshamtripathi.vercel.app](https://sakshamtripathi.vercel.app)

---

## 🚀 Core Features

### 🌍 Interactive 3D Technology Globe
- Custom Fibonacci sphere distribution
- Manual 3D rotation engine (no Three.js)
- Mouse-controlled velocity
- Idle auto-rotation
- Depth-based scaling
- Z-index depth sorting
- Billboard rendering (no mirrored text)
- Opacity fade for backside elements

### 🪟 Desktop-Style Window Manager
- Draggable windows
- Focus-based z-index system
- Minimize / Close controls
- Persistent window state (localStorage)
- Smooth spring animations

### 💻 Interactive Terminal (SakshamOS CLI)
Built-in commands:
- `help`
- `whoami`
- `education`
- `skills`
- `projects`
- `contact`
- `resume`
- `github`
- `linkedin`
- `date`
- `joke`
- `clear`

Dynamic function-based responses supported.

---

## 📂 Portfolio Sections
- About
- Projects
- Skills
- Contact
- Resume Viewer
- Terminal

---

## ✨ Animations
- Framer Motion transitions
- Floating profile animation
- Dock hover effects
- Typewriter intro
- Window mount/unmount animations

---

## 🧠 3D Globe Architecture

This project does not use Three.js.

Instead:
- Points are distributed using Fibonacci sphere mathematics.
- Each animation frame:
  - Applies X/Y rotation matrix
  - Recalculates positions
  - Updates depth scaling
  - Updates opacity
  - Updates zIndex
- Labels are billboarded so text never mirrors.

This avoids:
- CSS 3D flattening
- Transform inheritance bugs
- Mirrored backside text
- Performance-heavy WebGL

---

## 🛠 Tech Stack

### Frontend:
- React
- Vite
- Framer Motion

### 3D Engine:
- Manual trigonometric rotation
- `requestAnimationFrame` loop
- Depth projection logic

### State Management:
- `useState`
- `useRef`
- `useEffect`

### Styling:
- Inline CSS
- Custom palette system

### Deployment:
- Vercel (recommended)

---

## 📁 Project Structure

```
Portfolio/
│
├── public/
│   ├── profile.jpg
│   ├── Saksham-Dev-Resume.pdf
│   └── logos/
│
├── src/
│   ├── MacDesktopPortfolio.jsx
│   ├── main.jsx
│   └── components/
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠 Installation

1. Clone repository:
   ```bash
   git clone https://github.com/Saksham-Xtreme/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

4. Open:
   [http://localhost:5173](http://localhost:5173)

5. Build production:
   ```bash
   npm run build
   ```

---

## 🚀 Deployment (Vercel Recommended)

1. Push project to GitHub.
2. Go to [https://vercel.com](https://vercel.com).
3. Import repository.
4. Framework preset: **Vite**.
5. Click **Deploy**.

No extra configuration required.

---

## ⚠ ESLint Fix (If Deployment Fails)

If you see ESLint peer dependency conflict:

1. Run locally:
   ```bash
   npm uninstall eslint
   npm install -D eslint@^9
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Commit and redeploy.

---

## 🎯 Future Enhancements
- Physics-based drag inertia
- Lighting simulation
- Backside blur effect
- Scroll-driven animations
- Touch support
- WebGL upgrade
- Dark mode toggle

---

## 👨‍💻 Author

**Saksham Tripathi**  
Full Stack Developer — MERN Stack  
Focused on Web Security and Scalable Systems  

- GitHub: [https://github.com/Saksham-Xtreme](https://github.com/Saksham-Xtreme)
- LinkedIn: [https://linkedin.com/in/saksham-tripathi-7b25b0330](https://linkedin.com/in/saksham-tripathi-7b25b0330)
- Email: [shivbhau2108@gmail.com](mailto:shivbhau2108@gmail.com)

---

## 📄 License

MIT License
