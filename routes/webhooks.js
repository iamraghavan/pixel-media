
import express from 'express';

const router = express.Router();

router.post('/github', (req, res) => {
  console.log('Received a webhook event:', req.body);
  res.status(200).send('Webhook received');
});

export default router;
