import ApolloBoost, { Operation } from 'apollo-boost';

const getClient = (jwt: string): ApolloBoost<unknown> =>
    new ApolloBoost({
        uri: 'http://localhost:4000',
        request(operation: Operation): void {
            if (jwt) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
            }
        },
    });

export { getClient as default };
