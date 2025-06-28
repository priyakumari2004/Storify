import { MongoClient } from 'mongodb';

let db;

export const connectDB = async () => {
  try {
    const client = new MongoClient('mongodb+srv://priyak99713:Priya%40202501@cluster0.ygshlln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    db = client.db('distributed-storage');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('📝 Make sure MongoDB is running on localhost:27017');
    console.log('🔄 Continuing with in-memory storage for demo...');
  }
};

export const getDB = () => db;
