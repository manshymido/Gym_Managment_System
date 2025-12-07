import mongoose from 'mongoose';

// Configure Mongoose settings
// Note: strictQuery is the default in Mongoose 9.x, no need to set it
// Disable mongoose buffering (commands will fail immediately if not connected)
// Note: bufferCommands is set per connection in Mongoose 9.x, not globally

// Connection options with environment variable support
const getConnectionOptions = () => {
  return {
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
    minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 2,
    connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT_MS) || 30000,
    serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 5000,
    socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS) || 45000,
  };
};

// Setup connection event handlers
const setupEventHandlers = () => {
  mongoose.connection.on('connected', () => {
    const dbName = mongoose.connection.db?.databaseName || 'unknown';
    const host = mongoose.connection.host || 'unknown';
    console.log(`✅ MongoDB Connected: ${host}/${dbName}`);
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Error Details:', {
      name: error.name,
      code: error.code,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
    });
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB Disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB Reconnected');
  });
};

// Retry connection with exponential backoff
const connectWithRetry = async (maxRetries = 5, retryDelay = 5000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const options = getConnectionOptions();
      const conn = await mongoose.connect(process.env.MONGODB_URI, options);
      
      const dbName = conn.connection.db?.databaseName || 'unknown';
      const host = conn.connection.host || 'unknown';
      console.log(`✅ MongoDB Connected Successfully: ${host}/${dbName}`);
      console.log(`📊 Connection Pool: min=${options.minPoolSize}, max=${options.maxPoolSize}`);
      
      return conn;
    } catch (error) {
      retries++;
      const delay = retryDelay * Math.pow(2, retries - 1); // Exponential backoff
      
      console.error(`❌ MongoDB Connection Attempt ${retries}/${maxRetries} Failed:`, error.message);
      
      if (retries >= maxRetries) {
        console.error('❌ Maximum retry attempts reached. Exiting...');
        console.error('Connection Details:', {
          uri: process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Hide credentials
          error: error.message,
          code: error.code,
        });
        process.exit(1);
      }
      
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Main connection function
const connectDB = async () => {
  try {
    // Setup event handlers before connecting
    setupEventHandlers();
    
    // Attempt connection with retry logic
    await connectWithRetry();
  } catch (error) {
    console.error('❌ Fatal MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Graceful shutdown function
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB Connection Closed Gracefully');
  } catch (error) {
    console.error('❌ Error Closing MongoDB Connection:', error.message);
  }
};

export default connectDB;

