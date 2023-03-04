export declare enum BurnAuth {
    IssuerOnly = 0,
    OwnerOnly = 1,
    Both = 2,
    Neither = 3
}
export declare enum ClaimStatus {
    issued = 0,
    claimed = 1,
    emailed = 2,
    burned = 3
}
export declare enum ErrorCode {
    entityExists = "Entity already exists",
    entityDoesntExist = "Entity does NOT exists",
    invalidRequest = "Invalid request",
    unauthorized = "Unauthorized"
}
export interface ApiResponse<T> {
    errorCode?: ErrorCode;
    success?: T;
}
export interface AddToIssuedRequest {
    addresses?: string[];
    codeCount?: number;
}
export interface AuthorizationRequest {
    signature: string;
    message: string;
}
export interface BindRequest {
    address: string;
    eventId: string;
    message: string;
    signature: string;
    tokenId: string;
}
export interface BurnRequest {
    address: string;
    eventId: string;
    message: string;
    signature: string;
    tokenId: string;
}
export interface ClaimRequest {
    address: string;
    id: string;
    signature: string;
    message: string;
    uniqueCode?: string;
}
export interface CreateRequest {
    address: string;
    boe: boolean;
    burnAuth: BurnAuth;
    metaData: SbtMetadata;
    restricted: boolean;
    signature: string;
    tokenUri: string;
    tokenLimit?: number;
    issuedToCodes?: Token[];
    issuedToWalletAddresses?: Token[];
}
export interface UpdateRequest {
    address: string;
    eventId: string;
    message: string;
    metaData: SbtMetadata;
    signature: string;
    tokenId: string;
    tokenUri: string;
}
export interface FileUploadReturn {
    uri: string;
    metaData: SbtMetadata;
}
export interface FileUploadRequest extends SbtMetadata {
    file: File;
}
export interface FilterType {
    organization?: boolean;
    canClaim?: boolean;
}
export declare enum RequestMethod {
    delete = "DELETE",
    get = "GET",
    patch = "PATCH",
    post = "POST"
}
export interface SbtMetadata {
    description: string;
    external_url: string;
    image: string;
    name: string;
    attributes: TokenAttributes[];
}
export interface Tenant {
    id: string;
    name: string;
}
export interface Token {
    created: number;
    eventId: string;
    status: ClaimStatus;
    to: string;
    bound?: boolean;
    claimersEmail?: string;
    code?: string;
    metaData?: SbtMetadata;
    tenantId?: string;
    tokenId?: number | undefined;
    txnHash?: string;
}
export interface TokenAttributes {
    trait_type: string;
    value: string | number;
}
export interface TokenData {
    burnAuth: BurnAuth;
    created: number;
    metaData: SbtMetadata;
    owner: string;
    txnHash: string;
}
