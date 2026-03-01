# Quantioco.io Portal - Elite Coding BootCamp Environment 🚀

A full-stack, state-of-the-art educational portal designed for the Quantioco Engineering Fleet. This platform provides Admins with powerful cohort management tools, and Students with a gamified, beautiful learning experience.

## ✨ Features
- **Student Dashboard:** Real-time XP tracking, GitHub-style Activity Heatmap, Codeforces/Discord integration.
- **Admin Dashboard:** Command center for students, missions, and metrics.
- **Live Classes (Jitsi Meet):** Integrated 1-on-1 video call and full cohort live sessions.
- **Live Materials Sharing:** Admins can push URL links and Notes directly bounding to full cohort live stream screens!
- **Assignment System:** Create coding tasks with robust deadlines, Resource URLs, and Problem Links.
- **New User Approval Flow:** Manual approval workflow ensuring only authorized fleet members get access.
- **Digital License:** Generatable/Downloadable profile cards for students.
- **Gamified Achievements:** XP bounties, Streaks, Levels, and Podium Leaderboards.

## 🛠 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS v4, Framer Motion, Jitsi React SDK, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS.

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas / Local MongoDB instance

### 2. Backend Setup
1. Navigate to `server/`
2. Run `npm install`
3. Set up `.env` with:
   ```env
   PORT=5005
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=super_secret_jwt_key
   ```
4. Start Server: `npm start` (or `node index.js`)

### 3. Frontend Setup
1. Navigate to `client/`
2. Run `npm install`
3. Configure `src/api/axios.js` to point to `http://localhost:5005/api` (if deploying, set your production URL)
4. Start Client: `npm run dev`

### 4. Default Master Admin
- **Email:** \`ravisyro@gmail.com\` or \`ravi@quantioco.io\` (By default bypassed for automatic approval)
- You can register a new account and then login to access the "Command Profile" Admin view.

---
**Built with precision for the Quantioco Engineering Environment.** 🪐
