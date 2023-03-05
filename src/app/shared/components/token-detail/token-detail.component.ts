import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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

    public baseContractAddress = '0xfC60aFf54B10f4A055044caf8760D47Ce8D218A1';
    public smallView = false;

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
        // TODO(nocs): open block explorer for base/polygon
        if (this.token) {
        }
    }
}
