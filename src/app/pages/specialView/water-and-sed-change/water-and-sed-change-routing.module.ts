import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaterAndSedChangePage } from './water-and-sed-change.page';

const routes: Routes = [
  {
    path: '',
    component: WaterAndSedChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaterAndSedChangePageRoutingModule {}
