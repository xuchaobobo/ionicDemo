import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPwdPage } from './edit-pwd.page';

const routes: Routes = [
  {
    path: '',
    component: EditPwdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPwdPageRoutingModule {}
