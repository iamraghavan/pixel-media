
import express from 'express';
import session from 'express-session';
import passport from './config/passport.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import webhookRoutes from './routes/webhooks.js';
import githubRoutes from './routes/github.js'; // Import new GitHub routes
import { logErrors, errorHandler } from './middleware/error.js';
import 'dotenv/config';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true, 
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    sameSite: 'none' 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/github', githubRoutes); // Add new GitHub routes

app.use(logErrors);
app.use(errorHandler);

export default app;
