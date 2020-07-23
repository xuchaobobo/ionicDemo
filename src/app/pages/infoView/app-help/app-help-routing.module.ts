import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppHelpPage } from './app-help.page';

const routes: Routes = [
  {
    path: '',
    component: AppHelpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppHelpPageRoutingModule {}
