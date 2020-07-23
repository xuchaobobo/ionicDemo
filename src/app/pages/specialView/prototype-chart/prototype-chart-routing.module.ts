import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrototypeChartPage } from './prototype-chart.page';

const routes: Routes = [
  {
    path: '',
    component: PrototypeChartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrototypeChartPageRoutingModule {}
