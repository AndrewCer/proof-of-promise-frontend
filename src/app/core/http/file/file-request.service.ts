import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from 'src/app/core/http/api/api.service';
import { ApiResponse, RequestMethod } from 'src/app/shared/models/api.model';
import { FileUploadReturn } from 'src/app/shared/models/file-upload.model';

@Injectable({
    providedIn: 'root'
})
export class FileRequestService {
    private basePath = 'file';
    private versionPath = `/v1/${this.basePath}`

    constructor(private apiService: ApiService) { }

    /**
     * 
     * @param text input text to send to AI.
     * @returns AI response string. Currently formatted in a bulletted list. (easy to split on)
     */
    public uploadImage(formData: FormData): Observable<ApiResponse<FileUploadReturn>> {
        const path = `${this.versionPath}/upload`;
        return this.apiService.requestMultipart(RequestMethod.post, path, formData);
    }
}
