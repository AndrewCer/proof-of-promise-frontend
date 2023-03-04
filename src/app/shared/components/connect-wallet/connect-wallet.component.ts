import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { WalletStatus } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent {
  @Input() passedInAddress: string | null = null;
  @Input() walletStatus: WalletStatus | undefined;
  @Output() onConnectClicked = new EventEmitter<boolean>();

  constructor(
    public walletService: WalletService,
  ) {}

  public connectClicked() {
    this.onConnectClicked.emit(true);
  }


}
