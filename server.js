require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Test Firebase Admin connection
try {
  const admin = require('firebase-admin');
  
  if (!admin.apps.length) {
    console.log('🔥 Initializing Firebase Admin...');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "task-manager-3ee82",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized successfully');
  }
  
  const db = admin.firestore();
  console.log('📊 Firestore connection established');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({ message: 'Server is working', timestamp: new Date().toISOString() });
});

// API endpoint for generating plans
app.post('/api/generate-plan', async (req, res) => {
  console.log('🤖 Generate plan API called');
  try {
    const { goal, days, userId } = req.body;
    console.log('🎯 Goal:', goal, 'Days:', days, 'User:', userId);
    
    const prompt = `Create a ${days}-day plan to achieve: "${goal}"

Return a JSON object with this exact structure:
{
  "goal": "${goal}",
  "totalDays": ${days},
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "tasks": [
        {
          "id": "unique_id",
          "text": "Task description",
          "completed": false
        }
      ]
    }
  ]
}

Make tasks specific, actionable, and progressively build toward the goal. Each day should have 3-5 tasks.`;

    const completion = await groq.chat.completions.create({
      messages: [{
        role: "user",
        content: prompt
      }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const planData = JSON.parse(completion.choices[0].message.content);
    
    // Save to Firestore if userId provided
    if (userId) {
      try {
        const admin = require('firebase-admin');
        const db = admin.firestore();
        console.log('💾 Saving generated plan to Firestore...');
        const docRef = await db.collection('plans').add({
          ...planData,
          userId,
          createdAt: new Date()
        });
        planData.id = docRef.id;
        console.log('✅ Plan saved to Firestore with ID:', docRef.id);
      } catch (error) {
        console.error('❌ Error saving to Firestore:', error);
      }
    }
    
    res.json(planData);
  } catch (error) {
    console.error('❌ Error generating plan:', error);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

// API endpoint for managing plans
app.get('/api/plans', async (req, res) => {
  const { userId } = req.query;
  console.log('🔍 GET /api/plans called for user:', userId);
  
  if (!userId) {
    console.error('❌ No userId provided');
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    const admin = require('firebase-admin');
    const db = admin.firestore();
    console.log('🔍 Querying Firestore for user plans...');
    
    const snapshot = await db.collection('plans')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const plans = [];
    snapshot.forEach(doc => {
      plans.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('✅ Found', plans.length, 'plans for user:', userId);
    res.json(plans);
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

app.post('/api/plans', async (req, res) => {
  const { userId } = req.query;
  console.log('💾 POST /api/plans called for user:', userId);
  
  if (!userId) {
    console.error('❌ No userId provided');
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    const planData = req.body;
    console.log('💾 Saving plan:', planData.goal);
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const docRef = await db.collection('plans').add({
      ...planData,
      userId,
      createdAt: new Date()
    });
    
    console.log('✅ Plan saved with ID:', docRef.id);
    res.json({ id: docRef.id, ...planData });
  } catch (error) {
    console.error('❌ Error saving plan:', error);
    res.status(500).json({ error: 'Failed to save plan' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
