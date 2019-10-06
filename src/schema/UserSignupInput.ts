import { inputObjectType } from 'nexus';

const UserSignupInput = inputObjectType({
    name: 'UserSignupInput',
    definition(t) {
        t.string('name', { required: true });
        t.string('email', { required: true });
        t.string('password', { required: true });
    },
});

export { UserSignupInput };
