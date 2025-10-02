# Know Me Better - React Native Multiplayer Game

A fun real-time multiplayer couples game where you answer questions together and see how well you know each other!

## 🎮 Features

- Real-time multiplayer gameplay with Socket.IO
- 80+ curated questions across 8 categories
- Beautiful gradient UI with smooth animations
- Live answer matching and scoring
- Vibe compatibility calculation
- Share results to social media

## 🚀 Quick Start

### Backend Setup

1. **Install backend dependencies:**
\`\`\`bash
cd backend
npm install
\`\`\`

2. **Start the backend server:**
\`\`\`bash
npm run dev
\`\`\`

The server will run on `http://localhost:3001`

### Frontend Setup

#### Option 1: Run in Snack (For Testing UI Only)

1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Create a new Snack
3. Copy all files from this project into Snack
4. **Note**: Socket.IO won't work in Snack - you'll need to run locally for multiplayer

#### Option 2: Run Locally (Full Multiplayer)

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Update Socket.IO URL:**
   - Open `services/socket.ts`
   - Change the URL to your backend server (default: `http://localhost:3001`)

3. **Start the app:**
\`\`\`bash
npm start
\`\`\`

4. **Run on your device:**
   - **iOS**: Scan QR code with Camera app or Expo Go
   - **Android**: Scan QR code with Expo Go app
   - Download Expo Go: [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 📁 Project Structure

\`\`\`
├── App.tsx                # Main entry point with navigation
├── screens/               # All app screens
│   ├── HomeScreen.tsx    # Home screen with create room
│   ├── JoinScreen.tsx    # Join room with code
│   ├── WaitingScreen.tsx # Waiting room for partner
│   ├── GameScreen.tsx    # Real-time gameplay
│   └── ResultsScreen.tsx # Results with vibe match
├── services/
│   └── socket.ts         # Socket.IO client service
├── data/
│   ├── questions.ts      # Question bank (80+ questions)
│   └── vibes.ts          # Vibe titles and scoring
├── utils/
│   └── gameLogic.ts      # Game logic and matching
├── backend/               # Socket.IO backend server
│   ├── server.ts         # Main server file
│   └── package.json      # Backend dependencies
└── package.json          # Frontend dependencies
\`\`\`

## 🎯 How It Works

### Real-time Multiplayer Flow

1. **Player 1** creates a room → receives a 4-digit room code
2. **Player 2** joins using the room code
3. Both players receive the same 5 random questions
4. Each round:
   - Both players submit their answers
   - Server compares answers in real-time
   - Players see if they matched and their updated score
5. After 5 rounds:
   - Server calculates vibe compatibility
   - Both players see final results

### Answer Matching

- Uses fuzzy string matching for flexibility
- Accounts for typos and variations
- Case-insensitive comparison

## 🛠️ Tech Stack

### Frontend
- **React Native** - Mobile framework
- **React Navigation** - Navigation library
- **TypeScript** - Type safety
- **Expo** - Development platform
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js + TypeScript** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **In-memory storage** - Game state management

## 🔧 Configuration

### Environment Variables

Backend (`.env` in `backend/` folder):
\`\`\`
PORT=3001
NODE_ENV=development
\`\`\`

Frontend:
- Update `services/socket.ts` with your backend URL
- For local development: `http://localhost:3001`
- For production: Your deployed backend URL

## 🌐 Deployment

### Backend Deployment
Deploy the backend to any Node.js hosting service:
- Heroku
- Railway
- Render
- DigitalOcean

### Frontend Deployment
Build and deploy with Expo:
\`\`\`bash
expo build:android
expo build:ios
\`\`\`

Or use EAS Build:
\`\`\`bash
eas build --platform all
\`\`\`

## 🔮 Future Enhancements

- Persistent rooms with database
- LLM-powered answer matching
- More question categories
- Custom question creation
- User accounts and game history
- Leaderboards
- Multiple game modes

## 📝 Notes

- Backend must be running for multiplayer to work
- Both players need to be connected to the same backend server
- Game state is stored in memory (resets on server restart)
- For production, consider using Redis or a database for persistence

## 🐛 Troubleshooting

**Socket connection issues:**
- Ensure backend server is running
- Check the URL in `services/socket.ts` matches your backend
- Verify firewall/network settings allow WebSocket connections

**Game not progressing:**
- Check both players are connected
- Look at server logs for errors
- Ensure both players submitted answers

**Questions not loading:**
- Verify backend has access to questions data
- Check server console for errors
