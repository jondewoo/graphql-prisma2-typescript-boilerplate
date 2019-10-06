import { queryType } from 'nexus';
import getUserId from '../utils/getUserId';

const Query = queryType({
    definition(t) {
        t.crud.users();
        t.field('me', {
            type: 'User',
            resolve: async (parent, args, { photon, ctxParams }) => {
                const userId = getUserId(ctxParams);
                try {
                    const user = await photon.users.findOne({ where: { id: userId } });
                    return user;
                } catch (err) {
                    const message = err.message || '';
                    if (message.includes('Record does not exist')) {
                        throw new Error('User not found');
                    } else {
                        console.error(err);
                        throw new Error('Uknown error');
                    }
                }
            },
        });
    },
});

export { Query };
