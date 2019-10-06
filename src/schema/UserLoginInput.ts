import { inputObjectType } from 'nexus';

const UserLoginInput = inputObjectType({
    name: 'UserLoginInput',
    definition(t) {
        t.string('email', { required: true });
        t.string('password', { required: true });
    },
});

export { UserLoginInput };
