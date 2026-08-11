import app from './src/app.js';
import { port } from './src/core/config/db.js';
import prisma from './src/core/lib/prisma.js';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database Connected');

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database');
    console.error(error);
    process.exit(1);
  }
};

startServer();
