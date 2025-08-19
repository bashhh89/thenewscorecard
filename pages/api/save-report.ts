import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// Initialize admin SDK once
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      console.error('FIREBASE_SERVICE_ACCOUNT_KEY is missing');
    } else {
      const parsed = JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString('utf8'));
      admin.initializeApp({ credential: admin.credential.cert(parsed) });
      console.log('Firebase Admin initialized');
    }
  } catch (e) {
    console.error('Failed to initialize Firebase Admin:', e);
  }
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    if (!body || !body.reportMarkdown) {
      return res.status(400).json({ error: 'Missing report data' });
    }

    // Ensure we don't allow extremely large payloads
    if (JSON.stringify(body).length > 1_000_000) {
      return res.status(413).json({ error: 'Payload too large' });
    }

    const docRef = await db.collection('scorecardReports').add({
      ...body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      overallStatus: body.overallStatus || 'completed'
    });

    return res.status(200).json({ id: docRef.id });
  } catch (error: any) {
    console.error('Error in save-report API:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
}
