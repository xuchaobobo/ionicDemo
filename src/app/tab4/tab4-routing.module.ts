import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab4Page } from './tab4.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4Page,
    redirectTo: '/tabs/tab4/kurong',
     children: [
	     {
	      path: 'kurong',
	      loadChildren: () => import('../pages/kurong/kurong.module').then( m => m.KurongPageModule)
	    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4PageRoutingModule {}
