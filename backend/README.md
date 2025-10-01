# Know Me Better - Backend Server

Node.js backend server for the Couples Vibe game with Socket.IO real-time communication.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create a \`.env\` file:
\`\`\`env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/couples-vibe
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

3. Start MongoDB:
\`\`\`bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
\`\`\`

4. Start the server:
\`\`\`bash
npm start

# Or for development with auto-reload
npm run dev
\`\`\`

## API Endpoints

### HTTP Endpoints

- \`GET /health\` - Health check endpoint

### Socket.IO Events

#### Client → Server

- \`createRoom\` - Create a new game room
  - Payload: \`{ playerName: string }\`
  - Response: \`{ success: boolean, roomCode: string, message: string }\`

- \`joinRoom\` - Join an existing room
  - Payload: \`{ roomCode: string, playerName: string }\`
  - Response: \`{ success: boolean, message: string }\`

- \`startGame\` - Start the game (host only)
  - Payload: \`{ roomCode: string }\`

- \`submitAnswer\` - Submit an answer for the current round
  - Payload: \`{ roomCode: string, answer: string }\`
  - Response: \`{ success: boolean, message?: string }\`

#### Server → Client

- \`playerJoined\` - Notifies when a player joins the room
  - Payload: \`{ players: Array<{ name: string, isHost: boolean }> }\`

- \`gameStarted\` - Notifies when the game starts
  - Payload: \`{ currentRound: number, totalRounds: number, question: string }\`

- \`waitingForPlayer\` - Notifies that we're waiting for the other player
  - Payload: \`{ waitingFor: string }\`

- \`roundResult\` - Sends the result of a round
  - Payload: \`{ round: number, question: string, answers: Array, isMatch: boolean, currentScore: number }\`

- \`nextRound\` - Notifies to move to the next round
  - Payload: \`{ currentRound: number, totalRounds: number, question: string }\`

- \`gameOver\` - Notifies when the game is complete
  - Payload: \`{ finalScore: number, totalRounds: number, rounds: Array }\`

## Database Schema

### Room Collection

\`\`\`javascript
{
  roomCode: String (4 characters, unique),
  players: [{
    socketId: String,
    name: String,
    isHost: Boolean
  }],
  status: String (waiting | playing | completed),
  questions: [String],
  currentRound: Number,
  rounds: [{
    question: String,
    answers: [{
      playerName: String,
      answer: String
    }],
    isMatch: Boolean
  }],
  score: Number,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Question Bank

The game includes 100 curated questions across 8 categories:
- Food & Dining (15 questions)
- Entertainment & Media (15 questions)
- Lifestyle & Preferences (15 questions)
- Love & Relationships (10 questions)
- Friends & Social (10 questions)
- Travel & Adventure (10 questions)
- Quirks & Random (15 questions)
- Memories & Nostalgia (10 questions)

Questions are randomly selected for each game session.

## LLM Integration

The server uses OpenAI's GPT-4o-mini model to judge if two answers match. The LLM is instructed to be generous in matching - answers don't need to be identical, just express the same core idea.

### Fallback Logic

If the OpenAI API fails, the system falls back to simple string comparison.

## Environment Variables

- \`PORT\` - Server port (default: 3001)
- \`MONGODB_URI\` - MongoDB connection string
- \`OPENAI_API_KEY\` - OpenAI API key for answer judging

## Development

The server uses:
- Express.js for HTTP server
- Socket.IO for WebSocket communication
- Mongoose for MongoDB ODM
- OpenAI SDK for LLM integration

## Testing

You can test the Socket.IO connection using the health endpoint:

\`\`\`bash
curl http://localhost:3001/health
\`\`\`

For Socket.IO testing, use the React Native app or a Socket.IO client tool.
\`\`\`
