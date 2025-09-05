import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(name, defaultValue) {
    const value = process.env[name];

    if (value !== undefined && value !== "") return value;

    if (defaultValue !== undefined) return defaultValue;

    throw new Error(`Missing: process.env['${name}'].`);
}

export const ENV_VARS = {
    GOOGLE_OAUTH_PROJECT_ID: 'GOOGLE_OAUTH_PROJECT_ID',
    GOOGLE_OAUTH_CLIENT_ID: 'GOOGLE_OAUTH_CLIENT_ID',
    GOOGLE_OAUTH_CLIENT_SECRET: 'GOOGLE_OAUTH_CLIENT_SECRET',
    GOOGLE_OAUTH_REDIRECT_URI: 'GOOGLE_OAUTH_REDIRECT_URI',
};