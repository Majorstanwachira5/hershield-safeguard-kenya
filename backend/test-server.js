const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HerShield API is running (basic mode)',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Basic AI endpoints for testing
app.post('/api/v1/ai/analyze-message', (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    data: {
      threatLevel: Math.floor(Math.random() * 10),
      detectedThreats: ['sample_threat'],
      confidence: 0.8,
      recommendations: ['Be cautious', 'Report if escalates'],
      sentiment: 'neutral'
    }
  });
});

app.post('/api/v1/ai/safety-advice', (req, res) => {
  const { situation } = req.body;
  res.json({
    success: true,
    data: {
      recommendations: ['Stay in public places', 'Tell someone your plans'],
      immediateActions: ['Trust your instincts'],
      preventiveMeasures: ['Plan your route ahead'],
      resources: [
        {
          name: 'Kenya Police',
          contact: '911',
          description: 'Emergency police services'
        }
      ],
      urgencyLevel: 'medium'
    }
  });
});

app.post('/api/v1/ai/emergency-response', (req, res) => {
  const { emergencyType } = req.body;
  res.json({
    success: true,
    data: {
      immediateActions: ['Call 911 immediately', 'Get to a safe location'],
      emergencyContacts: [
        { name: 'Kenya Police', number: '911', description: 'Police emergency' }
      ],
      safetyInstructions: ['Stay calm', 'Follow instructions from authorities'],
      localResources: [],
      followUpSteps: ['Document the incident'],
      isUrgent: true
    }
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 HerShield test server running on port ${PORT}`);
});
