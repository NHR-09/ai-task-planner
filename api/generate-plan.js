const { db } = require('../../firebase-admin');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { goal, days, userId } = req.body;
    
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
      const docRef = await db.collection('plans').add({
        ...planData,
        userId,
        createdAt: new Date()
      });
      planData.id = docRef.id;
    }
    
    res.json(planData);
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
}