# 🛡️ HerShield Safeguard Kenya

> A comprehensive AI-powered safety platform designed to protect women and girls in Kenya through advanced threat detection, emergency response systems, and community support networks.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green.svg)](https://www.mongodb.com/)

## 🚀 Quick Start

**🚨 One-Command Setup:**
```bash
# Initialize database (first time only)
node init-database.js

# Start everything
./start-hershield.sh
```

**📱 Access the Application:**
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5050  
- **MongoDB**: mongodb://localhost:27017/hershield

## 🎯 Key Features

### 🧠 AI-Powered Safety Features (NEW!)
- **Message Analyzer**: Real-time threat detection in messages and emails
- **Safety Advisor**: Personalized safety advice and risk assessments 
- **Emergency Center**: AI-powered emergency response coordination
- **Quick Safety Tests**: Pre-built scenarios for testing AI capabilities

### 🛡️ Core Safety Features
- **Dashboard**: Comprehensive safety metrics and insights
- **Emergency Button**: One-click emergency alerts with location sharing
- **Threat Reporting**: Community-driven incident reporting system
- **Safety Resources**: Kenya-specific emergency contacts and support services
- **User Authentication**: Secure user profiles and data protection

### 🇰🇪 Kenya-Specific Integration
- **Emergency Services**: Direct integration with Kenya Police (911, 999)
- **Local Support**: Gender Violence Recovery Centre, NGEC, Childline Kenya
- **Cultural Context**: Understanding of local safety challenges and solutions
- **County Coverage**: Support for all 47 Kenyan counties

## 📱 Mobile Compatibility

HerShield is fully **mobile-responsive** and works seamlessly on:
- ✅ Android devices (all versions)
- ✅ iOS devices (iPhone/iPad)
- ✅ Desktop browsers
- ✅ Progressive Web App (PWA) capabilities

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + **shadcn/ui** components
- **Vite** for fast development and builds
- **Progressive Web App** capabilities

### Backend
- **Node.js 18+** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with bcrypt
- **Rate limiting** and security middleware

### AI Integration
- **OpenAI API** for advanced threat analysis
- **Fallback systems** for offline functionality
- **Multi-layered analysis** for comprehensive threat detection
- **Kenya-specific context** training

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB 7+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hershield-safeguard-kenya.git
   cd hershield-safeguard-kenya
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Setup environment variables**
   ```bash
   # Frontend (.env)
   VITE_API_BASE_URL=http://localhost:5050
   
   # Backend (backend/.env)
   NODE_ENV=development
   PORT=5050
   MONGODB_URI=mongodb://localhost:27017/hershield
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=90d
   ```

4. **Initialize database**
   ```bash
   node init-database.js
   ```

5. **Start development servers**
   ```bash
   ./start-hershield.sh
   ```

### Docker Deployment

```bash
# Build and run with Docker
docker-compose up --build

# Or use the provided script
bash docker-start.sh
```

## 🌟 AI Features Deep Dive

### 1. Message Analyzer
- **Real-time threat detection** with confidence scoring
- **Multi-layered analysis**: harassment, cyberbullying, stalking detection
- **Sentiment analysis** with emotion recognition
- **Cultural context** awareness for Kenyan communications
- **History tracking** for pattern recognition

### 2. Safety Advisor
- **Situational assessment** based on location, time, and risk factors
- **Personalized recommendations** for different scenarios
- **Emergency resource directory** with local contacts
- **Risk scoring** with visual indicators
- **Prevention strategies** and safety planning

### 3. Emergency Center
- **Intelligent emergency response** generation
- **GPS location services** with address resolution
- **Direct integration** with Kenyan emergency services
- **Multi-channel alerts**: SMS, call, app notifications
- **Follow-up support** and resource connections

## 📊 API Documentation

### Authentication
```bash
# Register user
POST /api/v1/auth/register
{
  "firstName": "Jane",
  "lastName": "Doe", 
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}

# Login
POST /api/v1/auth/login
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```

### AI Features
```bash
# Analyze message
POST /api/v1/ai/analyze-message
{
  "message": "Content to analyze",
  "context": "dating"
}

# Get safety advice
POST /api/v1/ai/safety-advice
{
  "situation": "Meeting someone from dating app",
  "category": "dating"
}

# Emergency response
POST /api/v1/ai/emergency-response
{
  "emergencyType": "harassment",
  "location": "Nairobi, Kenya",
  "immediateHelp": true
}
```

## 🔒 Security Features

- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS protection** with whitelist
- **Helmet.js** security headers
- **MongoDB injection** protection
- **XSS protection** middleware
- **JWT token** authentication
- **bcrypt password** hashing
- **Environment variable** protection

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend && npm test

# Run integration tests
npm run test:integration

# Test AI features
cd /ai && node test-ai-features.js
```

## 🚀 Deployment

### Production Environment Variables
```bash
# Backend
NODE_ENV=production
PORT=5050
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
OPENAI_API_KEY=your-openai-key

# Frontend  
VITE_API_BASE_URL=https://your-api-domain.com
```

### Deployment Options
- **Railway**: Easy deployment with Git integration
- **Heroku**: Traditional PaaS deployment
- **DigitalOcean**: VPS with Docker
- **Vercel**: Frontend deployment
- **AWS**: Full cloud deployment

## 📈 Performance

- **Frontend**: Vite for fast builds and hot reload
- **Backend**: Node.js cluster mode support
- **Database**: MongoDB with optimized indexes
- **Caching**: Redis integration ready
- **CDN**: Static asset optimization
- **PWA**: Offline functionality support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Emergency Contacts

### Kenya Emergency Services
- **Police**: 911 or 999
- **Gender Violence Recovery Centre**: +254 709 991 000
- **National Gender and Equality Commission**: 0800 720 501
- **Childline Kenya**: 116

### Technical Support
- **Issues**: [GitHub Issues](https://github.com/yourusername/hershield-safeguard-kenya/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/hershield-safeguard-kenya/discussions)
- **Email**: support@hershield.com

## 🎯 Roadmap

### Version 2.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] Voice message analysis
- [ ] Image/photo threat detection
- [ ] Swahili language support
- [ ] Wearable device integration
- [ ] Advanced ML models
- [ ] Community safety mapping
- [ ] Integration with more local services

## 👥 Team

- **Safety Experts**: Working with local NGOs and women's rights organizations
- **AI Engineers**: Specialized in threat detection and NLP
- **Frontend Developers**: React/TypeScript specialists
- **Backend Engineers**: Node.js and security experts
- **Local Partners**: Gender Violence Recovery Centre, NGEC

---

**🛡️ Built with ❤️ for the safety of women and girls in Kenya**

*If you're in immediate danger, please contact emergency services directly at 911 or 999.*
