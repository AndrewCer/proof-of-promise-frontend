import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { ApiService } from 'src/app/core/http/api/api.service';
import { ApiResponse, RequestMethod } from 'src/app/shared/models/api.model';
import { PromiseData } from 'src/app/shared/models/promise.model';

@Injectable({
    providedIn: 'root'
})
export class ContractRequestService {
    private basePath = 'contract';
    private versionPath = `/v1/${this.basePath}`;

    constructor(private apiService: ApiService) { }

    public getPromise(promiseHash: string): Observable<ApiResponse<PromiseData>> {
        const path = `${this.versionPath}/promise/${promiseHash}`;
        return this.apiService.request(RequestMethod.get, path)
    }

    public getPromises(address: string): Observable<ApiResponse<PromiseData[]>> {
        const path = `${this.versionPath}/promises/${address}`;
        return this.apiService.request(RequestMethod.get, path)
    }

    public updatePromise(promiseHash: string, address: string): Observable<ApiResponse<PromiseData>> {
        const path = `${this.versionPath}/promise/${promiseHash}`;
        return this.apiService.request(RequestMethod.patch, path, { address })
    }

}
