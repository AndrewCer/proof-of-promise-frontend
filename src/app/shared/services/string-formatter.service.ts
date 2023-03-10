import { Injectable } from '@angular/core';


@Injectable({ providedIn: "root" })
export class StringFormatterService {

    public truncateAddress(address: string | undefined): string {
        if (!address) {
            return '';
        }

        const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

        const match = address.match(truncateRegex);
        if (!match) return address;
        return `${match[1]}…${match[2]}`;
    }

    public truncateString(str: string, limit: number): string {
        if (str.length > limit) {
            return str.slice(0, limit) + "...";
        } else {
            return str;
        }
    }

}
