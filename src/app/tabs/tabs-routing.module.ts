import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {LoginGuardGuard} from '../guard/login-guard.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
           
          }
        ],
         canActivate:[LoginGuardGuard]
      },
      {
        path: 'tab2',
      
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule),
            
          }
        ],
        canActivate:[LoginGuardGuard]
      },
      {
        path: 'tab3',
       
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule),
           
          }
        ],
        canActivate:[LoginGuardGuard]
      },{
        path: 'tab4',
        
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab4/tab4.module').then(m => m.Tab4PageModule),
          }
        ],
        canActivate:[LoginGuardGuard]
      },  {
        path: 'tab5',
        
        children: [
          {
            path: '',
            
            loadChildren: () =>
              import('../tab5/tab5.module').then(m => m.Tab5PageModule),
          }
        ],
        canActivate:[LoginGuardGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/tab2/data-search',
        pathMatch: 'full',
        canActivate:[LoginGuardGuard]
      }
    ]
  },

  {
    path: '',
    redirectTo: '/tabs/tab2',
    pathMatch: 'full',
    canActivate:[LoginGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[LoginGuardGuard]
})
export class TabsPageRoutingModule {}
