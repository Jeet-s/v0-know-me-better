export default function Page() {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Know Me Better 💕</h1>

      <div
        style={{
          background: "#FFF5F7",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>📱 This is a React Native App</h2>
        <p>
          This project is built with React Native and Expo, not Next.js. To run it, you need to use the Expo development
          environment.
        </p>
      </div>

      <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>🚀 How to Run</h2>

      <h3 style={{ fontSize: "18px", marginTop: "20px", marginBottom: "10px" }}>1. Install Dependencies</h3>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          overflow: "auto",
        }}
      >
        <code>npm install</code>
      </pre>

      <h3 style={{ fontSize: "18px", marginTop: "20px", marginBottom: "10px" }}>2. Start the Backend Server</h3>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          overflow: "auto",
        }}
      >
        <code>{`cd backend
npm install
npm run dev`}</code>
      </pre>

      <h3 style={{ fontSize: "18px", marginTop: "20px", marginBottom: "10px" }}>3. Start the Expo App</h3>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          overflow: "auto",
        }}
      >
        <code>npm start</code>
      </pre>

      <h3 style={{ fontSize: "18px", marginTop: "20px", marginBottom: "10px" }}>4. Run on Device</h3>
      <ul style={{ marginLeft: "20px" }}>
        <li>
          <strong>iOS:</strong> Press <code>i</code> in the terminal or scan QR code with Camera app
        </li>
        <li>
          <strong>Android:</strong> Press <code>a</code> in the terminal or scan QR code with Expo Go app
        </li>
        <li>
          <strong>Web:</strong> Press <code>w</code> in the terminal (limited functionality)
        </li>
      </ul>

      <h2 style={{ fontSize: "24px", marginTop: "30px", marginBottom: "15px" }}>📋 Project Structure</h2>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          overflow: "auto",
          fontSize: "14px",
        }}
      >
        <code>{`├── App.tsx                 # React Navigation setup
├── screens/                # React Native screens
│   ├── HomeScreen.tsx
│   ├── JoinScreen.tsx
│   ├── WaitingScreen.tsx
│   ├── GameScreen.tsx
│   └── ResultsScreen.tsx
├── services/               # Services
│   └── socket.ts          # Socket.IO client
├── data/                   # Game data
│   ├── questions.ts
│   └── vibes.ts
├── backend/                # Backend server
│   ├── server.ts          # Socket.IO server
│   └── ai-matcher.ts      # AI-powered matching
└── package.json`}</code>
      </pre>

      <h2 style={{ fontSize: "24px", marginTop: "30px", marginBottom: "15px" }}>✨ Features</h2>
      <ul style={{ marginLeft: "20px" }}>
        <li>Real-time multiplayer game using Socket.IO</li>
        <li>AI-powered answer matching with OpenAI</li>
        <li>80+ questions about preferences and personality</li>
        <li>Vibe compatibility scoring</li>
        <li>Room-based system with join codes</li>
      </ul>

      <div
        style={{
          background: "#FFF5F7",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "30px",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>⚙️ Environment Setup</h3>
        <p>Make sure to set up your OpenAI API key in the backend:</p>
        <pre
          style={{
            background: "#fff",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          <code>OPENAI_API_KEY=your_api_key_here</code>
        </pre>
      </div>

      <p style={{ marginTop: "30px", color: "#666" }}>
        For more details, check out the <code>README.md</code> and <code>SETUP.md</code> files.
      </p>
    </div>
  )
}
