export default function Page() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          textAlign: "center",
          background: "white",
          padding: "3rem",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "1rem" }}>💕</div>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#FF6B9D",
            marginBottom: "1rem",
          }}
        >
          Know Me Better
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#666",
            marginBottom: "2rem",
          }}
        >
          React Native Mobile App
        </p>
        <div
          style={{
            background: "#FFF5F7",
            padding: "2rem",
            borderRadius: "15px",
            marginBottom: "1.5rem",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#FF6B9D",
              marginBottom: "1rem",
            }}
          >
            🚀 Getting Started
          </h2>
          <ol
            style={{
              color: "#333",
              lineHeight: "2",
              paddingLeft: "1.5rem",
              margin: 0,
            }}
          >
            <li>
              Install dependencies:{" "}
              <code
                style={{
                  background: "#FFE5EC",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                }}
              >
                npm install
              </code>
            </li>
            <li>
              Start Expo:{" "}
              <code
                style={{
                  background: "#FFE5EC",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                }}
              >
                npm start
              </code>
            </li>
            <li>Scan QR code with Expo Go app on your phone</li>
            <li>Play the game with your partner! 💑</li>
          </ol>
        </div>
        <div
          style={{
            background: "#FFF9E6",
            padding: "1rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "#666",
              margin: 0,
            }}
          >
            📱 <strong>Download Expo Go:</strong>{" "}
            <a
              href="https://apps.apple.com/app/expo-go/id982107779"
              style={{ color: "#FF6B9D", textDecoration: "none" }}
            >
              iOS
            </a>{" "}
            |{" "}
            <a
              href="https://play.google.com/store/apps/details?id=host.exp.exponent"
              style={{ color: "#FF6B9D", textDecoration: "none" }}
            >
              Android
            </a>
          </p>
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "#999",
            lineHeight: "1.6",
          }}
        >
          <p style={{ margin: "0.5rem 0" }}>
            ✨ <strong>Features:</strong> 80+ questions, beautiful UI, mock gameplay
          </p>
          <p style={{ margin: "0.5rem 0" }}>
            🛠️ <strong>Tech:</strong> React Native, Expo Router, TypeScript
          </p>
          <p style={{ margin: "0.5rem 0" }}>
            📖 See{" "}
            <code style={{ background: "#FFE5EC", padding: "0.2rem 0.4rem", borderRadius: "3px" }}>README.md</code> and{" "}
            <code style={{ background: "#FFE5EC", padding: "0.2rem 0.4rem", borderRadius: "3px" }}>
              PROJECT_STRUCTURE.md
            </code>{" "}
            for details
          </p>
        </div>
      </div>
    </div>
  )
}
