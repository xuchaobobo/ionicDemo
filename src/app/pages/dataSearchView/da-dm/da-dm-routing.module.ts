import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaDmPage } from './da-dm.page';
import { SectionSelectComponent } from '../../../compontent/section-select/section-select.component'

const routes: Routes = [
  {
    path: '',
    component: DaDmPage
  }
];

@NgModule({
  entryComponents:[SectionSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaDmPageRoutingModule {}
