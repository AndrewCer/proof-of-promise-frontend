export const environment = {
  production: false,
  apiUrl: 'https://api-testnet.proofofpromise.xyz/api',
  polygonNode: {
    chainName: 'Polygon Mumbai',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    chainId: 80001,
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    iconUrl: 'https://polygonscan.com/images/favicon.ico',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
  },
  baseNode: {
    chainName: 'Base Görli',
    rpcUrl: 'https://goerli.base.org',
    chainId: 84531,
    nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
    iconUrl: 'https://base.org/favicon.svg',
    blockExplorerUrl: 'https://goerli.basescan.org'
  },
  baseScanUrl: 'https://goerli.basescan.org',
  polygonScanUrl: 'https://mumbai.polygonscan.com',
};
