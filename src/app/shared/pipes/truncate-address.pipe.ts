import {Pipe, PipeTransform} from "@angular/core";
import {StringFormatterService} from "../services/string-formatter.service";

@Pipe({name: 'truncateAddress'})
export class TruncateAddressPipe implements PipeTransform{
    constructor(private stringFormatterService: StringFormatterService) {}

    transform(value: any, ...args: any[]): any {
        return this.stringFormatterService.truncateAddress(value);
    }
}
