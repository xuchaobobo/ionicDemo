/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-16 17:41:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\tab3\tab3-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
    //  redirectTo: '/tabs/tab3/guding-dm',
     children: [
	     {
	      path: 'guding-dm',
	      loadChildren: () => import('../pages/guding-dm/guding-dm.module').then( m => m.GudingDmPageModule)
      },
      {
	      path: 'da-dm',
	      loadChildren: () => import('../pages/da-dm/da-dm.module').then( m => m.DaDmPageModule)
      },
       {
        path: '',
        redirectTo: '/tabs/tab3/guding-dm',
        component: Tab3Page,
	      //  loadChildren: () => import('../pages/my-info/my-info.module').then( m => m.MyInfoPageModule)
	    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
