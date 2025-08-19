import admin from 'firebase-admin';

export default async function handler(req, res) {
  console.log('Testing Firebase Admin SDK...');
  
  try {
    // Check if environment variables are set
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      return res.status(500).json({ 
        error: 'FIREBASE_SERVICE_ACCOUNT_KEY not found in environment variables' 
      });
    }

    // Decode the Base64 service account key
    const serviceAccountKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    console.log('Project ID:', serviceAccount.project_id);
    
    // Initialize Firebase Admin SDK if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
    }
    
    // Test Firestore connection
    const db = admin.firestore();
    
    // Try to write a test document
    const testDoc = await db.collection('test').doc('connection').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      test: 'Firebase Admin SDK working',
      testTime: new Date().toISOString()
    });
    
    // Try to read it back
    const readDoc = await db.collection('test').doc('connection').get();
    const data = readDoc.data();
    
    return res.status(200).json({ 
      success: true,
      message: 'Firebase Admin SDK is working correctly!',
      projectId: serviceAccount.project_id,
      testData: data
    });
    
  } catch (error) {
    console.error('Firebase Admin SDK Error:', error);
    return res.status(500).json({ 
      error: 'Firebase Admin SDK test failed',
      message: error.message,
      details: error.code || 'Unknown error'
    });
  }
}