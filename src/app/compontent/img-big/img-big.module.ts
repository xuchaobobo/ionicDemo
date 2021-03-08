/*
 * @Descripttion: 
 * @version: 
 * @Author: xcb
 * @Date: 2021-03-08 14:58:08
 * @LastEditors: xcb
 * @LastEditTime: 2021-03-08 15:28:36
 */
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {ImgBigComponent} from './img-big.component'


@NgModule({
  declarations: [ImgBigComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports:[ImgBigComponent]
})
export class ImgBigModule { }
