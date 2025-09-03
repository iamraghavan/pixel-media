
import crypto from 'crypto';

// Middleware to verify the webhook signature
export const verifyGitHubSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    return res.status(401).send('No signature provided.');
  }

  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
  const digest = `sha256=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    return res.status(401).send('Invalid signature.');
  }

  next();
};