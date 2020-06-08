/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-18 16:02:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\file\file.module.ts
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilePageRoutingModule } from './file-routing.module';

import { FilePage } from './file.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'
import { TreeviewModule} from 'ngx-treeview';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUpModule } from './../../compontent/file-up/file-up.module'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx'
import { Zip } from '@ionic-native/zip/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    NgxDatatableModule,
    FileUpModule,
    TreeviewModule.forRoot(),
    FilePageRoutingModule,
    
  ],
  providers:[FileTransfer,File,FileChooser,FilePath,Zip],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [FilePage]
})
export class FilePageModule {}
