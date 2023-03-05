// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
