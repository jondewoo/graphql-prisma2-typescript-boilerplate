import { objectType } from 'nexus';

const UserDef = objectType({
    name: 'User',
    definition(t) {
        t.model.id();
        t.model.email();
        t.model.name();
    },
});

export { UserDef };
