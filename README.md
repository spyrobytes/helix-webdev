# Helixbytes

> AI-Native Software Solutions — Full-stack development, AI integration, intelligent web solutions, and cloud architecture.

A modern, high-performance marketing website built with Next.js 16 App Router, featuring sophisticated scroll-triggered animations, a secure contact form with Firebase backend, and static export for Firebase Hosting.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%2B%20Functions-FFCA28?logo=firebase)
![License](https://img.shields.io/badge/License-Private-red)

## ✨ Features

- **Next.js 16 App Router** — Latest React Server Components architecture with static export
- **Sophisticated Animations** — Scroll-triggered 3D card flips, fade-ins, and morphing menu
- **Secure Contact Form** — Multi-layer security with honeypot, rate limiting, and Firebase App Check
- **CSS Modules** — Scoped styling with design tokens, no external CSS frameworks
- **Accessibility First** — ARIA attributes, keyboard navigation, reduced motion support
- **Firebase Backend** — Cloud Functions for form handling, Firestore for data persistence

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/helix-webdev.git
cd helix-webdev

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Testing Contact Form (Local)

The contact form requires Firebase emulators for local testing:

```bash
# Install function dependencies
cd functions && npm install && cd ..

# Start Firebase emulators
firebase emulators:start

# In another terminal, run the dev server
npm run dev
```

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── services/           # Services page
│   │   ├── approach/           # Approach page
│   │   ├── why-helixbytes/     # Why Helixbytes page
│   │   └── contact/            # Contact page + verified confirmation
│   ├── components/
│   │   ├── layout/             # Header, Footer, BackgroundLayers
│   │   ├── menu/               # Fullscreen morphing menu
│   │   ├── home/               # Hero, Services, Mission sections
│   │   ├── services/           # Service detail components
│   │   ├── contact/            # Contact form components
│   │   └── shared/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Firebase & Sanity clients
│   ├── constants/              # Static data & configuration
│   ├── styles/                 # CSS variables & tokens
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Helper functions
├── functions/                  # Firebase Cloud Functions
├── public/                     # Static assets
└── docs/                       # Project documentation
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | CSS Modules |
| Backend | Firebase Cloud Functions |
| Database | Firestore |
| Hosting | Firebase Hosting |
| Security | Firebase App Check (reCAPTCHA Enterprise) |

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export to /out)
npm run start    # Start production server (for testing)
npm run lint     # Run ESLint
```

### Firebase Commands

```bash
firebase emulators:start              # Local backend testing
firebase deploy --only hosting        # Deploy static site
firebase deploy --only functions      # Deploy Cloud Functions
firebase deploy                       # Deploy everything
```

## ⚙️ Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase App Check (reCAPTCHA Enterprise)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Development only
NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=your-debug-token
```

## 🔒 Security Features

The contact form implements multiple security layers:

1. **Honeypot Field** — Hidden field that bots fill out, triggering silent rejection
2. **Time-based Detection** — Submissions under 3 seconds are flagged as bots
3. **Firebase App Check** — reCAPTCHA Enterprise verification
4. **Rate Limiting** — 5 requests per hour per IP address
5. **Input Sanitization** — XSS prevention on all inputs
6. **Firestore Rules** — Deny all client-side access; server-only writes

## 🚢 Deployment

### Firebase Hosting (Recommended)

```bash
# Build the static site
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Cloud Functions

```bash
# Build and deploy functions
cd functions
npm run build
firebase deploy --only functions
```

## 🎨 Design System

CSS custom properties are defined in `src/styles/variables.css`:

```css
:root {
  /* Colors */
  --bg-gradient-1: #050816;
  --accent-1: #38bdf8;
  --text-main: #f9fafb;
  
  /* Z-Index Layers */
  --z-header: 100;
  --z-menu-panel: 1001;
  --z-menu-toggle: 1002;
}
```

## 📚 Documentation

- [Implementation Plan](docs/helixbytes-implementation-plan.md)
- [Migration Strategy](docs/migration-strategy.md)
- [Firebase Setup](docs/firebase-commands.md)
- [Session Summary](docs/SESSION-SUMMARY.md)

## 🤝 Contributing

This is a private repository. Please contact the team lead for contribution guidelines.

## 📄 License

Private and Confidential. All rights reserved.

---

Built with ❤️ by the Helixbytes team
