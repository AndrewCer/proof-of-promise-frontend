import { BurnAuth } from "./types.model";

interface TokenAttributes {
    trait_type: string;
    value: string | number;
}

export interface Metadata {
    description: string;
    image: string;
    name: string;
    attributes?: TokenAttributes;
    external_url?: string;
}

export interface PromiseData {
    burnAuth: BurnAuth;
    created: number;
    creator: string;
    price: number;
    restricted: boolean;
    tokenUri: string;
    promiseHash: string; // `${tokenUri}:${addr1.address}`
    metadata: Metadata;
    signers?: string[]; // Anyone that signs the Promise
    receivers?: string[]; // Optional but toggles restricted = true if pressent
}