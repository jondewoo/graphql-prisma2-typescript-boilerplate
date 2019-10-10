import util = require('util');
import ps = require('ps-node');

module.exports = async (): Promise<void> => {
    const gbl: any = global;

    await gbl.httpServer.close();

    // https://github.com/prisma/prisma2/issues/698
    const lookup = util.promisify(ps.lookup);
    const kill = util.promisify(ps.kill);
    const processes = await lookup({
        command: 'query-engine*',
    });
    for (const process of processes) {
        await kill(process.pid);
    }

    console.log('Server shutdown');
};
