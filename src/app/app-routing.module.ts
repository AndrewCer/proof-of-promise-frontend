import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layout-components/layout/content-layout/content-layout.component';
import { FullLayoutComponent } from './shared/layout-components/layout/full-layout/full-layout.component';
import { content } from './shared/routes/routes';

const routes: Routes = [
  // Vertical layout
  {
    path: '',
    component: ContentLayoutComponent,
    children: content
  },
  {
    path: '',
    component: FullLayoutComponent,
  },
  {
    path: '',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
  },
  // {
  //   path: '**',
  //   redirectTo: '/error-pages/error-404'
  // },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
