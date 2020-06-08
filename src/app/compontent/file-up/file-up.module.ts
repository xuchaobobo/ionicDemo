/*
 * @Author: your name
 * @Date: 2020-05-18 15:21:59
 * @LastEditTime: 2020-05-18 16:56:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\file-up\file-up.module.ts
 */ 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FileUpComponent } from './file-up.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {FileUploadModule} from 'ng2-file-upload'
// import{ FileTransfer } from '@ionic-native/file-transfer'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx'
@NgModule({
  declarations: [FileUpComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    FileUploadModule,
    NgxDatatableModule
  ],
  providers:[
    FileChooser,
    File,
    FilePath,
    FileTransfer
  ],
  exports:[FileUpComponent]
})
export class FileUpModule { }
