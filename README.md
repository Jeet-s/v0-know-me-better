# Know Me Better - React Native App

A fun couples game where you answer questions together and see how well you know each other!

## 🎮 Features

- 80+ curated questions across 8 categories
- Beautiful pastel UI with smooth animations
- Mock game flow (no backend required)
- Share results to social media
- Vibe titles based on your score

## 🚀 Quick Start

### Option 1: Run in Snack (Easiest!)

1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Create a new Snack
3. Copy all files from this project into Snack
4. The app will automatically run!

### Option 2: Run Locally

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
├── App.tsx                # Main entry point with navigation
├── screens/               # All app screens
│   ├── HomeScreen.tsx    # Home screen
│   ├── JoinScreen.tsx    # Create/Join room
│   ├── WaitingScreen.tsx # Waiting room with countdown
│   ├── GameScreen.tsx    # Game screen
│   └── ResultsScreen.tsx # Results with vibe title
├── data/
│   ├── questions.ts      # Question bank (80+ questions)
│   └── vibes.ts          # Vibe titles and scoring
├── utils/
│   └── gameLogic.ts      # Game logic and matching
└── package.json          # Dependencies
\`\`\`

## 🎯 How It Works

This is a standalone demo version with mock data:
- Partner answers are simulated
- Answer matching uses simple text comparison
- No real-time multiplayer (yet!)

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **React Navigation** - Navigation library
- **TypeScript** - Type safety
- **Expo** - Development platform

## 📱 Entry Point

The app uses **React Navigation**:
- **Entry point**: `App.tsx` (main navigation setup)
- **Home screen**: `screens/HomeScreen.tsx`
- **Navigation**: Stack navigator with 5 screens

## 🔮 Future Enhancements

- Real multiplayer with Socket.IO
- Backend integration for persistent rooms
- LLM-powered answer matching
- More question categories
- Custom question creation
- User accounts and history

## 📝 Notes

- This app is compatible with Expo Snack
- Uses React Navigation for routing
- All screens are in the `screens/` folder
- Mock data simulates partner responses
