# Know Me Better - React Native App

A fun couples game where you answer questions together and see how well you know each other!

## 🎮 Features

- 80+ curated questions across 8 categories
- Beautiful pastel UI with smooth animations
- Mock game flow (no backend required)
- Share results to social media
- Vibe titles based on your score

## 🚀 Quick Start

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Start the app:**
\`\`\`bash
npm start
\`\`\`

3. **Run on your device:**
   - **iOS**: Scan QR code with Camera app or Expo Go
   - **Android**: Scan QR code with Expo Go app
   - Download Expo Go: [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 📁 Project Structure

\`\`\`
├── app/                    # Screens (Expo Router)
│   ├── _layout.tsx        # Root layout (ENTRY POINT)
│   ├── index.tsx          # Home screen
│   ├── join.tsx           # Create/Join room
│   ├── waiting.tsx        # Waiting room with countdown
│   ├── game.tsx           # Game screen
│   └── results.tsx        # Results with vibe title
├── data/
│   ├── questions.ts       # Question bank (80+ questions)
│   └── vibes.ts          # Vibe titles and scoring
├── utils/
│   └── gameLogic.ts      # Game logic and matching
├── package.json           # Dependencies
└── app.json              # Expo configuration
\`\`\`

## 🎯 How It Works

This is a standalone demo version with mock data:
- Partner answers are simulated
- Answer matching uses simple text comparison
- No real-time multiplayer (yet!)

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **Expo Router** - File-based navigation
- **TypeScript** - Type safety
- **Expo Go** - Development client

## 📱 Entry Point

The app uses **Expo Router** for navigation:
- **Entry point**: `app/_layout.tsx` (root layout)
- **Home screen**: `app/index.tsx`
- **Navigation**: File-based (no App.jsx needed)

## 🔮 Future Enhancements

- Real multiplayer with Socket.IO
- Backend integration for persistent rooms
- LLM-powered answer matching
- More question categories
- Custom question creation
- User accounts and history

## 📝 Notes

- This is a React Native app (not Next.js)
- Some Next.js files exist for v0 preview only
- The actual mobile app only uses `app/`, `data/`, and `utils/` folders
- See `PROJECT_STRUCTURE.md` for detailed file organization
