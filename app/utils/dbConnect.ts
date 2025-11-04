import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongooseGlobal: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Инициализация глобального singleton
const globalWithMongoose = global as typeof global & {
  mongooseGlobal: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

globalWithMongoose.mongooseGlobal = globalWithMongoose.mongooseGlobal || {
  conn: null,
  promise: null,
};

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) throw new Error('MONGODB_URI is not defined');

  if (globalWithMongoose.mongooseGlobal.conn) {
    console.log('MongoDB is already connected');
    return globalWithMongoose.mongooseGlobal.conn;
  }

  if (!globalWithMongoose.mongooseGlobal.promise) {
    const options = {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      dbName: 'paromaster',
    };
    globalWithMongoose.mongooseGlobal.promise = mongoose.connect(
      mongodbUri,
      options
    );
  }

  try {
    globalWithMongoose.mongooseGlobal.conn =
      await globalWithMongoose.mongooseGlobal.promise;
    console.log('MongoDB connected');
    return globalWithMongoose.mongooseGlobal.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    globalWithMongoose.mongooseGlobal.conn = null;
    globalWithMongoose.mongooseGlobal.promise = null;
    throw error;
  }
};

// Опционально: мониторинг состояния
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', error => {
  console.error('MongoDB connection error:', error);
  globalWithMongoose.mongooseGlobal.conn = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection lost');
  globalWithMongoose.mongooseGlobal.conn = null;
});
