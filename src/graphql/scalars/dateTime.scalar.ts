import { GraphQLScalarType, Kind } from 'graphql';

const dateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: 'A date-time string in ISO 8601 format',
    serialize(value: unknown): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        if (typeof value === 'string') {
            return new Date(value).toISOString();
        }
        throw new Error('DateTime cannot represent a non-date value');
    },
    parseValue(value: unknown): Date {
        if (typeof value === 'string') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error('DateTime cannot represent an invalid date-time string');
            }
            return date;
        }
        throw new Error('DateTime cannot represent a non-string value');
    },
    parseLiteral(ast): Date {
        if (ast.kind === Kind.STRING) {
            const date = new Date(ast.value);
            if (isNaN(date.getTime())) {
                throw new Error('DateTime cannot represent an invalid date-time string');
            }
            return date;
        }
        throw new Error('DateTime cannot represent a non-string value');
    },
});

export default dateTime;
