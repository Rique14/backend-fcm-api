// backend-fcm-api/index.js

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS so emulator/app can call this API

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Simple log middleware to see incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body);
  next();
});

// REST API endpoint to send FCM message
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).send({ error: 'token, title, and body are required' });
  }

  const message = {
  token,
  notification: {
    title,
    body
  },
  data: {
    title,
    body
  }
};

 
  try {
    const response = await admin.messaging().send(message);
    console.log('Message sent successfully:', response);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`FCM API running on http://localhost:${port}`);
});

