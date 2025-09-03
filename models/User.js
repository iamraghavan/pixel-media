
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {
  /**
   * A custom static method to find a user by their GitHub ID or create a new one.
   * This is used by the Passport.js strategy after successful GitHub authentication.
   * @param {object} profile The user profile object returned from GitHub.
   * @param {string} accessToken The access token provided by GitHub.
   * @returns {Promise<User>} The found or newly created user instance.
   */
  static async findOrCreateFromGithubProfile(profile, accessToken) {
    const { id, displayName, emails, photos } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const photo = photos && photos.length > 0 ? photos[0].value : null;

    try {
      const [user, created] = await this.findOrCreate({
        where: { githubId: id },
        defaults: {
          displayName: displayName,
          email: email,
          photo: photo,
          accessToken: accessToken, // Save the access token
        }
      });

      // If the user already existed, update their access token
      if (!created && user.accessToken !== accessToken) {
        user.accessToken = accessToken;
        await user.save();
      }

      return user;
    } catch (error) {
      console.error('Error in User.findOrCreateFromGithubProfile:', error);
      throw new Error('Database operation failed during user find or create.');
    }
  }
}

// Initialize the User model with its schema
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  photo: {
    type: DataTypes.STRING,
  },
  accessToken: { // Added field for storing the GitHub access token
    type: DataTypes.STRING,
    allowNull: true, // It might not always be present
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
});

export default User;
