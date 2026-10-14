# STACKLY Rehabilitation

A modern, responsive, and dignified static web application for **STACKLY Rehabilitation** — an evidence-based clinical rehabilitation center specializing in physical therapy, neurological restoration, occupational independence, speech-language therapy, and athletic conditioning.

---

## 🎨 Theme & Design System

### 3 Core Theme Colors
| Token | Color Name | Hex Code | Purpose |
|---|---|---|---|
| `--color-primary` | Forest Teal | `#285B50` | Primary brand, primary buttons, accents, icons |
| `--color-bg` | Warm Ivory | `#F4F3EC` | Page backgrounds, calming surfaces, reassuring warmth |
| `--color-accent` | Soft Sand | `#D5A77A` | Accent badges, highlights, CTA hover states |

### Typography
- **Headings & Editorial**: `Cormorant Garamond` (Google Fonts)
- **Navigation, Buttons, Forms & Dashboards**: `Poppins` (Google Fonts)

---

## 📱 Responsive Design Standards

Strictly mobile responsive and tested across all requested breakpoints:
- **1920px** — Ultra-wide high-resolution desktop displays
- **1440px** — Standard widescreen monitors
- **1280px** — Standard laptop displays
- **1024px** — iPad Pro / Tablet landscape
- **768px** — Tablet portrait / Mobile breakpoint (activating hamburger drawer)
- **414px** — Large mobile displays (iPhone 11/12/13/14 Pro Max)
- **390px** — Standard mobile viewports (iPhone 12/13/14/15)
- **375px** — Compact viewports (iPhone SE / smaller Android)

*Zero horizontal overflow (`overflow-x: clip / hidden`), fully accessible touch targets (min 44px), and fluid flex/grid layouts.*

---

## 📁 Project Structure (GitHub Pages Ready)

```
rehabilitation-center/
├── index.html                  # Home page (Hero + 10 Sections + Shared Footer)
├── programs.html               # Programs page (Hero + 8 Sections + FAQs)
├── our-team.html               # Our Team page (Hero + 8 Sections + Live Search/Filters)
├── about.html                  # About page (Hero + 8 Sections + Story + Philosophy)
├── contact.html                # Contact page (Hero + 8 Sections + Branch Offices + Form)
├── appointments.html           # Assessment & Booking Wizard (5-Step prototype + Demos)
├── login.html                  # Login page (Client, Admin role routing)
├── signup.html                 # Signup page (Client, Admin registration)
├── 404.html                    # Custom 404 page ("Back" & "Back to Home" with GSAP)
│
├── AdminDashboard.html         # Administrator Portal (Dark theme, 5 menus, 3 KPIs, triage)
├── PatientDashboard.html       # Patient Portal (5 menus, milestones, resources)
├── ClientDashboard.html        # Alias redirect to PatientDashboard.html
├── Our Team.html               # Alias redirect to our-team.html
│
├── css/
│   ├── style.css               # Core design tokens, base styles, navbar, footer
│   ├── responsive.css          # Breakpoints (375px through 1920px)
│   ├── animations.css          # GSAP reveals, clip-paths, progress line
│   ├── programs.css            # Program grids and condition pills
│   ├── team.css                # Specialist cards and filter bar
│   ├── appointments.css        # Multi-step booking wizard styles
│   └── dashboard.css           # Dark dashboard visual system and off-canvas drawer
│
├── js/
│   ├── main.js                 # Global utilities, toast notifications, dynamic year
│   ├── navigation.js           # Hamburger menu toggle and sticky scroll elevation
│   ├── animations.js           # GSAP ScrollTrigger and KPI counter engine
│   ├── programs.js             # Programs FAQ accordion and hash navigation
│   ├── team.js                 # Live therapist search and specialty filtering
│   ├── appointments.js         # Multi-step booking flow and reschedule/cancel demos
│   ├── validation.js           # Contact inquiry form validation
│   ├── auth.js                 # Auth validation, password toggles, and role routing
│   ├── admin-dashboard.js      # Admin KPI refresh and request triage actions
│   └── patient-dashboard.js    # Interactive milestone checklist and reminders
│
├── assets/                     # 100% WebP images, strictly 70KB - 90KB
│   ├── Brand-logo.webp         # Transparent STACKLY brand logo (76.0 KB)
│   ├── Cover-Image.webp        # Hero primary banner (82.7 KB)
│   ├── ...                     # Categorized in assets/ and assets/images/
│   └── images/
│       ├── hero/
│       ├── programs/
│       ├── therapists/
│       ├── facilities/
│       └── patient-care/
└── README.md
```

---

## 🚀 Authentication & Dashboard Routing

- **Login Page (`login.html`)**:
  - Selecting **"Admin"** redirects to `AdminDashboard.html`
  - Selecting **"Client"** redirects to `PatientDashboard.html`
- **Signup Page (`signup.html`)**:
  - Validates full name, email format, and password length (min 6 characters), then redirects to `login.html`.

---

## 🌐 Deploying to GitHub Pages

1. Push all files to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of STACKLY Rehabilitation platform"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Select Branch: `main` and Folder: `/(root)`.
   - Click **Save**.
3. Your site will be published at `https://<username>.github.io/<repo-name>/`.
