import { BigNumber } from "ethers";

export interface PromiseCreation {
    burnAuth: BigNumber;
    promiseHash: string;
    receivers: string[];
    tokenUri: string;
}