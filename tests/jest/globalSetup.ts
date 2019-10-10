const server = require('../../src/server').server;

module.exports = async (): Promise<void> => {
    const httpServer = await server.start(
        {
            port: process.env.PORT || 4000,
        },
        () => console.log(`Server is running at http://localhost:${process.env.PORT || 4000}`),
    );

    Object.assign(global, { httpServer, photon: server.context().photon });
};
