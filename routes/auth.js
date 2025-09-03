
import express from 'express';
import passport from 'passport';
import { Octokit } from '@octokit/rest';

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['repo', 'user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
    });
  });
});

router.get('/github/repos', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const octokit = new Octokit({ auth: req.user.accessToken });
        const { data } = await octokit.repos.listForAuthenticatedUser();
        res.json(data);
    } catch (error) {
        console.error('Error fetching repos:', error);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});

export default router;
