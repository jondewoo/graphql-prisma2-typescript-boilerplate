module.exports = async (): Promise<void> => {
    const gbl: any = global;

    await gbl.httpServer.close();
};
