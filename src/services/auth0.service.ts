import { userTable } from '@/db/user.table';
import { buildUser, type User } from '@/models/user.model';
import { issuerBaseURL } from '@/utils/env';

import type { DB } from '@/db';
import type { JWTPayload } from 'jose';

export class Auth0Service {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async lookupUserFromAuth0(payload: JWTPayload): Promise<User | null> {
        const sub = this.getString(payload, 'sub');
        if (!sub) {
            return null;
        }
        const user = await userTable(this.db).getUserById(sub);
        if (!user) {
            return null;
        }
        return buildUser(user);
    }

    async createOrUpdateUserFromAuth0(payload: JWTPayload, accessToken: string | null): Promise<User> {
        const sub = this.getString(payload, 'sub');
        if (!sub) {
            throw new Error('Auth0 token missing sub');
        }

        let email = this.getString(payload, 'email');
        let emailVerified = this.getBool(payload, 'email_verified');
        let nickname = this.getString(payload, 'nickname');

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
        const user = await userTable(this.db).createOrUpdateUser(sub, nickname ?? undefined, email ?? undefined, emailVerified ?? undefined);
        return buildUser(user);
    }

    private getString = (payload: JWTPayload, key: string): string | null => {
        const value = payload[key];
        return typeof value === 'string' ? value : null;
    };

    private getBool = (payload: JWTPayload, key: string): boolean | null => {
        const value = payload[key];
        return typeof value === 'boolean' ? value : null;
    };
}
