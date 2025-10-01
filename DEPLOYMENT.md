# Deployment Guide

## Frontend Deployment (React Native)

### Option 1: Expo Go (Development/Testing)

1. Install Expo Go app on your iOS/Android device
2. Run \`npm start\` in the project root
3. Scan the QR code with your device
4. The app will load in Expo Go

### Option 2: Build Standalone App

1. Install EAS CLI:
\`\`\`bash
npm install -g eas-cli
\`\`\`

2. Login to Expo:
\`\`\`bash
eas login
\`\`\`

3. Configure the build:
\`\`\`bash
eas build:configure
\`\`\`

4. Build for iOS:
\`\`\`bash
eas build --platform ios
\`\`\`

5. Build for Android:
\`\`\`bash
eas build --platform android
\`\`\`

6. Submit to app stores:
\`\`\`bash
eas submit --platform ios
eas submit --platform android
\`\`\`

## Backend Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

3. Create \`vercel.json\`:
\`\`\`json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
\`\`\`

4. Deploy:
\`\`\`bash
vercel
\`\`\`

5. Set environment variables in Vercel dashboard:
   - \`MONGODB_URI\`
   - \`OPENAI_API_KEY\`

### Option 2: Railway

1. Create account at railway.app
2. Create new project
3. Connect GitHub repository
4. Add MongoDB plugin
5. Set environment variables
6. Deploy automatically on push

### Option 3: Heroku

1. Install Heroku CLI
2. Create new app:
\`\`\`bash
heroku create couples-vibe-backend
\`\`\`

3. Add MongoDB addon:
\`\`\`bash
heroku addons:create mongolab
\`\`\`

4. Set environment variables:
\`\`\`bash
heroku config:set OPENAI_API_KEY=your_key_here
\`\`\`

5. Deploy:
\`\`\`bash
git push heroku main
\`\`\`

## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create account at mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses (or allow from anywhere for development)
5. Get connection string
6. Update \`MONGODB_URI\` in your environment variables

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: \`mongodb://localhost:27017/couples-vibe\`

## Update Frontend with Backend URL

After deploying the backend, update the Socket.IO URL in the frontend:

\`\`\`typescript
// services/socket.ts
const SOCKET_URL = "https://your-backend-url.com"
\`\`\`

## Environment Variables Checklist

### Backend
- [ ] \`PORT\` (optional, defaults to 3001)
- [ ] \`MONGODB_URI\` (required)
- [ ] \`OPENAI_API_KEY\` (required)

### Frontend
- [ ] Update \`SOCKET_URL\` in \`services/socket.ts\`

## Testing Production

1. Test the backend health endpoint:
\`\`\`bash
curl https://your-backend-url.com/health
\`\`\`

2. Test Socket.IO connection from the app
3. Create a room and verify real-time communication
4. Play a full game to test all features

## Monitoring

- Monitor backend logs for errors
- Track Socket.IO connection issues
- Monitor MongoDB performance
- Track OpenAI API usage and costs

## Scaling Considerations

- Use Redis for Socket.IO adapter when scaling horizontally
- Implement rate limiting for API endpoints
- Add caching for frequently accessed data
- Monitor and optimize database queries
- Consider CDN for static assets
\`\`\`
