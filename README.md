# Gen-Z Hub (Kenya Student Campus & Directory Platform)

A full-stack campus platform for Kenyan university students featuring **Enemind Hub** (academic revision notes, past papers, internships) and **Find Local** (TikTok-style student discovery for hostels, hotels, student services, health, and entertainment).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gen-z-hub.git
   cd gen-z-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 1-Click Deployment (Vercel / Netlify / Render)

This application is built with **Vite + React 19 + TypeScript + Tailwind CSS**. You can deploy it anywhere with zero backend server setup required:

### Deploy to Vercel
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will auto-detect as **Vite**.
5. Click **Deploy**.

### Deploy to Netlify
1. Go to [Netlify](https://netlify.com) and click **"Add new site" -> "Import an existing project"**.
2. Connect your GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy**.

---

## 📋 Features Included
- **Multi-University & Course Selection**: 40+ verified Kenyan universities & colleges with degree/diploma filters.
- **Enemind Hub**: Course-specific revision notes, past exam papers, model solutions, attachments & jobs.
- **Find Local (TikTok Feed)**: Fullscreen swipeable cards for student hostels, eateries, student services (salons, cyber, photography, tutors), clinics, and music/entertainment.
- **M-Pesa STK Push Integration**: Built-in 7-day trial flow, KSh 200 yearly unlock for EneHub, KSh 200 Find Local unlock, and KSh 100 Seller Google Sheets.
- **Zero-Cost Database via Google Sheets & Drive**: Export and sync listings directly to personal or master Google Sheets via Google Apps Script.
- **Progressive Web App (PWA)**: Add to Home Screen support on Android, iOS, and Desktop browsers.
