import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservationDataPage } from './observation-data.page';

const routes: Routes = [
  {
    path: '',
    component: ObservationDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationDataPageRoutingModule {}
