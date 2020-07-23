/*
 * @Author: your name
 * @Date: 2020-04-16 17:37:41
 * @LastEditTime: 2020-05-07 17:56:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\tab2\tab2-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab2Page } from './tab2.page';
import {LoginGuardGuard} from '../guard/login-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    //  redirectTo: '/tabs/tab3/guding-dm',
     children: [
	     {
	      path: 'data-search',
        loadChildren: () => import('../pages/dataSearchView/data-search/data-search.module').then( m => m.DataSearchPageModule),
        canActivate:[LoginGuardGuard]
      },
       {
	      path: 'hyd-info',
	      loadChildren: () => import('../pages/dataSearchView/hyd-info/hyd-info.module').then( m => m.HydInfoPageModule),
        canActivate:[LoginGuardGuard]
      },
       {
	      path: 'river-info',
	      loadChildren: () => import('../pages/dataSearchView/river-info/river-info.module').then( m => m.RiverInfoPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'process-line',
	      loadChildren: () => import('../pages/dataSearchView/process-line/process-line.module').then( m => m.ProcessLinePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'along-line',
	      loadChildren: () => import('../pages/dataSearchView/along-line/along-line.module').then( m => m.AlongLinePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'relative-line',
	      loadChildren: () => import('../pages/dataSearchView/relative-line/relative-line.module').then( m => m.RelativeLinePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'kljp-line',
	      loadChildren: () => import('../pages/dataSearchView/kljp-line/kljp-line.module').then( m => m.KljpLinePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'interannual-variation',
	      loadChildren: () => import('../pages/dataSearchView/interannual-variation/interannual-variation.module').then( m => m.InterannualVariationPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'cal-year-line',
	      loadChildren: () => import('../pages/dataSearchView/cal-year-line/cal-year-line.module').then( m => m.CalYearLinePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'ann-avg-line',
	      loadChildren: () => import('../pages/dataSearchView/ann-avg-line/ann-avg-line.module').then( m => m.AnnAvgLinePageModule),
        canActivate:[LoginGuardGuard]
      },
      
      {
	      path: 'ann-kl-line',
	      loadChildren: () => import('../pages/dataSearchView/ann-kl-line/ann-kl-line.module').then( m => m.AnnKlLinePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'zb-table',
	      loadChildren: () => import('../pages/dataSearchView/zb-table/zb-table.module').then( m => m.ZbTablePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'real-table',
	      loadChildren: () => import('../pages/dataSearchView/real-table/real-table.module').then( m => m.RealTablePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'guding-dm',
	      loadChildren: () => import('../pages/dataSearchView/guding-dm/guding-dm.module').then( m => m.GudingDmPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'da-dm',
	      loadChildren: () => import('../pages/dataSearchView/da-dm/da-dm.module').then( m => m.DaDmPageModule),
        canActivate:[LoginGuardGuard]
      },
       {
        path: '',
        redirectTo: '/tabs/tab2/data-search',
        component: Tab2Page,
        canActivate:[LoginGuardGuard]
	      //  loadChildren: () => import('../pages/my-info/my-info.module').then( m => m.MyInfoPageModule)
	    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[LoginGuardGuard]
})
export class Tab2PageRoutingModule {}
