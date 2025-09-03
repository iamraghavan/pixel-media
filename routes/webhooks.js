
import express from 'express';
import { verifyGitHubSignature } from '../middleware/verifyGithubSignature.js';

const router = express.Router();

// This route must use a raw body parser, so it's defined separately in index.js
router.post('/github', verifyGitHubSignature, (req, res) => {
  const event = req.headers['x-github-event'];

  if (event === 'push') {
    console.log('Received a push event for repository:', req.body.repository.full_name);
    // You can add more logic here, like clearing a cache,
    // updating a database, or notifying users.
  } else {
    console.log('Received a non-push event:', event);
  }

  res.status(200).json({ status: 'success' });
});

export default router;
