import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ethers } from 'ethers';
import { Subject, take, takeUntil } from 'rxjs';
import { ContractRequestService } from 'src/app/core/http/contract/contract-request.service';
import { FileRequestService } from 'src/app/core/http/file/file-request.service';

import { SnackBarTxnNotifyComponent } from 'src/app/shared/components/snack-bars/txn-notify/snack-bar-txn-notify.component';
import { Chain } from 'src/app/shared/models/chain.model';
import { PromiseCreation } from 'src/app/shared/models/promise-creation.model';
import { PromiseData } from 'src/app/shared/models/promise.model';
import { SnackBarState } from 'src/app/shared/models/snack-bar.model';
import { WalletService } from 'src/app/shared/services/wallet.service';
import Validation from 'src/app/shared/utils/validation.util';
import { environment } from 'src/environments/environment';

export enum ClaimType {
    anyone,
    drop,
    uniqueCode,
    whitelist,
}

enum PopOption {
    file,
    manual,
    link
}

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnDestroy {
    public baseUrl = '';
    public chains = [
        Chain.base,
        Chain.polygon,
    ];
    public copyLinkText = 'Copy';
    public copyLinkIcon = 'content_copy';
    public dialogRef!: MatDialogRef<any>;
    public fileFormData = new FormData();
    public imgUrl: string | undefined = 'assets/img/brand/pop-logo.png';
    public pageLoading = true;
    public progressText: string | undefined;
    public signLink: string;
    public testnet = false;

    public token: PromiseData;

    public form: FormGroup;
    public submitting = false;
    public restricted = false;

    public popOptionSelect: PopOption | undefined = undefined;

    // Edit props
    public isEdit = false;

    private subscriptionKiller = new Subject();

    public get Chain() {
        return Chain;
    }
    public get ClaimType() {
        return ClaimType;
    }
    public get formControl(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    public get popOption() {
        return PopOption;
    }

    constructor(
        public dialog: MatDialog,
        public walletService: WalletService,
        private activatedRoute: ActivatedRoute,
        private fileRequestService: FileRequestService,
        private formBuilder: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
        private viewScroller: ViewportScroller,
    ) {
        if (!environment.production) {
            this.testnet = true;
        }

        this.baseUrl = this.router['location']._platformLocation.location.origin;

        this.viewScroller.scrollToPosition([0, 0]);

        this.listenToQueryParams();
    }

    ngOnDestroy() {
        this.subscriptionKiller.next(null);
        this.subscriptionKiller.complete();

        this.fileFormData = new FormData();
    }

    public linkCopied() {
        this.copyLinkIcon = 'done';
        this.copyLinkText = 'Copied';
    }

    private listenToQueryParams() {
        this.activatedRoute.queryParams.pipe(
            takeUntil(this.subscriptionKiller),
        ).subscribe(params => {
            const option = params['option'];

            this.init();

            if (option) {
                this.popOptionSelect = option;

                this.fileFormData = new FormData();
                if (option == PopOption.file) {
                    this.imgUrl = undefined;
                }
                else {
                    this.imgUrl = 'assets/img/brand/pop-logo.png';
                }
                this.setPromiseData();
            }
            else {
                this.popOptionSelect = undefined;
            }
        });
    }

    public optionSelect(option: PopOption) {
        this.router.navigate(['create'], { queryParams: { option } })
    }

    public init() {
        this.form = this.setupForm();
        this.setPromiseData();
        this.form.valueChanges.pipe(
            takeUntil(this.subscriptionKiller)
        ).subscribe(() => {
            this.setPromiseData();
        });
    }

    public async submit() {
        if (this.form.invalid) {
            return;
        }

        if (!this.walletService.connectedWallet) {
            return;
        }

        this.submitting = true;

        let walletAddresses: string[] = [];
        if (this.formControl['signers'] && this.formControl['signers'].value) {
            let signersStr = this.formControl['signers'].value;
            // Remove trailing comma if one exists
            signersStr = signersStr.replace(/,*$/, '');
            // Remove all spaces
            signersStr = signersStr.replace(/\s+/g, '');

            // Remove duplicates
            const signersArr = [...new Set(signersStr.split(','))] as string[];

            walletAddresses = signersArr.filter((signer) => this.walletService.isAddress(signer as string));
        }

        this.fileFormData.append('name', this.formControl['name'].value);
        this.fileFormData.append('description', this.formControl['description'].value || '');
        this.fileFormData.append('external_url', this.formControl['externalLink'].value || '');

        this.fileFormData.append('burnAuth', this.formControl['burnAuth'].value);
        this.fileFormData.append('creator', this.walletService.connectedWallet);
        this.fileFormData.append('chain', this.formControl['chain'].value);
        // TODO(nocs): do price
        // this.fileFormData.append('price', this.formControl['price'].value);
        this.fileFormData.append('receivers', walletAddresses.join());


        this.fileRequestService.uploadImage(this.fileFormData).pipe(
            take(1)
        ).subscribe(async (apiResponse) => {
            if (!apiResponse.success) {
                this.fileFormData.delete('name')
                this.fileFormData.delete('description')
                this.fileFormData.delete('external_url')
                this.fileFormData.delete('attributes')

                this.submitting = false;
                return;
            }

            const ipfsUri = apiResponse.success.uri;

            const promiseCreation: PromiseCreation = {
                burnAuth: ethers.BigNumber.from(this.formControl['burnAuth'].value),
                promiseHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${ipfsUri}:${this.walletService.connectedWallet}`)),
                receivers: walletAddresses,
                tokenUri: ipfsUri,
            }

            // Set proper contract address
            await this.walletService.setContract(this.formControl['chain'].value);

            const txn = await this.walletService.createPromise(promiseCreation);

            console.log(txn);

            this.token.promiseHash = txn;

            this.trackPendingTransaction(txn.hash, promiseCreation.promiseHash);
        });
    }

    public onImageSelected(event: Event | DragEvent) {
        this.form.markAsDirty();

        // Typecasting to account for both drag and click events
        let inputElement = (event as DragEvent).dataTransfer ? (event as DragEvent).dataTransfer : (event.target as HTMLInputElement)

        this.fileFormData = new FormData();


        if (inputElement && inputElement.files) {
            const file = inputElement.files[0];

            if (!this.formControl['name'].value) {
                this.formControl['name'].setValue(file.name);
            }

            var reader = new FileReader();
            reader.readAsDataURL(file);

            this.imgUrl = 'assets/img/brand/pop-logo.png';

            this.fileFormData.append('uploaded-image', file);

            this.setPromiseData();
        }
    }

    public setPromiseData(forceReset?: boolean) {
        if (forceReset) {
            this.formControl['name'].reset();
        }

        this.token = {
            burnAuth: this.formControl['burnAuth'].value,
            created: Date.now(),
            creator: this.walletService.connectedWallet || '',
            price: 0,
            restricted: false,
            tokenUri: '',
            promiseHash: '',
            metadata: {
                name: this.formControl['name'].value || 'Name',
                description: this.formControl['description'].value || 'Description',
                external_url: this.formControl['externalLink'].value || 'External Url',
                image: this.imgUrl || 'assets/img/placeholder.png',
            }
        }
    }

    private setupForm(): FormGroup {
        return this.formBuilder.group({
            chain: [this.testnet ? Chain.polygon : Chain.base, Validators.compose([
                Validators.required
            ])],
            name: [null, Validators.compose([
                Validators.required,
            ])],
            description: [null, this.popOptionSelect == PopOption.manual ? Validators.required : undefined],
            externalLink: [null, this.popOptionSelect == PopOption.link ? Validators.required : undefined],
            burnAuth: ['2', Validators.compose([
                Validators.required,
            ])],
            // Restricted
            signers: [null, Validators.compose([
                Validation.validateAddresses,
            ])],
        });
    }

    public openBlockExplorer(txn: any) {
        if (!txn) {
            return;
        }

        if (this.formControl['chain'].value === Chain.base) {
            window.open(`${environment.baseScanUrl}/tx/${txn.hash}`, '_blank')?.focus();
        }
        else {
            window.open(`${environment.polygonScanUrl}/tx/${txn.txn}`, '_blank')?.focus();
        }
    }

    public openCompleteSnackBar(txnHash: string) {
        this.snackBar.openFromComponent(SnackBarTxnNotifyComponent, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 5000,
            data: {
                message: 'Complete!',
                closeButtion: true,
                state: SnackBarState.done,
                txnHash,
                chain: this.formControl['chain'].value,
            }
        });
    }

    private async trackPendingTransaction(txnHash: string, promiseHash: string) {
        this.viewScroller.scrollToPosition([0, 0]);

        this.progressText = 'Transaction pending...';

        this.snackBar.openFromComponent(SnackBarTxnNotifyComponent, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            data: {
                message: 'Transaction pending...',
                closeButtion: false,
                state: SnackBarState.loading,
                txnHash,
                chain: this.formControl['chain'].value,
            }
        });

        let txn = await this.walletService.getTransaction(txnHash);
        if (!txn) {
            await this.walletService.waitOneBlock();

            txn = await this.walletService.getTransaction(txnHash);
        }

        await txn.wait();

        this.signLink = `${this.baseUrl}/sign/${promiseHash}`;

        this.openCompleteSnackBar(txnHash);
    }

}