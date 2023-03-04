import { AbstractControl } from '@angular/forms';
import { ethers } from "ethers";

import validator from 'validator';

export default class Validation {
    // Validate Comma separated list of wallet addresses
    static validateAddresses(control: AbstractControl): { [key: string]: any } | null {
        try {
            if (control.value) {
                const issueToStr = control.value.replace(/\s+/g, '');
                const issueToArr = [...new Set(issueToStr.split(','))] as string[];

                const notAddresses = issueToArr.filter((address) => !ethers.utils.isAddress(address.trim()))

                if (notAddresses && notAddresses.length) {
                    return { 'issueTo': true };
                }
            }

            return null;

        } catch (error) {
            return { 'issueTo': true };
        }
    }
}
