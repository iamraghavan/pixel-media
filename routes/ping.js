
import express from 'express';

const router = express.Router();

// A lightweight route to be used by uptime-monitoring services.
router.get('/', (req, res) => {
  // Responding with a 200 OK is enough to let the service know the app is alive.
  res.status(200).json({ message: 'Server is awake and running.' });
});

export default router;
