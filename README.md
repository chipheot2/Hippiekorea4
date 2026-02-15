# Seoul Culture Events Calendar

A beautiful, interactive event calendar for cultural events in Seoul and Suwon.

## Features

- 📅 Monthly calendar view with event management
- 🎨 Color-coded event types (Tours, Workshops, Food Tours, etc.)
- 📱 Fully responsive design
- ⚡ Fast and lightweight
- 🎯 Clear booked vs available day visualization

## Quick Start

### Deploy to Vercel (Recommended - Takes 5 minutes!)

1. **Sign up for Vercel** (free): https://vercel.com/signup
   - Sign in with your GitHub account

2. **Install Vercel CLI** (optional, for command line deployment):
   ```bash
   npm install -g vercel
   ```

3. **Deploy via GitHub** (easiest method):
   - Push this code to a GitHub repository
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Vite and deploy!
   - Your site will be live at: `your-project-name.vercel.app`

4. **Or Deploy via Vercel CLI**:
   ```bash
   cd seoul-events-calendar
   vercel
   ```
   - Follow the prompts
   - Your site goes live instantly!

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

- Edit `src/App.jsx` to modify the calendar functionality
- Update the sample events in the `useState` initialization
- Change colors in `src/index.css`

## Next Steps

- Add a backend to persist events (Firebase, Supabase, etc.)
- Add user authentication
- Connect to a booking/payment system
- Add email notifications

## Tech Stack

- React 18
- Vite
- Lucide React (icons)
- Vanilla CSS with Tailwind-inspired utilities

---

Made with ❤️ for Seoul cultural events
