
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import 'dotenv/config';

// Ensure the server URL is set in the environment variables
if (!process.env.SERVER_URL) {
  throw new Error('SERVER_URL environment variable is not set.');
}

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
    scope: [ 'repo' ], 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOrCreateFromGithubProfile(profile, accessToken);
      return done(null, user);
    } catch (err) {
      console.error('\nPASSPORT STRATEGY ERROR:', err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
