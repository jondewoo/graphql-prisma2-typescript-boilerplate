import { objectType } from 'nexus';

const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('token');
        t.field('user', { type: 'User' });
    },
});

export { AuthPayload };
