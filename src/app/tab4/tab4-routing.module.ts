import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginGuardGuard} from '../guard/login-guard.guard';
import { Tab4Page } from './tab4.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4Page,
    redirectTo: '/tabs/tab4/kurong',
     children: [
	     {
	      path: 'kurong',
	      loadChildren: () => import('../pages/dataSearchView/kurong/kurong.module').then( m => m.KurongPageModule),
        canActivate:[LoginGuardGuard]
	    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[LoginGuardGuard]
})
export class Tab4PageRoutingModule {}
