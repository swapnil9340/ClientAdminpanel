const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // If already connected, skip the connection attempt
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);  // Exit process if DB connection fails
  }
};

module.exports = connectDB;
