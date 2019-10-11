import * as path from 'path';
import * as Nexus from 'nexus';
import * as NexusPrisma from 'nexus-prisma';
import { Query } from './Query';
import { Mutation } from './Mutation';
import { User } from './User';
import { UserSignupInput } from './UserSignupInput';
import { UserLoginInput } from './UserLoginInput';
import { AuthPayload } from './AuthPayload';

const appTypes = [Query, Mutation, User, UserSignupInput, UserLoginInput, AuthPayload];
const nexusPrismaTypes = NexusPrisma.nexusPrismaPlugin({
    types: appTypes,
});
const allTypes = [appTypes, nexusPrismaTypes];

const schema = Nexus.makeSchema({
    types: allTypes,
    outputs: {
        schema: path.join(__dirname, '../schema/generated/schema.graphql'),
    },
    typegenAutoConfig: {
        contextType: 'Context.Context',
        sources: [
            {
                source: '@generated/photon',
                alias: 'photon',
            },
            {
                source: require.resolve('../context'),
                alias: 'Context',
            },
        ],
    },
});

export { schema };
