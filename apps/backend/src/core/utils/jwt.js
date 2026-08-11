import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from '../config/db.js';

const signToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

const verifyToken = (token) => jwt.verify(token, jwtSecret);

export { signToken, verifyToken };
