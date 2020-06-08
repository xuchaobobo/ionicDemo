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

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    //  redirectTo: '/tabs/tab3/guding-dm',
     children: [
	     {
	      path: 'data-search',
	      loadChildren: () => import('../pages/data-search/data-search.module').then( m => m.DataSearchPageModule)
      },
       {
	      path: 'hyd-info',
	      loadChildren: () => import('../pages/hyd-info/hyd-info.module').then( m => m.HydInfoPageModule)
      },
       {
	      path: 'river-info',
	      loadChildren: () => import('../pages/river-info/river-info.module').then( m => m.RiverInfoPageModule)
      },
      {
	      path: 'process-line',
	      loadChildren: () => import('../pages/process-line/process-line.module').then( m => m.ProcessLinePageModule)
      },
      {
	      path: 'along-line',
	      loadChildren: () => import('../pages/along-line/along-line.module').then( m => m.AlongLinePageModule)
      },
      {
	      path: 'relative-line',
	      loadChildren: () => import('../pages/relative-line/relative-line.module').then( m => m.RelativeLinePageModule)
      },
      {
	      path: 'kljp-line',
	      loadChildren: () => import('../pages/kljp-line/kljp-line.module').then( m => m.KljpLinePageModule)
      },
      {
	      path: 'interannual-variation',
	      loadChildren: () => import('../pages/interannual-variation/interannual-variation.module').then( m => m.InterannualVariationPageModule)
      },
      {
	      path: 'cal-year-line',
	      loadChildren: () => import('../pages/cal-year-line/cal-year-line.module').then( m => m.CalYearLinePageModule)
      },
      {
	      path: 'ann-avg-line',
	      loadChildren: () => import('../pages/ann-avg-line/ann-avg-line.module').then( m => m.AnnAvgLinePageModule)
      },
      
      {
	      path: 'ann-kl-line',
	      loadChildren: () => import('../pages/ann-kl-line/ann-kl-line.module').then( m => m.AnnKlLinePageModule)
      },
      {
	      path: 'zb-table',
	      loadChildren: () => import('../pages/zb-table/zb-table.module').then( m => m.ZbTablePageModule)
      },
      {
	      path: 'real-table',
	      loadChildren: () => import('../pages/real-table/real-table.module').then( m => m.RealTablePageModule)
      },
       {
        path: '',
        redirectTo: '/tabs/tab2/data-search',
        component: Tab2Page,
	      //  loadChildren: () => import('../pages/my-info/my-info.module').then( m => m.MyInfoPageModule)
	    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab2PageRoutingModule {}
