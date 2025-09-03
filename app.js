
import express from 'express';
import passport from './config/passport.js'; // Still needed for GitHub strategy
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import webhookRoutes from './routes/webhooks.js';
import githubRoutes from './routes/github.js';
import pingRoutes from './routes/ping.js'; // Import the new ping route
import { logErrors, errorHandler } from './middleware/error.js';
import 'dotenv/config';

const app = express();

// As requested, updated CORS to allow all origins to fix the trailing slash issue.
app.use(cors({ origin: '*' }));

// IMPORTANT: The webhook route needs the raw body, so we apply its parser first.
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Global JSON parser for all other routes
app.use(express.json());

app.use(passport.initialize()); // Still needed to initialize the GitHub strategy

// API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Keep-alive route
app.use('/api/ping', pingRoutes); // Add the ping route

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/github', githubRoutes);

app.use(logErrors);
app.use(errorHandler);

export default app;
