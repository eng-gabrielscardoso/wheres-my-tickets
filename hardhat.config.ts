import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const BESU_PRIVATE_KEY = vars.get("BESU_PRIVATE_KEY")

const config: HardhatUserConfig = {
  solidity: {
   version: "0.8.28",
   settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  },
  networks: {
    besu: {
      url: "http://127.0.0.1:8545",
      gas: "auto",
      gasPrice: "auto",
      accounts: [
        `${BESU_PRIVATE_KEY}`,
      ],
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
