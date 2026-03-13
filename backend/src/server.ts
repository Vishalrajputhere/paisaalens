import http from 'http';
import dns from 'node:dns';
import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Force IPv4 DNS resolution to fix ECONNREFUSED with MongoDB Atlas locally
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
  dns.setDefaultResultOrder("ipv4first");
}

const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/paisaalens';

const server = http.createServer(app);

// DB Connection
mongoose
  .connect(DB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    server.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
