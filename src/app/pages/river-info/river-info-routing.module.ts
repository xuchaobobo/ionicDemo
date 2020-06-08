import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiverInfoPage } from './river-info.page';

const routes: Routes = [
  {
    path: '',
    component: RiverInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiverInfoPageRoutingModule {}
