import * as jwt from 'jsonwebtoken';
import { ContextParameters } from 'graphql-yoga/dist/types';

const getUserId = (ctxParams: ContextParameters, requireAuth = true): string | null => {
    const header = ctxParams.request
        ? ctxParams.request.headers.authorization
        : ctxParams.connection.context.Authorization;

    if (header) {
        const token = header.replace('Bearer ', '');
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        if (!payload) throw new Error('Forbidden');

        return payload.userId;
    }

    if (requireAuth) throw new Error('Authentication required');

    return null;
};

export { getUserId as default };
