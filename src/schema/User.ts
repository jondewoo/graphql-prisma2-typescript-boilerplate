import { objectType } from 'nexus';
import getUserId from '../utils/getUserId';

const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id();
        t.field('email', {
            type: 'String',
            nullable: true,
            resolve: (parent, args, { ctxParams }, info) => {
                if (
                    info.path.prev &&
                    info.path.prev.prev &&
                    (info.path.prev.prev.key === 'signup' || info.path.prev.prev.key === 'login')
                ) {
                    return parent.email;
                }

                const userId = getUserId(ctxParams, false);
                if (parent.id === userId) return parent.email;

                return null;
            },
        });
        t.model.name();
    },
});

export { User };
