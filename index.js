
import 'dotenv/config';
import app from './app.js';
import sequelize from './config/database.js';

const port = process.env.PORT || 5000;

// WARNING: { force: true } will drop and recreate all tables.
// This is useful in development to ensure the schema matches the models,
// but it should NOT be used in production.
sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables forcefully recreated!');
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
