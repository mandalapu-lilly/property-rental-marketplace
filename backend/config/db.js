import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (uri) {
    uri = uri.trim().replace(/^["']|["']$/g, '');
  }

  // If MONGODB_URI is not provided, check if MONGODB_USERNAME and MONGODB_PASSWORD are provided with a cluster host
  if (!uri || uri === '') {
    if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD && process.env.MONGODB_CLUSTER) {
      const username = encodeURIComponent(process.env.MONGODB_USERNAME.trim().replace(/^["']|["']$/g, ''));
      const password = encodeURIComponent(process.env.MONGODB_PASSWORD.trim().replace(/^["']|["']$/g, ''));
      const cluster = process.env.MONGODB_CLUSTER.trim().replace(/^["']|["']$/g, '');
      uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;
    }
  }

  // If URI is still missing, notify user clearly without crashing or printing secrets
  if (!uri || uri === '') {
    console.warn('⚠️ MONGODB_URI is not configured in backend/.env. MongoDB Atlas connection skipped until credentials are provided.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: 'property_marketplace',
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide diagnostic guidance without exposing credentials
    if (
      error.message.includes('bad auth') ||
      error.message.includes('Authentication failed') ||
      error.message.includes('auth error')
    ) {
      console.error('👉 Tip: MongoDB Atlas authentication failed. Please verify the database username and password in backend/.env.');
    } else if (
      error.message.includes('ENOTFOUND') ||
      error.message.includes('queryTxt ETIMEOUT') ||
      error.message.includes('ECONNREFUSED')
    ) {
      console.error('👉 Tip: Could not reach MongoDB Atlas cluster. Please check your internet connection and cluster hostname.');
    } else if (
      error.message.includes('IP') ||
      error.message.includes('whitelist') ||
      error.message.includes('not allowed to access')
    ) {
      console.error('👉 Tip: Ensure your current IP address is whitelisted in MongoDB Atlas Network Access (MongoDB Atlas -> Security -> Network Access).');
    }
  }
};

export default connectDB;
