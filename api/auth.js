const { auth } = require('../../firebase-admin');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;
    
    res.json({ 
      success: true, 
      user: { uid, email, name } 
    });
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}