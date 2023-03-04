import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface WalletOption {
    label: string,
    img: string,
}

@Component({
    selector: 'wallet-select-modal',
    templateUrl: './wallet-select.modal.component.html',
    styleUrls: ['./wallet-select.modal.component.scss'],
})
export class WalletSelectModalComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA) public options: WalletOption[],
        public dialogRef: MatDialogRef<WalletSelectModalComponent>,
    ) { }

    public selected(option: string) {
        this.dialogRef.close(option);
    }

}