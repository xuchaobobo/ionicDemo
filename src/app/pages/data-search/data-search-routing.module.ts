import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataSearchPage } from './data-search.page';

const routes: Routes = [
  {
    path: '',
    component: DataSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataSearchPageRoutingModule {}
