import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DSectionPage } from './d-section.page';

const routes: Routes = [
  {
    path: '',
    component: DSectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DSectionPageRoutingModule {}
