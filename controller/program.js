const { AnchorProvider, Wallet, Program } = require("@coral-xyz/anchor");
const { Connection, PublicKey } = require("@solana/web3.js");
const { MP_CONSTS } = require("../constants/values");

var program = {};
const setProgram = async () => {
    try {
        const connection = new Connection(MP_CONSTS.DEFAULT_RPC);
        const wallet = new Wallet("246e5ohcqh4J2kXgWNsmSCTpbLPBh5bvs1bVpzx77nuonLQEFrzuEujsRGpXWM3XF8zGy6GYsGSHMpwkq4Suw7P1");
        const provider = new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions(),
        );

        const protocolAddress = new PublicKey(MP_CONSTS.DEFAULT_PROGRAM_ADDRESS);
        program = await Program.at(protocolAddress, provider);
    } catch (e) {
        console.log(e);
    } 
}

const getProgram = () => {
    return program;
}

module.exports = {
    setProgram,
    getProgram,
}