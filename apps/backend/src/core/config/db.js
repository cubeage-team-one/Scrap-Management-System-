import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 5000;
export const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
export const databaseUrl = process.env.DATABASE_URL;
export const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
