import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SandWeightPage } from './sand-weight.page';

const routes: Routes = [
  {
    path: '',
    component: SandWeightPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandWeightPageRoutingModule {}
