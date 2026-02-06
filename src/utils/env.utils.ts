export const port = process.env.PORT || 4000;
export const introspection = process.env.INTROSPECTION === 'true';
export const databaseURL = process.env.DATABASE_URL;
export const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
export const audienceIdentifier = process.env.AUTH0_AUDIENCE;
export const tokenAlgorithm = process.env.AUTH0_TOKEN_ALGORITHM || 'RS256';
export const auth0ClientId = process.env.AUTH0_M2M_CLIENT_ID;
export const auth0ClientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
export const production = process.env.NODE_ENV === 'production';
export const logLevel = process.env.LOG_LEVEL;

export const logEnvironment = () => {
    console.log('Environment Configuration:');
    console.log(`  PORT: ${port}`);
    console.log(`  AUTH0_ISSUER_BASE_URL: ${issuerBaseURL}`);
    console.log(`  AUTH0_AUDIENCE: ${audienceIdentifier}`);
    console.log(`  AUTH0_TOKEN_ALGORITHM: ${tokenAlgorithm}`);
    console.log(`  DATABASE_URL: ${databaseURL}`);
    console.log(`  INTROSPECTION: ${introspection}`);
    console.log(`  AUTH0_M2M_CLIENT_ID: ${auth0ClientId ? '[set]' : '[not set]'}`);
    console.log(`  AUTH0_M2M_CLIENT_SECRET: ${auth0ClientSecret ? '[set]' : '[not set]'}`);
};
