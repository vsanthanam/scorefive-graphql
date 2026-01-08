import { userTable } from '@/db/user.table';
import { issuerBaseURL } from '@/utils/env';

import type { DB } from '@/db';
import type { User } from '@/models/user.model';
import type { JWTPayload } from 'jose';

function getString(payload: JWTPayload, key: string): string | null {
    const value = payload[key];
    return typeof value === 'string' ? value : null;
}

function getBool(payload: JWTPayload, key: string): boolean | null {
    const value = payload[key];
    return typeof value === 'boolean' ? value : null;
}

export const auth0Service = (db: DB) => {
    return {
        lookupUserFromAuth0: async (payload: JWTPayload): Promise<User | null> => {
            const sub = getString(payload, 'sub');
            if (!sub) {
                return null;
            }
            const user = await userTable(db).getUserById(sub);
            if (!user) {
                return null;
            }
            return {
                __typename: 'User',
                id: user.id,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        },
        createOrUpdateUserFromAuth0: async (payload: JWTPayload, accessToken: string | null): Promise<User> => {
            const sub = getString(payload, 'sub');
            if (!sub) {
                throw new Error('Auth0 token missing sub');
            }

            let email = getString(payload, 'email');
            let emailVerified = getBool(payload, 'email_verified');
            let nickname = getString(payload, 'nickname');

            if (!email && accessToken) {
                const res = await fetch(`${issuerBaseURL}userinfo`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (res.ok) {
                    const info = (await res.json()) as Record<string, unknown>;
                    email = typeof info.email === 'string' ? info.email : email;
                    emailVerified = typeof info.email_verified === 'boolean' ? info.email_verified : emailVerified;
                    nickname = typeof info.nickname === 'string' ? info.nickname : nickname;
                }
            }
            const user = await userTable(db).createOrUpdateUser(sub, nickname ?? undefined, email ?? undefined, emailVerified ?? undefined);
            return {
                __typename: 'User',
                id: user.id,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        },
    };
};
