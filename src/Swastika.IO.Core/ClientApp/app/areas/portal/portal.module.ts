import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortalComponent } from './portal.component';

import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PortalComponent,
        children: [
          {
             path: '',
             redirectTo: 'dashboard',
             pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadChildren: './modules/dashboard/dashboard.module#PortalDashboardModule',
          },
          {
            path: 'cms',
            loadChildren: './areas/cms/cms-portal.module#CmsPortalModule',
          },
          {
            path: 'messenger',
            loadChildren: './areas/messenger/messenger-portal.module#MessengerPortalModule',
          }
        ]
      },
    ])
  ],
  exports: [RouterModule],
  declarations: [
    PortalComponent,
    HeaderComponent
  ]
})

export class PortalModule { }   
