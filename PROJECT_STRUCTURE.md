# Project Structure

This is a **React Native app** built with Expo Router. The project contains some Next.js files for v0 preview purposes only - they are not part of the actual mobile app.

## React Native App Files (What You Need)

\`\`\`
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout (ENTRY POINT)
│   ├── index.tsx          # Home screen
│   ├── join.tsx           # Create/Join room
│   ├── waiting.tsx        # Waiting room
│   ├── game.tsx           # Game screen
│   └── results.tsx        # Results screen
├── data/
│   ├── questions.ts       # Question bank
│   └── vibes.ts          # Vibe titles
├── utils/
│   └── gameLogic.ts      # Game logic
├── package.json           # React Native dependencies
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript config
└── README.md             # Setup instructions
\`\`\`

## Next.js Files (Ignore These - For v0 Preview Only)

\`\`\`
├── app/page.tsx          # v0 preview page
├── components/           # shadcn UI (not used in RN)
├── hooks/               # Next.js hooks (not used in RN)
├── lib/                 # Next.js utils (not used in RN)
├── public/              # Next.js assets (not used in RN)
└── styles/              # Next.js styles (not used in RN)
\`\`\`

## Entry Point

The app uses **Expo Router** (file-based routing):
- **Entry point**: `app/_layout.tsx`
- **No App.jsx needed** - Expo Router handles navigation automatically
- Each file in `app/` becomes a screen

## Running the App

\`\`\`bash
# Install dependencies
npm install

# Start Expo
npm start

# Scan QR code with Expo Go app on your phone
\`\`\`

## Important Notes

1. This is a **React Native** app, not a Next.js app
2. The `components/`, `hooks/`, `lib/` folders are for v0 preview only
3. The actual mobile app only uses files in `app/`, `data/`, and `utils/`
4. Entry point is `app/_layout.tsx`, not App.jsx
5. Navigation is handled by Expo Router (file-based)
