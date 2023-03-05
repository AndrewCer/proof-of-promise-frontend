import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { ContractRequestService } from 'src/app/core/http/contract/contract-request.service';
import { PromiseData } from 'src/app/shared/models/promise.model';
import { WalletStatus } from 'src/app/shared/models/wallet.model';
import { WalletService } from 'src/app/shared/services/wallet.service';

@Component({
    selector: 'promise',
    templateUrl: './promise-list.component.html',
    styleUrls: ['./promise-list.component.scss'],
})
export class PromiseListComponent implements OnInit, OnDestroy {

    public dataLoading = false;
    public promises: PromiseData[] = [];

    private subscriptionKiller = new Subject();

    constructor(
        public walletService: WalletService,
        private contractRequestService: ContractRequestService,
        private viewScroller: ViewportScroller,
    ) { }

    ngOnDestroy() {
        this.subscriptionKiller.next(null);
        this.subscriptionKiller.complete();
    }

    ngOnInit() {
        this.viewScroller.scrollToPosition([0, 0]);

        this.walletService.$walletConnectionChanges.pipe(
            takeUntil(this.subscriptionKiller)
        ).subscribe((walletStatus: WalletStatus | undefined) => {
            if (walletStatus === undefined) {
                return;
            }

            this.handleWalletChanges(walletStatus);
        });
    }

    public async getPromises(address: string) {
        this.dataLoading = true;

        this.contractRequestService.getPromises(address).pipe(
            take(1)
        ).subscribe((apiResponse) => {
            this.dataLoading = false;

            if (apiResponse.success && apiResponse.success.length) {
                this.promises = apiResponse.success;
            }
        });
    }

    public tokenClicked(promise: PromiseData) {
        // TODO(nocs): open to view page
        if (!promise.metadata.description || !promise.metadata.description.length) {
            window.open(promise.metadata.external_url, '_blank')?.focus();
        }
    }

    private async handleWalletChanges(walletStatus: WalletStatus) {
        switch (walletStatus) {
            case WalletStatus.connected:
                if (!this.walletService.connectedWallet) {
                    return;
                }

                this.getPromises(this.walletService.connectedWallet);
                break;
            case WalletStatus.disconnected:
                this.promises = [];
                break;
            case WalletStatus.switched:
                if (!this.walletService.connectedWallet) {
                    return;
                }

                this.getPromises(this.walletService.connectedWallet);
                break;
            case WalletStatus.error:
                break;

            default:
                break;
        }
    }
}