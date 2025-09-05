# 🛡️ HerShield - Quick Setup Guide

## One-Command Setup

### 1. Initialize Database (First Time Only)
```bash
node init-database.js
```

### 2. Start Everything
```bash
./start-hershield.sh
```

### 3. Stop Everything
```bash
./stop-hershield.sh
```

## What You Get

- **🌐 Frontend**: http://localhost:8080
- **🔧 Backend API**: http://localhost:5000  
- **💾 MongoDB**: mongodb://localhost:27017/hershield

## Quick Access Links

Once running, visit:

- **🏠 Homepage**: http://localhost:8080
- **📊 Dashboard**: http://localhost:8080/dashboard  
- **🛡️ Safety Center**: http://localhost:8080/safety
- **🧠 AI Safety Hub**: http://localhost:8080/ai ← **NEW AI FEATURES!**

## Features Available

### ✅ Core Features
- User authentication and profiles
- Safety dashboard and metrics
- Emergency button and alerts
- Threat reporting system
- Safety resources directory

### 🧠 AI Features (NEW!)
- **Message Analyzer**: AI-powered threat detection in messages/emails
- **Safety Advisor**: Personalized safety advice and risk assessment
- **Emergency Center**: Real-time emergency response coordination
- **Quick Tests**: Sample scenarios to test AI capabilities

## Troubleshooting

### Services Not Starting?
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if needed
brew services start mongodb-community@7.0

# Check logs
tail -f logs/backend.log
tail -f logs/frontend.log
```

### Database Issues?
```bash
# Reinitialize database
node init-database.js

# Check MongoDB connection
mongosh hershield --eval "db.safetytips.countDocuments()"
```

### Ports Already in Use?
```bash
# Kill processes on ports
lsof -ti:5000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Then restart
./start-hershield.sh
```

## Development

### File Structure
```
hershield-safeguard-kenya/
├── frontend/              # React + TypeScript frontend
├── backend/               # Node.js + Express backend
├── src/                   # Frontend source code
│   ├── components/ai/     # AI feature components
│   ├── pages/            # Application pages  
│   └── lib/api.ts        # API client
├── start-hershield.sh    # Start script
├── stop-hershield.sh     # Stop script
└── init-database.js      # Database setup
```

### Environment Variables
Backend (`.env`):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hershield
JWT_SECRET=your-secret-key
JWT_EXPIRE=90d
```

Frontend (`.env`):
```
VITE_API_BASE_URL=http://localhost:5000
```

## Testing the AI Features

1. Go to: http://localhost:8080/ai
2. Try the **Message Analyzer**:
   - Enter: "Someone has been following me home"
   - See AI threat analysis results
3. Use the **Safety Advisor**:
   - Describe a situation: "Meeting someone from a dating app"
   - Get personalized safety advice
4. Test **Emergency Center**:
   - Select emergency type
   - Get immediate response plan

## Production Deployment

For production, use Docker:
```bash
# Build and run with Docker
docker-compose up --build

# Or use the provided Docker script
bash docker-start.sh
```

## Support

- **Backend API Docs**: http://localhost:5000/health
- **Logs**: Check `logs/` directory
- **MongoDB**: Use MongoDB Compass or mongosh
- **Issues**: Check console logs in browser dev tools

---

**🚀 Ready to go! Run `./start-hershield.sh` and visit http://localhost:8080**
