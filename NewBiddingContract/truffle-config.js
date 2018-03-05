# For something like:
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },

    QA: {
      host: "localhost",
      port: 8545,
      network_id: 4, // Rinkeby
      from: "0x7e34150396655f28c484957123ae8b0f6e4e526d"
      //Options: gas, gasPrice, from
    },

    PRODUCTION: {
      host: "localhost",
      port: 8545,
      network_id: 1 // Rinkeby
      //Options: gas, gasPrice, from
    }
  }
};
