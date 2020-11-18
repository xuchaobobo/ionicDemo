import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CyhdPage } from './cyhd.page';

const routes: Routes = [
  {
    path: '',
    component: CyhdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CyhdPageRoutingModule {}
