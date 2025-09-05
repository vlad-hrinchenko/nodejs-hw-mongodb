import { OAuth2Client } from 'google-auth-library';
import { getEnvVar, ENV_VARS } from './getEnvVar.js';

const client = new OAuth2Client({
    clientId: getEnvVar(ENV_VARS.GOOGLE_OAUTH_CLIENT_ID),
    clientSecret: getEnvVar(ENV_VARS.GOOGLE_OAUTH_CLIENT_SECRET),
    redirectUri: getEnvVar(ENV_VARS.GOOGLE_OAUTH_REDIRECT_URI),
});

export const getGoogleOauthLink = () =>
    client.generateAuthUrl({
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
        access_type: 'offline',
    });


export const getAuthData = async (code) => {
    const { tokens } = await client.getToken(code);
    return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
    };
};

export const verifyGoogleOAuthCode = async (code) => {
    return await getAuthData(code);
};