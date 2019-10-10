module.exports = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gbl: any = global;

    await gbl.httpServer.close();
    await gbl.photon.disconnect();

    console.log('Server shutdown');
};
