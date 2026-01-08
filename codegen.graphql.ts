import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: 'src/graphql/schema.graphqls',
    generates: {
        'src/__generated__/graphql.ts': {
            plugins: [
                {
                    typescript: {
                        useTypeImports: true,
                    },
                },
                {
                    'typescript-resolvers': {
                        contextType: '@/graphql#GraphQLContext',
                        useTypeImports: true,
                    },
                },
            ],
            config: {
                scalars: {
                    DateTime: 'Date',
                },
                mapperTypeSuffix: 'Model',
                mappers: {
                    User: '@/models/user.model#User',
                    SavedPlayer: '@/models/savedPlayer.model#SavedPlayer',
                    Game: '@/models/game.model#Game',
                    AnonymousParticipant:
                        '@/models/anonymousParticipant.model#AnonymousParticipant',
                },
            },
        },
        './graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
};

export default config;
