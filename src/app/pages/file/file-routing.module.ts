/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-18 16:01:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\file\file-routing.module.ts
 */ 
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUpComponent } from './../../compontent/file-up/file-up.component'
import { FilePage } from './file.page';

const routes: Routes = [
  {
    path: '',
    component: FilePage
  }
];

@NgModule({
  entryComponents:[FileUpComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilePageRoutingModule {}
