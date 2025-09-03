
import swaggerJsdoc from 'swagger-jsdoc';
import 'dotenv/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pixel Media API',
      version: '1.0.0',
      description: 'A comprehensive API for the Pixel Media asset management platform. This API handles user authentication via GitHub, provides full CRUD access to repository contents for asset management, and processes webhooks.',
      contact: {
        name: 'API Support',
        url: 'https://your-support-page.com', 
        email: 'support@example.com', 
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:8080',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            username: {
              type: 'string'
            },
            displayName: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./docs/*.yaml'], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
