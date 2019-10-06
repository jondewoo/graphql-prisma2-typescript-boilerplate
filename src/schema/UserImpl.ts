import { ContextParameters } from 'graphql-yoga/dist/types';
import { extendType } from 'nexus';
import getUserId from '../utils/getUserId';

const UserImpl = extendType({
    type: 'User',
    definition(t) {
        t.field('email', {
            type: 'String',
            nullable: true,
            resolve: (parent: { id: string; email: string }, args, { ctxParams }: { ctxParams: ContextParameters }) => {
                const userId = getUserId(ctxParams, false);

                if (parent.id === userId) return parent.email;

                return null;
            },
        });
    },
});

export { UserImpl };
