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
import {LoginGuardGuard} from '../guard/login-guard.guard';

import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
     children: [
	    {
	      path: 'observation-data',
	      loadChildren: () => import('../pages/specialView/observation-data/observation-data.module').then( m => m.ObservationDataPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'prototype-chart',
	      loadChildren: () => import('../pages/specialView/prototype-chart/prototype-chart.module').then( m => m.PrototypeChartPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'd-section',
	      loadChildren: () => import('../pages/specialView/d-section/d-section.module').then( m => m.DSectionPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
        path: 'water-and-sed-change',
        loadChildren: () => import('../pages/specialView/water-and-sed-change/water-and-sed-change.module').then( m => m.WaterAndSedChangePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
        path: 'sand-weight',
        loadChildren: () => import('../pages/specialView/sand-weight/sand-weight.module').then( m => m.SandWeightPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
        path: 'cyhd',
        loadChildren: () => import('../pages/specialView/cyhd/cyhd.module').then( m => m.CyhdPageModule),
        canActivate:[LoginGuardGuard]
      },
       {
        path: '',
        redirectTo: '/tabs/tab3/observation-data',
        component: Tab3Page,
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
export class Tab3PageRoutingModule {}
