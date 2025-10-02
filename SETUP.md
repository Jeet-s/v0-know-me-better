# Couples Vibe Check - Complete Setup Guide

This guide will help you set up both the frontend (React Native) and backend (Node.js + Socket.IO) for the Couples Vibe Check game.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (for AI-powered answer matching)
- Expo Go app on your phone (for testing React Native app)

## Backend Setup

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

\`\`\`env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=sk-your-openai-api-key-here
\`\`\`

**Get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into your `.env` file

### 3. Start the Backend Server

\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
[v0] Server running on port 3001
\`\`\`

The backend is now running at `http://localhost:3001`

## Frontend Setup

### 1. Install Dependencies

\`\`\`bash
# In the root directory
npm install
\`\`\`

### 2. Configure Socket Connection

The frontend is already configured to connect to `http://localhost:3001`. If you deploy the backend to a different URL, update `services/socket.ts`:

\`\`\`typescript
const SOCKET_URL = "http://localhost:3001" // Change this to your backend URL
\`\`\`

### 3. Start the Frontend

\`\`\`bash
npm start
\`\`\`

This will start the Expo development server. You can:
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your phone
- Press `a` for Android emulator
- Press `i` for iOS simulator

## Testing the Game

### Local Testing (Two Devices)

1. Make sure both devices are on the same network
2. Update `SOCKET_URL` in `services/socket.ts` to use your computer's local IP:
   \`\`\`typescript
   const SOCKET_URL = "http://192.168.1.XXX:3001" // Your computer's IP
   \`\`\`
3. Start the backend server
4. Open the app on both devices
5. Player 1: Create a game → Get room code
6. Player 2: Join game → Enter room code
7. Start playing!

### Web Testing (Single Device)

1. Start the backend server
2. Open two browser windows side by side
3. In window 1: Create a game
4. In window 2: Join with the room code
5. Play the game in both windows

## Deployment

### Backend Deployment (Vercel)

1. Install Vercel CLI:
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. Deploy the backend:
   \`\`\`bash
   cd backend
   vercel
   \`\`\`

3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`

4. Update frontend `SOCKET_URL` to your Vercel URL

### Frontend Deployment

For React Native apps, you can:
- Build for iOS: `expo build:ios`
- Build for Android: `expo build:android`
- Publish to Expo: `expo publish`

## Troubleshooting

### Backend Issues

**Server won't start:**
- Check if port 3001 is already in use
- Make sure all dependencies are installed
- Verify your `.env` file exists and has the correct format

**AI matching not working:**
- Verify your OpenAI API key is correct
- Check your OpenAI account has credits
- Look for error messages in the server console

### Frontend Issues

**Can't connect to backend:**
- Make sure backend server is running
- Check `SOCKET_URL` is correct
- Verify firewall isn't blocking the connection
- For mobile testing, ensure devices are on same network

**App crashes on answer submission:**
- Check browser/app console for errors
- Verify socket connection is established
- Make sure backend is responding to events

### Socket Connection Issues

**Connection timeout:**
- Backend might not be running
- Wrong URL in `SOCKET_URL`
- Network/firewall blocking WebSocket connections

**Disconnects frequently:**
- Check network stability
- Backend might be restarting (in dev mode)
- Look for errors in backend console

## Features Overview

### AI-Powered Matching
- Semantic answer analysis
- Compatibility scoring (0-100%)
- Match explanations
- Personalized vibe analysis

### Real-Time Gameplay
- Instant answer synchronization
- Live score updates
- Room-based multiplayer
- Automatic reconnection

### Beautiful Design
- Gradient backgrounds
- Smooth animations
- Modern UI components
- Responsive layouts

## Support

If you encounter issues:
1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set
3. Make sure you're using compatible Node.js version (18+)
4. Review the error messages carefully

For more help, check the README files in both frontend and backend directories.
