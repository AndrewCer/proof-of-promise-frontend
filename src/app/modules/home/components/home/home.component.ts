import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { WalletSelectModalComponent } from 'src/app/shared/components/modals/wallet-select/wallet-select.modal.component';
import { WalletStatus } from 'src/app/shared/models/wallet.model';
import { WalletService } from 'src/app/shared/services/wallet.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnDestroy {
    private subscriptionKiller = new Subject();

    public currentRoute: string | undefined;
    public walletStatus: WalletStatus | undefined;

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private walletService: WalletService,
    ) {
        this.walletService.startup();

        this.router.events.pipe(
            takeUntil(this.subscriptionKiller),
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        ).subscribe(event => {
            this.currentRoute = event.url;
        });

        this.walletService.$walletConnectionChanges.pipe(
            takeUntil(this.subscriptionKiller)
        ).subscribe((walletStatus) => {
            this.walletStatus = walletStatus;

            if (this.walletStatus === WalletStatus.connected && this.currentRoute === '/') {
                this.router.navigate([`promises`]);
            }
        });

        this.walletService.$connectClickedChanges.pipe(
            takeUntil(this.subscriptionKiller)
        ).subscribe((clicked) => {
            if (clicked) {
                let options = [{
                    label: 'WalletConnect',
                    img: 'assets/img/wallet-connect-logo.svg'
                }];

                if (window.ethereum) {
                    const providerMap = window.ethereum.providerMap;

                    if (!providerMap) {
                        if (window.ethereum.isCoinbaseWallet) {
                            options.unshift({
                                label: 'CoinbaseWallet',
                                img: 'assets/img/coinbase-wallet-logo.jpg'
                            });
                        }
                        if (window.ethereum.isMetaMask) {
                            options.unshift({
                                label: 'MetaMask',
                                img: 'assets/img/metamask-logo.svg'
                            });
                        }
                    }
                    else {
                        for (let provider of providerMap.keys()) {
                            const option = {
                                label: '',
                                img: ''
                            }
                            if (provider === 'CoinbaseWallet') {
                                option.label = provider;
                                option.img = 'assets/img/coinbase-wallet-logo.jpg';
                            }
                            if (provider === 'MetaMask') {
                                option.label = provider;
                                option.img = 'assets/img/metamask-logo.svg';
                            }

                            if (option.label.length) {
                                options.unshift(option);
                            }
                        }
                    }
                }

                const dialogRef = this.dialog.open(WalletSelectModalComponent, {
                    data: options,
                    width: '500px',
                });

                dialogRef.afterClosed().subscribe(option => {
                    // Cancel/close button clicked
                    if (!option) {
                        this.walletService.connectionCanceled();
                    }
                    // Option selected
                    if (option === 'MetaMask') {
                        this.walletService.connectExtensionWallet(option)
                    }
                    if (option === 'CoinbaseWallet') {
                        this.walletService.connectExtensionWallet(option);
                    }
                    if (option === 'WalletConnect') {
                        this.walletService.walletConnect();
                    }
                });
            }
        });
    }

    ngOnDestroy() {
        this.subscriptionKiller.next(null);
        this.subscriptionKiller.complete();
    }

    public connectClicked() {
        this.walletService.connectClicked();
    }

    public isAddress(input: string) {
        this.router.navigate([`promises/${input}`]);
    }

}
