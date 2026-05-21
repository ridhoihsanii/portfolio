# Portfolio — Rabbani Ridho Ihsani

Personal portfolio website built with HTML, CSS, and vanilla JavaScript. No build step required.

## 🚀 Quick Start

### Option 1 — Open directly in browser
Double-click `index.html`. All assets load from CDN.

### Option 2 — VS Code Live Server (Recommended)
1. Open the `portfolio-ridho` folder in VS Code
2. Install the **Live Server** extension (if not already installed)
3. Right-click `index.html` → **"Open with Live Server"**
4. The site opens at `http://127.0.0.1:5500`

### Option 3 — Any local HTTP server
```bash
# Python (if available)
python -m http.server 3000

# Node.js (npx)
npx serve .
```

---

## 📁 Structure

```
portfolio-ridho/
├── index.html                      # Main HTML file
├── style.css                       # All styles (CSS variables, dark/light)
├── script.js                       # JavaScript (dark mode, animations, nav)
├── assets/
│   ├── profile.jpeg                # Profile photo
│   └── cv-rabbani-ridho-ihsani.pdf # Downloadable CV
└── README.md
```

---

## 🛠 Technologies Used

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Markup     | HTML5 (semantic)                                  |
| Styling    | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Scripting  | Vanilla JavaScript (ES6+)                         |
| Icons      | Font Awesome 6 (CDN)                              |
| Fonts      | Plus Jakarta Sans + Fira Code (Google Fonts CDN)  |
| Animations | AOS — Animate On Scroll (CDN)                     |

> All CDN dependencies load from the internet. An internet connection is required on first load.
> Subsequent loads are cached by the browser.

---

## ✨ Features

- ✅ Dark / Light mode toggle (persists via localStorage)
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth scrolling + active nav highlighting
- ✅ Scroll reveal animations (AOS)
- ✅ Animated skill progress bars (trigger on scroll)
- ✅ Role text cycler with fade animation
- ✅ 3D tilt hover on project cards
- ✅ Floating badges on hero photo
- ✅ Back-to-top button
- ✅ Download CV button
- ✅ Contact form (mailto)
- ✅ SEO meta tags

---

## 🎨 Customization

All colors are CSS custom properties in `style.css` (`:root` block):

```css
--accent:   #6366f1;   /* primary indigo */
--accent-2: #8b5cf6;   /* purple gradient */
```

Change these to update the entire color scheme instantly.

---

## 📦 Dependencies (CDN)

```
Font Awesome 6.5.0   https://cdnjs.cloudflare.com/
Plus Jakarta Sans    https://fonts.googleapis.com/
Fira Code            https://fonts.googleapis.com/
AOS 2.3.4            https://unpkg.com/aos@2.3.4/
```

No npm install needed.
