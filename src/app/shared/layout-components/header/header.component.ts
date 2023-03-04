import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { WalletStatus } from '../../models/wallet.model';
import { NavService } from '../../services/nav.service';
import { StringFormatterService } from '../../services/string-formatter.service';
import { SwitcherService } from '../../services/switcher.service';
import { WalletService } from '../../services/wallet.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  public currentRoute: string = '';
  public walletAddress: string | undefined;

  private subscriptionKiller = new Subject();


  public isCollapsed = true;

  constructor(
    public stringFormatterService: StringFormatterService,
    public SwitcherService: SwitcherService,
    public navServices: NavService,
    public walletService: WalletService,
    private router: Router,
  ) {
    this.router.events.pipe(
      takeUntil(this.subscriptionKiller),
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    ).subscribe(event => {
      this.currentRoute = event.url;

      this.isCollapsed = true;
    });

    this.walletService.$walletConnectionChanges.pipe(
      takeUntil(this.subscriptionKiller)
    )
      .subscribe((walletStatus: WalletStatus | undefined) => {
        if (walletStatus === undefined) {
          return;
        }

        this.handleWalletChanges(walletStatus);
      });
  }

  public connectClicked() {
    this.walletService.connectClicked();
  }

  public disconnectClicked() {
    this.walletService.disconnect();
  }

  ngOnDestroy() {
    this.subscriptionKiller.next(null);
    this.subscriptionKiller.complete();
  }

  private handleWalletChanges(walletStatus: WalletStatus) {    
    switch (walletStatus) {
      case WalletStatus.connected:
        this.walletAddress = this.walletService.connectedWallet;
        break;
      case WalletStatus.disconnected:
        this.walletAddress = undefined;
        break;
      case WalletStatus.switched:
        break;
      case WalletStatus.error:
        break;

      default:
        break;
    }
  }
}
