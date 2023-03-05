import { Injectable } from '@angular/core';

import { BigNumber, ethers } from "ethers";
import { BehaviorSubject } from 'rxjs';
import { WalletStatus } from '../models/wallet.model';

import { jsonAbi } from '../utils/abi/0x109f58Cb16Bc0A255458B6cB54489e5C5A3E39aD';

import WalletConnectProvider from "@walletconnect/web3-provider";
import { PromiseCreation } from '../models/promise-creation.model';
import { Chain } from '../models/chain.model';

const chainContractAddress = {
    base: '0xB3C887ee0ad0AdDAd4fA3ECa3DC9af7595264bA3',
    polygon: '0x109f58Cb16Bc0A255458B6cB54489e5C5A3E39aD',
}

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    public iface = new ethers.utils.Interface(jsonAbi);
    public sbtAbi = this.iface.format(ethers.utils.FormatTypes['full']);

    public connectionLoading = false;
    public connectedWallet: string | undefined;

    public activeContract = chainContractAddress.polygon;

    public $walletConnectionChanges = new BehaviorSubject<WalletStatus | undefined>(undefined);
    private set walletConnectionChanges(value) {
        this.$walletConnectionChanges.next(value);
    };
    private get walletConnectionChanges() {
        return this.$walletConnectionChanges.getValue();
    }

    public $connectClickedChanges = new BehaviorSubject<boolean>(false);
    private set connectClickedChanges(value) {
        this.$connectClickedChanges.next(value);
    };
    private get connectClickedChanges() {
        return this.$connectClickedChanges.getValue();
    }

    private provider!: ethers.providers.Web3Provider;
    private signer: ethers.providers.JsonRpcSigner | undefined;
    private walletConnectProvider: WalletConnectProvider = new WalletConnectProvider({
        infuraId: 'bad2b2c13590479e967f83b8d6747cb0',
        rpc: {
            80001: 'https://polygon-mumbai.infura.io/v3/bad2b2c13590479e967f83b8d6747cb0',
            137: 'https://polygon-mainnet.infura.io/v3/bad2b2c13590479e967f83b8d6747cb0'
        }
    });

    constructor() {
        if (!window.ethereum) {
            return;
        }
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    get contract() {
        return new ethers.Contract(this.activeContract, this.sbtAbi, this.provider);
    }

    public contractSigner() {
        return this.contract.connect(this.provider.getSigner(this.connectedWallet));
    }

    public async startup() {
        this.walletConnectionChanges = WalletStatus.attemptingConnection;

        // If previous session detected, reconnect (prefer metamask)
        if (window.ethereum && !this.walletConnectProvider.walletMeta) {
            const extensionAccounts = await this.provider.listAccounts();

            if (extensionAccounts.length) {
                try {
                    if (!window.ethereum.providers) {
                        this.connectExtensionWallet();
                    }
                    else {
                        const provider = window.ethereum.providers.find((x: any) => x.isMetaMask);
                        if (provider && provider.selectedAddress) {
                            this.connectExtensionWallet('MetaMask');
                            return;
                        }
                        const cbProvider = window.ethereum.providers.find((x: any) => x.isCoinbaseWallet);
                        if (cbProvider && cbProvider._addresses && cbProvider._addresses.length) {
                            this.connectExtensionWallet('CoinbaseWallet');
                            return;
                        }
                        else {
                            this.connectExtensionWallet('unkonwn');
                        }
                    }
                } catch (error) {
                    this.disconnect();
                }
            }
            else {
                this.walletConnectionChanges = undefined;
            }

            return;
        }

        // Wallet connect
        if (this.walletConnectProvider.walletMeta) {
            try {
                this.walletConnect();
            } catch (error) {
                this.disconnect();
            }

            return;
        }

        // No connection, labling as disconnected
        this.walletConnectionChanges = WalletStatus.disconnected;
    }

    public async connectExtensionWallet(option?: string) {
        if (!window.ethereum.providers) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        else {
            if (option === 'MetaMask') {
                const provider = window.ethereum.providers.find((x: any) => x.isMetaMask);
                this.provider = new ethers.providers.Web3Provider(provider);
            }
            if (option === 'CoinbaseWallet') {
                const provider = window.ethereum.providers.find((x: any) => x.isCoinbaseWallet);
                this.provider = new ethers.providers.Web3Provider(provider);
            }
        }

        this.signer = this.provider.getSigner();
        try {
            await this.provider.send("eth_requestAccounts", []);

            this.connectedWallet = await this.getAddress();
            this.walletConnectionChanges = WalletStatus.connected;
            return;
        } catch (error) {
            console.log('ExtensionWallet error: ', error);

            this.connectedWallet = undefined;
            this.walletConnectionChanges = WalletStatus.error;
            return;
        }
    }

    public async walletConnect() {
        try {
            await this.walletConnectProvider.enable();

            const ethersProvider = new ethers.providers.Web3Provider(this.walletConnectProvider);

            const { chainId } = await ethersProvider.getNetwork();

            this.provider = ethersProvider;

            this.signer = this.provider.getSigner();
            this.connectedWallet = await this.getAddress();
            this.walletConnectionChanges = WalletStatus.connected;
            return;
        } catch (error) {
            console.log('WalletConnect error: ', error);

            this.connectedWallet = undefined;
            this.walletConnectionChanges = WalletStatus.error;
            return;
        }
    }

    public connectClicked() {
        this.connectClickedChanges = true;

        this.connectClickedChanges = false;
    }

    public connectionCanceled() {
        if (!this.connectedWallet) {
            this.walletConnectionChanges = WalletStatus.disconnected;
        }
    }

    public async disconnect() {
        if (this.walletConnectProvider.connected) {
            this.walletConnectProvider.disconnect();
        }

        this.signer = undefined;
        this.connectedWallet = undefined;

        this.walletConnectionChanges = WalletStatus.disconnected;
    }

    public async getNetwork() {
        return this.provider.getNetwork();
    }

    public async setContract(chain: Chain) {
        this.activeContract = chainContractAddress[chain];

        const abiFile = await import(`../utils/abi/${this.activeContract}`) as any;
        this.iface = new ethers.utils.Interface(abiFile.jsonAbi || abiFile.jsonAbiMainNet);
        this.sbtAbi = this.iface.format(ethers.utils.FormatTypes['full']);

        this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    public async getAddress(): Promise<string> {
        if (!this.signer) {
            return '';
        }

        return await this.signer.getAddress();
    }

    public isAddress(address: string): boolean {
        return ethers.utils.isAddress(address);
    }

    public createHash(str: string): string {
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
    }

    public async gasPrice(): Promise<BigNumber> {
        let price = await this.provider.getGasPrice();
        let gwei = ethers.utils.formatUnits(price, 'gwei');

        // Account for weird polygon shifts when the gas price is super low. It tends to swing way back up.
        if (parseFloat(gwei) < 30) {
            gwei = '35';
        }

        const difference = parseFloat(gwei.toString()) * 0.25;
        const increase = (parseFloat(gwei.toString()) + difference).toFixed(9);

        return ethers.utils.parseUnits(increase.toString(), 'gwei');
    }

    public async getTransaction(txnHash: string) {
        return this.provider.getTransaction(txnHash);
    }

    public async waitOneBlock() {
        let currentBlockNumber = await this.provider.getBlockNumber();

        await new Promise((resolve, reject) => {
            const blockListener = async (blockNumber: number) => {
                if (currentBlockNumber === blockNumber) {
                    this.provider.once('block', blockListener);
                    return;
                }

                resolve(true);
            };

            this.provider.once('block', blockListener);
        });
    }

    public async createPromise(promiseCreation: PromiseCreation) {
        const contractSigner = this.contractSigner();

        const price = await this.gasPrice();

        const options = {
            maxPriorityFeePerGas: price,
            maxFeePerGas: price,
            gasLimit: 200000,
        }

        const txn = await contractSigner.createPromise(promiseCreation, options);

        return txn;
    }

    public async signPromise(promiseHash: string) {
        const contractSigner = this.contractSigner();

        const price = await this.gasPrice();

        const options = {
            maxPriorityFeePerGas: price,
            maxFeePerGas: price,
            gasLimit: 500000,
        }

        const txn = await contractSigner.signPromise(promiseHash, options);

        return txn;
    }

    public async getPromise(promiseHash: string) {
        const contractFunctions = this.contract.functions;
        return contractFunctions.promises(promiseHash);
    }
}


