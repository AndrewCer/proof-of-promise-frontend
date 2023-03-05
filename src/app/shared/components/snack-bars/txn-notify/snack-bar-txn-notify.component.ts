import { Component, Inject } from "@angular/core";
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { Chain } from "src/app/shared/models/chain.model";
import { SnackBarModel } from "src/app/shared/models/snack-bar.model";
import { environment } from "src/environments/environment";

@Component({
  selector: 'snack-bar',
  templateUrl: 'snack-bar-txn-notify.component.html',
  styleUrls: ['./snack-bar-txn-notify.component.scss'],
})
export class SnackBarTxnNotifyComponent {

  public baseContractAddress = '0xfC60aFf54B10f4A055044caf8760D47Ce8D218A1';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarModel,
    private snackBarRef: MatSnackBarRef<SnackBarTxnNotifyComponent>,
  ) { }

  public close() {
    this.snackBarRef.dismiss();
  }

  public openBlockExplorer() {
    if (this.data.chain == Chain.base) {
      window.open(`${environment.baseScanUrl}/tx/${this.data.txnHash}`, '_blank')?.focus();
    }
    else {
      window.open(`${environment.polygonScanUrl}/tx/${this.data.txnHash}`, '_blank')?.focus();
    }
  }

}
