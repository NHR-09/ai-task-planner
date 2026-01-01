import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = admin.firestore();

export default async function handler(req, res) {
  const { userId, planId } = req.query;
  
  console.log('🔥 Firebase API called:', req.method, 'userId:', userId, 'planId:', planId);
  
  if (!userId) {
    console.error('❌ No userId provided');
    return res.status(400).json({ error: 'User ID required' });
  }

  if (req.method === 'GET') {
    try {
      console.log('🔍 Fetching plans from Firestore for user:', userId);
      const snapshot = await firestore.collection('plans')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const plans = [];
      snapshot.forEach(doc => {
        plans.push({ id: doc.id, ...doc.data() });
      });
      
      console.log('✅ Found', plans.length, 'plans in Firestore');
      res.json(plans);
    } catch (error) {
      console.error('❌ Error fetching plans:', error);
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const planData = req.body;
      console.log('💾 Saving plan to Firestore:', planData.goal);
      const docRef = await firestore.collection('plans').add({
        ...planData,
        userId,
        createdAt: new Date()
      });
      
      console.log('✅ Plan saved with Firestore ID:', docRef.id);
      // Return the plan with the correct Firestore ID
      res.json({ ...planData, id: docRef.id });
    } catch (error) {
      console.error('❌ Error saving plan:', error);
      res.status(500).json({ error: 'Failed to save plan' });
    }
  }
  
  else if (req.method === 'DELETE') {
    console.log('🗑️ DELETE request received');
    console.log('📋 Query params:', req.query);
    
    if (!planId) {
      console.error('❌ No planId provided');
      return res.status(400).json({ error: 'Plan ID required' });
    }
    
    try {
      console.log('🗑️ Deleting plan from Firestore:', planId);
      
      // First check if document exists
      const docRef = firestore.collection('plans').doc(planId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        console.error('❌ Document does not exist:', planId);
        return res.status(404).json({ error: 'Plan not found' });
      }
      
      console.log('📋 Document exists, deleting...');
      await docRef.delete();
      console.log('✅ Plan deleted successfully');
      res.json({ success: true });
    } catch (error) {
      console.error('❌ Error deleting plan:', error);
      res.status(500).json({ error: 'Failed to delete plan' });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}