# Know Me Better - Couples Vibe App

A React Native mobile game where couples answer questions to see how well they know each other!

## Project Structure

\`\`\`
couples-vibe-app/
├── app/                    # Expo Router screens
│   ├── index.tsx          # Home screen
│   ├── join.tsx           # Create/Join room
│   ├── waiting.tsx        # Waiting room
│   ├── game.tsx           # Game screen
│   └── results.tsx        # Results screen
├── backend/               # Node.js backend
│   ├── server.js          # Express + Socket.IO server
│   ├── models/            # MongoDB models
│   ├── services/          # LLM and game logic
│   └── data/              # Question bank
├── services/              # Frontend services
│   └── socket.ts          # Socket.IO client
└── components/            # Reusable components
\`\`\`

## Setup Instructions

### Frontend (React Native)

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Update the backend URL in `services/socket.ts`:
\`\`\`typescript
const SOCKET_URL = 'http://YOUR_IP:3001'; // Use your local IP for testing on device
\`\`\`

3. Start the Expo development server:
\`\`\`bash
npm start
\`\`\`

4. Scan the QR code with Expo Go app (iOS/Android)

### Backend (Node.js)

1. Navigate to backend directory:
\`\`\`bash
cd backend
npm install
\`\`\`

2. Create `.env` file:
\`\`\`
PORT=3001
MONGODB_URI=mongodb://localhost:27017/couples-vibe
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

3. Start the backend server:
\`\`\`bash
npm start
\`\`\`

## Features

- Real-time multiplayer game using Socket.IO
- AI-powered answer matching using LLM
- 100 curated questions across 8 categories
- Beautiful pastel UI with animations
- Share results to social media
- Fun "vibe titles" based on scores

## Tech Stack

**Frontend:**
- React Native (Expo)
- Expo Router for navigation
- Socket.IO client for real-time communication
- React Native Animatable for animations

**Backend:**
- Node.js + Express
- Socket.IO for WebSocket communication
- MongoDB for data persistence
- OpenAI API for answer judging

## Next Steps

1. Set up MongoDB locally or use MongoDB Atlas
2. Get an OpenAI API key
3. Test the app on your device using Expo Go
4. Customize questions in `backend/data/questions.json`
