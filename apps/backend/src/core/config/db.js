import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 5000;
export const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
export const databaseUrl = process.env.DATABASE_URL;
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
