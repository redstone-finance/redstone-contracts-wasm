function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  "console": {
    log: function(value) {
      console.log(value);
    }
  },
  "Block": {
    height: function() {
      return 234234;
    },

    indep_hash: function() {
      return 'sdfjskdjfhskdjfh20938420938420ksdjf';
    },

    timestamp: function() {
      return '5555555555'
    }
  },
  "Transaction": {
    owner: function() {
      return "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA";
    }
  },
  "SmartWeave": {
    readContractState: async function(contractTxId) {
      console.log('js: readContractState before timeout');
      await timeout(1000);
      console.log('js: readContractState after timeout');
      return {
        value: contractTxId
      }
    }
  }
}
