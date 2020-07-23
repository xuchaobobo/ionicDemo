import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KurongPage } from './kurong.page';

const routes: Routes = [
  {
    path: '',
    component: KurongPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KurongPageRoutingModule {}
