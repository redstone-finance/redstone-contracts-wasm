function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  "console": {
    log: function (value) {
      console.log(value);
    }
  },
  "Block": {
    height: function () {
      return 234234;
    },

    indep_hash: function () {
      return 'sdfjskdjfhskdjfh20938420938420ksdjf';
    },

    timestamp: function () {
      return '5555555555'
    }
  },
  "Contract": {
    contractOwner: function () {
      return "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA";
    },
    contractId: function () {
      return "sdfsdfs";
    },
  },
  "Transaction": {
    id: function () {
      return "sdfsdfs";
    },
    target: function () {
      return "";
    },
    owner: function () {
      return "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA";
    },

  },
  "SmartWeave": {
    readContractState: async function (contractTxId) {
      console.log('js: readContractState before timeout');
      await timeout(1000);
      console.log('js: readContractState after timeout');
      return {
        value: contractTxId
      }
    },

    viewContractState: async function (contractTxId) {
      console.log('js: viewContractState before timeout');
      await timeout(1000);
      console.log('js: viewContractState after timeout');
      return {
        value: contractTxId
      }
    },

    write: async function (contractTxId, input) {
      console.log('js: write before timeout');
      await timeout(1000);
      console.log('js: write after timeout');
    },

    refreshState: async function (contractTxId, input) {
      console.log('js: write before timeout');
      await timeout(1000);
      console.log('js: write after timeout');
    }
  }
}
