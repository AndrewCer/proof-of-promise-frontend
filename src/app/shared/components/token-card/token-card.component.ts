import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TokenData } from "@soulbind/sdk";
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'token-card',
  templateUrl: './token-card.component.html',
  styleUrls: ['../styles/token.scss', './token-card.component.scss']
})
export class TokenCardComponent {
  @Input() alwaysShowAttributes: boolean;
  @Input() close: boolean;
  @Input() isBound: boolean;
  @Input() noHover: boolean;
  @Input() token: TokenData;

  @Output() closeClicked = new EventEmitter();

  public zeroAddress = ethers.constants.AddressZero;
}
