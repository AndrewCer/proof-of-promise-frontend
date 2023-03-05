import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Chain } from '../../models/chain.model';
import { PromiseData } from '../../models/promise.model';
import { StringFormatterService } from '../../services/string-formatter.service';

export enum ButtonAction {
    claim,
    connect,
    edit,
    bind,
    burn,
    distribute,
    manage,
}

export enum MaterialButtonType {
    stroked,
    flat,
}

export interface ActionButton {
    action: ButtonAction;
    color: string;
    class: string;
    disabled: boolean;
    hidden: boolean
    loading: boolean;
    materialType: MaterialButtonType;
    text: string;
    imgIconSrc?: string;
    matIcon?: string
}

@Component({
    selector: 'token-detail',
    templateUrl: './token-detail.component.html',
    styleUrls: ['./token-detail.component.scss', '../styles/token.scss']
})
export class TokenDetailComponent implements OnDestroy {
    @Input() buttons: ActionButton[] | undefined;
    @Input() isMgmtPage: boolean;
    @Input() token: PromiseData;

    @Input() isRestricted: boolean; // Used when a user is not allowed to view a restricted token.
    @Input() submitError: string; // Pass in a string of text that will display in read above dynamic buttons.

    @Output() onButtonClick = new EventEmitter<ActionButton>();

    public smallView = false;

    public get Chain() {
        return Chain;
    }

    private subscriptionKiller = new Subject();

    constructor(
        public stringFormatterService: StringFormatterService,
        private breakpointObserver: BreakpointObserver,
    ) {
        this.breakpointObserver
            .observe(['(max-width: 800px)'])
            .pipe(
                takeUntil(this.subscriptionKiller)
            )
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.smallView = true;
                } else {
                    this.smallView = false;
                }
            });
    }

    ngOnDestroy() {
        this.subscriptionKiller.next(null);
        this.subscriptionKiller.complete();
    }

    public get ButtonAction() {
        return ButtonAction;
    }

    public get MaterialButtonType() {
        return MaterialButtonType;
    }

    public buttonClicked(button: ActionButton) {
        this.onButtonClick.emit(button);
    }

    public openBlockExplorer() {
        // TODO(nocs): store and get txn hash at an earlier time.
        // if (this.token.chain == Chain.base) {
        //     window.open(`${environment.baseScanUrl}/tx/${this.token.txnHash}`, '_blank')?.focus();
        //   }
        //   else {
        //     window.open(`${environment.polygonScanUrl}/tx/${this.token.txnHash}`, '_blank')?.focus();
        //   }
    }
}
