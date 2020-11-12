import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPwdPageRoutingModule } from './edit-pwd-routing.module';

import { EditPwdPage } from './edit-pwd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPwdPageRoutingModule
  ],
  declarations: [EditPwdPage]
})
export class EditPwdPageModule {}
