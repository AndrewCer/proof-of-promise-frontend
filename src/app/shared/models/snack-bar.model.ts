import { Chain } from "./chain.model";

export interface SnackBarModel {
    message: string;
    closeButtion: boolean;
    state: SnackBarState;
    txnHash?: string;
    chain?: Chain;
    contract?: string;
}

export enum SnackBarState {
    done = 'done',
    loading = 'loading',
}
