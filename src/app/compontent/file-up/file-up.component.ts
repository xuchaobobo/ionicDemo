/*
 * @Author: your name
 * @Date: 2020-05-18 15:21:34
 * @LastEditTime: 2020-05-18 17:04:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\file-up\file-up.component.ts
 */ 
import { Component, OnInit,ChangeDetectorRef,Input,ViewChild,ElementRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, LoadingController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ProviderService } from './../../service/provider.service'
import { File,Entry,FileEntry} from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx'
import { FileUploader,FileItem,ParsedResponseHeaders } from 'ng2-file-upload';
import {ModalController} from "@ionic/angular"
import {AppConfig} from './../../api.config'
import { environment } from './../../../environments/environment'

import 'rxjs'
import * as _ from 'lodash';
@Component({
  selector: 'app-file-up',
  templateUrl: './file-up.component.html',
  styleUrls: ['./file-up.component.scss'],
})
export class FileUpComponent implements OnInit {
  @Input() currentDirectory:any
  @Input() dep:any
  @Input() userName:any
//   @ViewChild('firstInput', {read: MdInputDirective })
// firstInput: MdInputDirective;
@ViewChild('fileUpload',null)
fileUpload: ElementRef;
uploader
curDir=''
fileSelect(): any{
  this.fileUpload.nativeElement.click();
}
fileAllUp(): any{
  this.uploader.uploadAll();
}
fileAllCancel(): any{
  this.uploader.cancelAll();
}
fileAllDelete(): any{
  this.uploader.clearQueue();
}

selectedFileOnChanged(event) {
  // 这里是文件选择完成后的操作处理
}
getPhone(currentDirectory:HTMLInputElement){
  // return currentDirectory.value
  }
buildItemForm(fileItem: FileItem, form: any): any{
  console.log(fileItem)
  console.log( AppConfig.currentDirectory)
  // console.log(FileUpComponent.curDir)
  // let currentDirectory=
  // console.log(currentDirectory.value)
  // document.getElementById('currentDirectory').v()
  form.append("currentDirectory",  AppConfig.currentDirectory);
  form.append("dep",  AppConfig.dep);
  form.append("userName",  AppConfig.userName);
  if(!!fileItem["realFileName"]){
    form.append("file",fileItem["realFileName"]);;
  }
}

afterAddFile(fileItem: FileItem): any{

  fileItem.withCredentials = false; 
  
  console.log(fileItem)
}
changeFileName(value: any, fileItem: FileItem){
  fileItem["realFileName"] = value.target.value;
}
successItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders):any{
  // 上传文件成功  
  if (status == 200) {
    // 上传文件后获取服务器返回的数据
    let tempRes = JSON.parse(response);        
  }else {            
    // 上传文件后获取服务器返回的数据错误        
  }
  console.info(response+" for "+item.file.name + " status " + status);
}
  rows=[]
  message={
    emptyMessage: '无数据',

    // Footer total message
    totalMessage: '共',
  
    // Footer selected message
    selectedMessage: 'selected'
  }
  cacheData;
  filePathStr
  fileArr=[]
  nativepath=[]
  constructor(
    public httpServer:ProviderService,
    public modal:ModalController,
    public transfer:FileTransfer,
    public file:File,
    public filePath:FilePath,
    public platform:Platform,
    private fileChooser:FileChooser,
    private cd:ChangeDetectorRef
    ) {
      // this.curDir=this.currentDirectory
      
     }

  ngOnInit() {
    AppConfig.currentDirectory=this.currentDirectory
    AppConfig.userName=this.userName
    AppConfig.dep=this.dep
    let httpurl;
    let url="swns/file/upFiles.gaeaway"
    if(environment.production){
      httpurl=environment.baseUrl+'/'+url
    }else{
      httpurl=url
    }
    this.uploader = new FileUploader({    
      url: httpurl,  
      method: "POST",    
      // itemAlias: "files",
      headers:[
        {name:"Authorization",value:AppConfig.token}],
      // authTokenHeader:AppConfig.token,
      authTokenHeader:  'authorization',
      authToken: this.curDir,
      autoUpload: false
    });
    this.uploader.onBuildItemForm = this.buildItemForm;
   
    this.uploader.onAfterAddingFile = this.afterAddFile
    this.uploader.onSuccessItem = this.successItem.bind(this);
  }
  closeFile(){
    this.modal.dismiss()
  }
 
 
  // fileSelect(){
    
  //   this.fileChooser.open()
  //   .then(uri => {
  //     // uri 文件的路径
  //     // this.readFileBuffer(uri)
  //     // this.readFlile()
      
  //     (<any>window).FilePath.resolveNativePath(uri, (result) => {
  //       this.filePathStr=result
  //      alert(result)
  //       this.readimage()
  //     })
      
  //     // this.file.readAsText(uri, 'file').then(result=>{
  //     //   alert(result)
  //     // })   
  //     // this.filePath.resolveNativePath(uri)
  //     // .then((filePath) => {
  //     //       this.file.readAsText(filePath, 'file').then(result=>{
  //     //         alert(result)
  //     //       })                
  //     //   })
  //     // alert(uri)
  //   })
  //   .catch(e => console.log(e));
  // }
  readimage() {
    // this.file.resolveLocalFilesystemUrl(this.filePathStr).then(entry=>{
      
    // })
    (<any>window).resolveLocalFileSystemURL(this.filePathStr, (res) => {
      let path = res.toURL();
      res.file((resFile) => {
        alert(JSON.stringify(resFile))
        resFile.status=0
        resFile.url=this.filePathStr
        this.rows=[...this.rows,resFile]
        this.nativepath=[...this.nativepath,{type:resFile.type,url:this.filePathStr}]
        
        this.cd.detectChanges();
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          alert(JSON.stringify(evt.target.result))
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg'});
          // 对图片操作的 业务代码
        }
        // var reader = new FileReader();

        // reader.onloadend = function(e) {
        //     console.log("Successful file read: " + e.target.result);
        //     alert(JSON.stringify(e.target.result))
        //     let the_file = new Blob([e.target.result ], { type: resFile.type } )
        //     return {blob:the_file,name:res.name}
        //     // displayFileData(fileEntry.fullPath + ": " + this.result);
        // };

        // reader.readAsArrayBuffer(resFile)
    //  reader.addEventListener("loadend", function(e) {
    //     // reader.result 包含转化为类型数组的blob
    //     alert(e.target.result)
    //     let the_file = new Blob([e.target.result ], { type: resFile.type } )
    //     return {blob:the_file,name:res.name}
    //   });
    //   reader.readAsArrayBuffer(path)
        
      })
    })
  }
  readFileBuffer(fileFullName:string,type:string):Promise<any>{
    return this.file.resolveLocalFilesystemUrl(fileFullName).then(entry=>{
     
      let path = entry.toURL();
      // alert(JSON.stringify(entry))
      let index = path.indexOf(entry.name)
      path = path.substring(0,index-1)
       alert(JSON.stringify(path))
       alert(JSON.stringify(entry.name))
      return this.file.readAsArrayBuffer(path,entry.name).then(buffer=>{
        alert(buffer)
        let imgBlob = new Blob([buffer], { type: type});
        return {blob:imgBlob,name:entry.name}
      })
    })
  }
  fileUpLoad(){
    let observables:any[]=[]
    
    this.cacheData=[]
    this.nativepath.forEach(item=>{
      if(!item.url.startsWith('file://')){
        item.url='file://'+item.url
        
      }
      let observable = this.readFileBuffer(item.url,item.type)
      .then(buff=>{
        this.cacheData.push(buff)
        return buff
      })
      observables.push(observable)
    })
   return Promise.all(observables).then(res=>{
     observables=[]
     let currentDirectory=this.currentDirectory
     
     this.cacheData.forEach(item=>{

      let formData=new FormData();
      formData.append("file",item.blob,item.name)
      formData.append("currentDirectory", currentDirectory);

      alert(JSON.stringify(formData))
      let observable=this.httpServer.upLoadFile(formData)
      observables.push(observable)
     });
     
     return Promise.all(observables)
   })
    
    }
  deleteData(row){
    alert(JSON.stringify(row))
    this.rows=_.pull(this.rows,row)
    
    this.nativepath=_.filter(this.nativepath,function(item){
      return item.url!=row.url
    })
    alert(JSON.stringify(this.nativepath))
    this.cd.detectChanges();
  }
}
