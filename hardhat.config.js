require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    mumbai : {
      url: "https://polygon-mumbai.g.alchemy.com/v2/bR-V4OR8SJ3FmF2V-fCmaASebyHqQmqd",
      accounts: ['0xabe25d662600917a63676b2914c49dda4ba5fe4203c6a548f48b7494cfa8f264']
    }
  }
};
