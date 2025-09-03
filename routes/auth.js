
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Step 1: User initiates login
router.get('/github', passport.authenticate('github', { scope: ['repo', 'user:email'] }));

// Step 2: GitHub redirects back to us
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }), // We will not be using sessions
  (req, res) => {
    // At this point, passport has successfully authenticated the user and `req.user` is available.

    // Step 3: Generate a JWT
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username }, 
      process.env.SESSION_SECRET, // Re-using SESSION_SECRET as our JWT secret. Ensure it's strong!
      { expiresIn: '1h' } // Token will be valid for 1 hour
    );

    // Step 4: Redirect to the frontend, passing the token in the URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

// Step 5: Frontend uses this to verify its stored token and get user info
router.get('/me', (req, res) => {
  // This is now a protected route that requires a token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Not authenticated: Invalid token.' });
    }
    // Here you could fetch the full user profile from the database if needed
    res.json(user);
  });
});

// Step 6: Logout is now a frontend responsibility (just delete the token)
router.get('/logout', (req, res) => {
  // This route is now effectively stateless. 
  // The frontend should redirect to the login page after clearing the token.
  res.status(200).json({ message: 'Logout successful. Please clear token on client-side.' });
});

export default router;
