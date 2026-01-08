export type User = {
    __typename: 'User';
    id: string;
    displayName: string;
    emailAddress?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};
