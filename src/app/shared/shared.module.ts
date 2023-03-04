import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

import { ConnectWalletComponent } from './components/connect-wallet/connect-wallet.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SnackBarTxnNotifyComponent } from './components/snack-bars/txn-notify/snack-bar-txn-notify.component';
import { TokenCardComponent } from './components/token-card/token-card.component';
import { TokenDetailComponent } from './components/token-detail/token-detail.component';

import { FullscreenDirective } from './directives/fullscreen-toggle.directive';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { SidemenuToggleDirective } from './directives/sidemenuToggle';
import { ToggleThemeDirective } from './directives/toggle-theme.directive';

import { FooterComponent } from './layout-components/footer/footer.component';
import { HeaderComponent } from './layout-components/header/header.component';
import { ContentLayoutComponent } from './layout-components/layout/content-layout/content-layout.component';
import { FullLayoutComponent } from './layout-components/layout/full-layout/full-layout.component';
import { LoaderComponent } from './layout-components/loader/loader.component';

import { ShortDomainPipe } from './pipes/short-domain.pipe';
import { TruncateAddressPipe } from './pipes/truncate-address.pipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

const components: any[] = [
  HeaderComponent,
  FooterComponent,
  LoaderComponent,
  ContentLayoutComponent,
  FileUploadComponent,
  FullLayoutComponent,
  TokenCardComponent,
  TokenDetailComponent,

  ConnectWalletComponent,
  SnackBarTxnNotifyComponent,
];

const directives: any[] = [
  FullscreenDirective,
  HoverEffectSidebarDirective,
  ToggleThemeDirective,
  SidemenuToggleDirective,
];

const pipes: any[] = [
  ShortDomainPipe,
  TruncateAddressPipe
];
const modules = [
  CommonModule,
  FormsModule,
  // MaterialModule,
  NgbModule,
  PdfViewerModule,
  PerfectScrollbarModule,
  ReactiveFormsModule,
  RouterModule,
  LazyLoadImageModule,
  NgSelectModule,
];
const matModules = [
  A11yModule,
  ClipboardModule,
  // MatAutocompleteModule,
  // MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  // MatCardModule,
  // MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  // MatDividerModule,
  // MatExpansionModule,
  // MatFormFieldModule,
  MatIconModule,
  MatMenuModule,
  // MatListModule,
  // MatInputModule,
  // MatProgressBarModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  // MatRadioModule,
  // MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  // MatTabsModule,
  // MatToolbarModule,
  MatTooltipModule,
]


@NgModule({
  declarations: [
    ...components,
    ...directives,
    ...pipes,
  ],
  imports: [
    ...modules,
    ...matModules
  ],
  exports: [
    ...components,
    ...directives,
    ...pipes,
    ...modules,
    ...matModules
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
