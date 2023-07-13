import dotenv from 'dotenv';

dotenv.config();

export const FRONT_END_PORT = process.env.FRONT_END_PORT || 3000;
export const PORT = process.env.PORT || 3001;
export const ROUNDS_OF_HASHING = 10;
export const TOKEN_LIFETIME = "2h";
export const HEADER_TOKEN_KEY = "x-access-token";

