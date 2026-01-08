import { auth } from 'express-oauth2-jwt-bearer';

import {
    issuerBaseURL,
    audienceIdentifier as audience,
    tokenAlgorithm as tokenSigningAlg,
} from '@/utils/env';

import type { RequestHandler } from 'express';

const checkJwt = auth({
    audience,
    issuerBaseURL,
    tokenSigningAlg,
    authRequired: false,
});

const authMiddleware: RequestHandler = (req, res, next) => {
    return checkJwt(req, res, next);
};

export default authMiddleware;
