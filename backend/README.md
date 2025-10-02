# Couples Vibe Check - Backend Server

This is the Socket.IO backend server for the Couples Vibe Check multiplayer game with AI-powered answer matching.

## Features

- Real-time multiplayer gameplay using Socket.IO
- Room-based game sessions with unique codes
- **AI-powered answer matching** using OpenAI GPT-4
- Intelligent compatibility analysis with similarity scores
- Personalized vibe analysis for each couple
- Support for 5-round question games

## Setup

### Installation

\`\`\`bash
cd backend
npm install
\`\`\`

### Environment Variables

Create a `.env` file in the backend directory:

\`\`\`
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

**Important:** You need an OpenAI API key for the AI-powered answer matching to work. Get one at https://platform.openai.com/api-keys

### Running the Server

Development mode with auto-reload:
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

The server will start on port 3001 by default.

## AI-Powered Features

### Answer Matching

Instead of simple string comparison, the backend uses OpenAI's GPT-4 to:
- Analyze semantic similarity between answers
- Recognize complementary responses (different but compatible)
- Identify shared values and preferences
- Provide explanations for match/no-match decisions
- Calculate similarity scores (0-100%)

### Vibe Analysis

At the end of each game, AI generates:
- Personalized compatibility analysis
- Creative "vibe" labels for the couple
- Encouraging and romantic messaging
- Fun insights based on their answers

## API Events

### Client → Server

- `create-room` - Create a new game room
  - Params: `playerName: string`
  - Response: `room-created` event with `{ roomCode: string, player: Player }`

- `join-room` - Join an existing room
  - Params: `{ roomCode: string, playerName: string }`
  - Response: `player-joined` event or `error` event

- `start-game` - Start the game (host only)
  - Params: `roomCode: string`
  - Response: `game-started` event with questions

- `submit-answer` - Submit an answer for current round
  - Params: `{ roomCode: string, playerId: string, answer: string }`
  - Response: `round-complete` event when both players answer

- `next-round` - Move to next round or end game
  - Params: `roomCode: string`
  - Response: `next-round` event or `game-over` event

### Server → Client

- `room-created` - Room successfully created
  - Data: `{ roomCode: string, player: Player }`

- `player-joined` - Partner joins the room
  - Data: `{ players: Player[], player: Player }`

- `game-started` - Game starts with questions
  - Data: `{ questions: string[], currentRound: number }`

- `player-answered` - Notifies when a player submits answer
  - Data: `{ playerId: string }`

- `round-complete` - Round results with AI analysis
  - Data: `{ player1Answer: string, player2Answer: string, isMatch: boolean, similarity: number, explanation: string, scores: { player1: number, player2: number } }`

- `next-round` - Next question
  - Data: `{ currentRound: number, question: string }`

- `game-over` - Final results with AI vibe analysis
  - Data: `{ scores: { player1: number, player2: number }, totalRounds: number, vibeAnalysis: string, matchExplanations: string[] }`

- `player-left` - Player disconnected
  - Data: `{ players: Player[] }`

- `error` - Error messages
  - Data: `{ message: string }`

## Game Flow

1. Player 1 creates a room → receives room code
2. Player 2 joins with room code
3. Host starts the game
4. Both players receive the same 5 questions
5. Each round:
   - Both players submit answers
   - **AI analyzes answers for compatibility**
   - Players receive match result with similarity score and explanation
   - Scores are updated
6. After 5 rounds:
   - **AI generates personalized vibe analysis**
   - Both players receive final results with vibe label

## Tech Stack

- Node.js + TypeScript
- Express.js
- Socket.IO for real-time communication
- **Vercel AI SDK** for OpenAI integration
- In-memory game state management

## Fallback Behavior

If the OpenAI API is unavailable or returns an error:
- Falls back to simple string matching
- Uses default vibe messages based on score percentage
- Game continues to function normally
