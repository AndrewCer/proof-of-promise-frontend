import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletSelectModalComponent } from 'src/app/shared/components/modals/wallet-select/wallet-select.modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateComponent } from './components/create/create.component';
import { HomeComponent } from './components/home/home.component';
import { SignComponent } from './components/sign/sign.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            // {
            //     path: 'promises',
            //     component: PromiseListComponent,
            // },
            {
                path: 'create',
                component: CreateComponent,
            },
            {
                path: 'sign',
                component: SignComponent,
            },
            {
                path: 'sign/:hash',
                component: SignComponent,
            },
        ]
    },
];

@NgModule({
    declarations: [
        SignComponent,
        CreateComponent,
        HomeComponent,
        WalletSelectModalComponent,
    ],
    imports: [
        SharedModule,

        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class HomeModule { }
