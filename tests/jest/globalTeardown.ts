module.exports = async (): Promise<void> => {
    const gbl: any = global;

    await gbl.httpServer.close();

    await gbl.photon.disconnect();

    console.log('Server shutdown');
};
