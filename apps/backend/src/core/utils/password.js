import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

export { hashPassword, comparePassword };
