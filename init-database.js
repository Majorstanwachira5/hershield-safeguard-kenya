// HerShield Database Initialization Script
// This script sets up the MongoDB database with initial data

import { MongoClient } from 'mongodb';

const DB_NAME = 'hershield';
const MONGO_URI = 'mongodb://localhost:27017';

async function initDatabase() {
  console.log('🛡️  Initializing HerShield Database');
  console.log('=====================================');

  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Create collections and indexes
    console.log('📝 Setting up collections and indexes...');

    // Users collection
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ 'location.coordinates': '2dsphere' });
    console.log('✅ Users collection ready');

    // Safety tips collection
    await db.createCollection('safetytips');
    const safetyTips = [
      {
        title: "Walking Alone at Night",
        content: "Always stay in well-lit areas, keep your phone charged, share your location with trusted contacts, and trust your instincts.",
        category: "personal_safety",
        priority: 5,
        tags: ["night", "walking", "personal_safety"],
        isActive: true,
        targetAudience: "general",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Online Dating Safety",
        content: "Meet in public places, tell someone about your plans, video call before meeting, use your own transportation, and never share personal information too early.",
        category: "dating",
        priority: 4,
        tags: ["dating", "online", "meeting"],
        isActive: true,
        targetAudience: "general",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Workplace Harassment Prevention",
        content: "Document incidents, report to HR or management, seek support from colleagues, know your rights under Kenyan employment law.",
        category: "workplace",
        priority: 5,
        tags: ["workplace", "harassment", "professional"],
        isActive: true,
        targetAudience: "working_women",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Digital Privacy Protection",
        content: "Use strong passwords, enable two-factor authentication, be cautious about sharing personal information, review privacy settings regularly.",
        category: "digital_safety",
        priority: 4,
        tags: ["digital", "privacy", "online"],
        isActive: true,
        targetAudience: "general",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Emergency Contacts Setup",
        content: "Always have emergency contacts saved, share location with trusted people, keep emergency numbers easily accessible, inform contacts about your safety plans.",
        category: "emergency",
        priority: 5,
        tags: ["emergency", "contacts", "planning"],
        isActive: true,
        targetAudience: "general",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('safetytips').insertMany(safetyTips);
    console.log('✅ Safety tips loaded');

    // Emergency resources collection
    await db.createCollection('emergencyresources');
    const emergencyResources = [
      {
        name: "Kenya Police Emergency",
        category: "emergency_services",
        contactInfo: {
          phone: "911",
          alternativePhone: "999",
          email: null
        },
        location: {
          county: "Nationwide",
          city: "All",
          address: "Kenya Police Service"
        },
        services: ["Emergency Response", "Crime Reporting", "Safety Assistance"],
        availability: "24/7",
        description: "Kenya Police emergency services for immediate assistance",
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Gender Violence Recovery Centre",
        category: "support_services",
        contactInfo: {
          phone: "+254709991000",
          email: "info@gvrc.or.ke"
        },
        location: {
          county: "Nairobi",
          city: "Nairobi",
          address: "Liverpool VCT Centre, Ngong Road"
        },
        services: ["Counseling", "Medical Support", "Legal Aid", "Safe Shelter"],
        availability: "24/7 Hotline",
        description: "Comprehensive support for survivors of gender-based violence",
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "National Gender and Equality Commission",
        category: "government_services",
        contactInfo: {
          phone: "0800720501",
          email: "info@ngeckenya.org"
        },
        location: {
          county: "Nairobi",
          city: "Nairobi", 
          address: "Anniversary Towers, University Way"
        },
        services: ["Legal Support", "Rights Advocacy", "Policy Support"],
        availability: "Monday-Friday 8AM-5PM",
        description: "Government commission for gender equality and women's rights",
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Childline Kenya",
        category: "support_services",
        contactInfo: {
          phone: "116",
          email: "info@childlinekenya.co.ke"
        },
        location: {
          county: "Nationwide",
          city: "All",
          address: "Childline Kenya"
        },
        services: ["Child Protection", "Counseling", "Emergency Response"],
        availability: "24/7",
        description: "Free helpline for children and young people in distress",
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('emergencyresources').insertMany(emergencyResources);
    console.log('✅ Emergency resources loaded');

    // Create threat reports collection
    await db.createCollection('threatreports');
    console.log('✅ Threat reports collection ready');

    // Create reports collection
    await db.createCollection('reports');
    console.log('✅ Reports collection ready');

    console.log('');
    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Collections created:');
    console.log('   • users (with indexes)');
    console.log('   • safetytips (with sample data)');
    console.log('   • emergencyresources (with Kenya resources)');
    console.log('   • threatreports');
    console.log('   • reports');
    console.log('');
    console.log('✅ HerShield database is ready for use!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run initialization
initDatabase().catch(console.error);
