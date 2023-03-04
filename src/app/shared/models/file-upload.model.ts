import { BigNumber } from "ethers";
import { Metadata } from "./promise.model";

export interface FileUploadReturn {
    uri: string;
    metaData: Metadata;
    price: BigNumber;
}
