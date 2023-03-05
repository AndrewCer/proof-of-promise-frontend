import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatestWith, filter, Subject, take, takeUntil } from 'rxjs';
import { ContractRequestService } from 'src/app/core/http/contract/contract-request.service';
import { SnackBarTxnNotifyComponent } from 'src/app/shared/components/snack-bars/txn-notify/snack-bar-txn-notify.component';
import { ActionButton, ButtonAction, MaterialButtonType } from 'src/app/shared/components/token-detail/token-detail.component';
import { Chain } from 'src/app/shared/models/chain.model';
import { PromiseData } from 'src/app/shared/models/promise.model';
import { SnackBarState } from 'src/app/shared/models/snack-bar.model';
import { WalletStatus } from 'src/app/shared/models/wallet.model';
import { StringFormatterService } from 'src/app/shared/services/string-formatter.service';
import { WalletService } from 'src/app/shared/services/wallet.service';

const confetti = require('canvas-confetti');

@Component({
    selector: 'sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnDestroy {
    public noTokens = false;

    public token: PromiseData;

    public actionButtons: ActionButton[] = [];
    public claimSuccess = false;
    public currentRoute: string = '';
    public eventId: string | null = null;
    public isClaimed = false;
    public isRestricted = false;
    public pageLoading = true;
    public submitError: string;
    public tokens: PromiseData[] = [];
    public uniqueCode: string | null = null;


    private subscriptionKiller = new Subject();

    constructor(
        public stringFormatterService: StringFormatterService,
        public walletService: WalletService,
        private activatedRoute: ActivatedRoute,
        private contractRequestService: ContractRequestService,
        private router: Router,
        private snackBar: MatSnackBar,
        private viewScroller: ViewportScroller,
    ) {
        this.actionButtons = [
            {
                action: ButtonAction.claim,
                color: 'primary',
                class: 'btn ripple btn-primary btn-block d-flex align-items-center justify-content-center gap-1',
                text: 'Sign',
                loading: false,
                materialType: MaterialButtonType.flat,
                disabled: false,
                hidden: true,
            },
            {
                action: ButtonAction.connect,
                color: 'primary',
                class: 'btn ripple btn-primary btn-block d-flex align-items-center justify-content-center gap-1',
                text: 'Connect',
                loading: false,
                materialType: MaterialButtonType.flat,
                disabled: false,
                hidden: true,
                matIcon: 'account_balance_wallet',
            },
        ];

        this.router.events.pipe(
            takeUntil(this.subscriptionKiller),
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        ).pipe(
            combineLatestWith(this.walletService.$walletConnectionChanges, this.activatedRoute.paramMap),
            takeUntil(this.subscriptionKiller),
        ).subscribe(async ([routerEvent, walletStatus, params]) => {
            this.resetButtonLoadState();

            if (walletStatus === WalletStatus.connected) {
                this.actionButtons.forEach((button) => {
                    if (button.action === ButtonAction.claim) {
                        button.hidden = false;
                    }
                    else {
                        button.hidden = true;
                    }
                });
            }

            if (walletStatus === undefined || walletStatus === WalletStatus.error) {
                this.actionButtons.forEach((button) => {
                    if (button.action === ButtonAction.connect) {
                        button.hidden = false;
                    }
                    else {
                        button.hidden = true;
                    }
                });
            }

            if (walletStatus === WalletStatus.attemptingConnection) {
                this.actionButtons.forEach((button) => {
                    if (button.action === ButtonAction.connect) {
                        button.disabled = true;
                        button.loading = true;
                    }
                    else {
                        button.hidden = true;
                    }
                });
            }

            if (walletStatus === WalletStatus.disconnected) {
                this.actionButtons.forEach((button) => {
                    if (button.action === ButtonAction.connect) {
                        button.hidden = false;
                    }
                    else {
                        button.hidden = true;
                    }
                });
            }

            this.pageLoading = true;

            // router events
            this.currentRoute = routerEvent.url;
            this.noTokens = false;

            if (params.get('hash')) {
                contractRequestService.getPromise(params.get('hash') as string).pipe(
                    take(1)
                ).subscribe((apiResponse) => {
                    if (apiResponse.success) {
                        this.token = apiResponse.success;
                        if (this.token.receivers && this.token.receivers.length && !this.token.receivers.includes(this.walletService.connectedWallet!)) {
                            this.isRestricted = true;
                        }

                        this.pageLoading = false;
                    }
                });
            }
            else {
                this.noTokens = true;
                this.pageLoading = false;
            }

            // router params
            this.eventId = params.get('eventId');
            this.uniqueCode = params.get('code');

            // TODO(nocs): chech sign auth?
        });

        this.viewScroller.scrollToPosition([0, 0]);
    }

    ngOnDestroy() {
        this.subscriptionKiller.next(null);
        this.subscriptionKiller.complete();
    }

    public buttonClicked(button: ActionButton) {

        if (button.action === ButtonAction.claim) {
            button.loading = true;
            button.disabled = true;
            button.text = 'Signing';
            this.sign();
        }

        if (button.action === ButtonAction.connect) {
            button.loading = true;
            button.disabled = true;
            button.text = 'Connecting';
            this.walletService.connectClicked();
        }
    }

    public async sign() {
        if (!this.walletService.connectedWallet) {
            this.resetButtonLoadState();
            return;
        }

        if (!this.token.promiseHash) {
            return;
        }


        const txn = await this.walletService.signPromise(this.token.promiseHash);

        this.trackPendingTransaction(txn.hash);
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
                chain: Chain.polygon,
            }
        });
    }


    private async trackPendingTransaction(txnHash: string) {
        this.viewScroller.scrollToPosition([0, 0]);

        this.snackBar.openFromComponent(SnackBarTxnNotifyComponent, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            data: {
                message: 'Transaction pending...',
                closeButtion: false,
                state: SnackBarState.loading,
                txnHash,
                chain: Chain.polygon,
            }
        });

        try {
            let txn = await this.walletService.getTransaction(txnHash);
            if (!txn) {
                await this.walletService.waitOneBlock();

                txn = await this.walletService.getTransaction(txnHash);
            }

            await txn.wait();
        } catch (error) {
            console.log(error);
            
            this.submitError = 'Error while submitting transaction';
            this.pageLoading = false;
            return;
        }

        this.contractRequestService.updatePromise(this.token.promiseHash, this.walletService.connectedWallet!).pipe(
            take(1)
        ).subscribe(() => { });

        this.fireConfetti();
        this.claimSuccess = true;

        this.openCompleteSnackBar(txnHash);
    }

    private resetButtonLoadState() {
        this.actionButtons = this.actionButtons.map((button) => {
            if (button.action === ButtonAction.claim) {
                button.text = 'Sign';
                button.hidden = false;
            }

            if (button.action === ButtonAction.connect) {
                button.text = 'Connect';
                button.hidden = true;
            }

            button.loading = false;
            button.disabled = false;
            return button;
        });
    }

    private confetti(args: any) {
        const confetti = window['confetti' as any] as any;
        return confetti.apply(this, args);
    }

    private async fireConfetti() {
        this.confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 1 }
        });

        await confetti;
        var confettiCanvase = document.createElement('confetti-canvas');
        document.body.appendChild(confettiCanvase);
        var covfefe = confetti.create(confettiCanvase, {
            resize: true,
            useWorker: true
        });
        covfefe({
            particleCount: 100,
            spread: 160
        });
    }
}

