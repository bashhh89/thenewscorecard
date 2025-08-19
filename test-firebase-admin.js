import admin from 'firebase-admin';

async function testFirebaseAdmin() {
  console.log('Testing Firebase Admin SDK configuration...');

  // Check if environment variables are set
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY not found in environment variables');
    process.exit(1);
  }

  console.log('✅ Found FIREBASE_SERVICE_ACCOUNT_KEY in environment variables.');

  try {
    // Decode the Base64 service account key
    const serviceAccountKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    console.log('✅ Successfully decoded service account key from Base64.');
    console.log('Project ID:', serviceAccount.project_id);
    
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
    }
    
    console.log('✅ Firebase Admin SDK initialized successfully.');
    
    // Test Firestore connection
    const db = admin.firestore();
    
    // Try to write a test document
    await db.collection('test').doc('connection').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      test: 'Firebase Admin SDK working'
    });
    
    console.log('✅ Firestore write test successful.');
    
    console.log('\n✅ SUCCESS: Your Firebase Admin SDK configuration is working correctly!');
    console.log('PDF generation should work properly with this configuration.');
    
  } catch (error) {
    console.error('❌ Error testing Firebase Admin SDK:', error.message);
    
    if (error.message.includes('Failed to parse')) {
      console.error('The Base64 service account key appears to be invalid.');
    } else if (error.message.includes('permission')) {
      console.error('Permission denied. Make sure Firestore is set to test mode or check security rules.');
    }
    
    process.exit(1);
  }
}

testFirebaseAdmin();