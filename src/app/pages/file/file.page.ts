/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-18 15:57:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\file\file.page.ts
 */
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import {AlertController,ToastController,ModalController} from '@ionic/angular'
import { ProviderService} from './../../service/provider.service'
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { FileUpComponent } from './../../compontent/file-up/file-up.component'
import { AppConfig } from '../../api.config';
import { Zip } from '@ionic-native/zip/ngx';
import * as _ from 'lodash';
import * as $ from 'jquery'
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { TreeModel } from 'ng2-tree';
// Import library



@Component({
  selector: 'app-file',
  templateUrl: './file.page.html',
  styleUrls: ['./file.page.scss'],
  
})
export class FilePage implements OnInit {
  
  titles:any='我的文件'
  values: any[];
  parentTree
  selectTree
  selectDir=''
  currentDir
  titleToolbar={
    leftBtn:'用户目录',
    title:'文件管理',
    rightBtn:'编辑',
    btnFlag:false
  }
  dirList = [
   
  ]
  items=[]
  constructor(
    public transfer:FileTransfer,
    public file:File,
    public modalController: ModalController,
    public httpService:ProviderService,
    private http: Http,
    public alertController: AlertController,
    private zip: Zip,
    public toastController:ToastController
  ) { 
    
  }

  ngOnInit() {
   
    this.gitDir()
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput);
  }
  

  handleInput(event) {
    this.items = Array.from(document.querySelector('ion-radio-group').children);
    const query = event.target.value.toLowerCase();
    console.log(this.items)
    requestAnimationFrame(() => {
      this.items.forEach(item => {
        console.log(item)
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }
  editChange(){
    if(this.titleToolbar.btnFlag){
      this.titleToolbar.rightBtn='编辑'
    }else{
      this.titleToolbar.rightBtn='取消'
    }
    this.titleToolbar.btnFlag=!this.titleToolbar.btnFlag
    
  }
  goBack(){
    
    let curdirArr=this.currentDir.split('\\')
    let index=_.toString(_.last(this.currentDir.split('\\')))

    let praserDir=_.remove(curdirArr, function(item) {
      return item!==index;
    })
    let str=_.join(praserDir,'\\')
    if(praserDir.length>2){
      this.getchildren(str)
    }else{
      if(this.currentDir.indexOf('share')!=-1){
        this.titleToolbar.leftBtn='共享目录'
      }else{
        this.titleToolbar.leftBtn='用户目录'
      }
      
    }
    
  }
  async addDir(){
    let dirPath=this.currentDir
    const alert = await this.alertController.create({
      header: '新建文件夹',
      inputs: [
        {
          name: 'dirname',
          type: 'text',
          placeholder: '文件名'
        },
       
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: '确定',
          handler: (data) => {
            console.log(data)
            this.httpService.creatDir(dirPath,data.dirname).then(res=>{
              if(JSON.parse(res).success){
                this.getchildren(dirPath)
              }
            })
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  dirClick(dir){
    if(this.titleToolbar.btnFlag){

    }else{
      if(dir.isDirectory===1){
        this.currentDir=dir.path
        this.getchildren(dir.path)
      }else{
        
      }
    }
    
  }
  async addFile(){
    let dirpath=_.filter(this.dirList,{path:this.selectDir})
    const modal = await this.modalController.create({
			component: FileUpComponent,
			cssClass: 'station_elect',
			componentProps: {
				currentDirectory: this.selectDir,
			}
		})
		await modal.present();

    // await alert.present();
  }
 async deleteDir(){
    
    let dirpath=_.filter(this.dirList,{path:this.selectDir})
    
    this.httpService.deleteDir(dirpath).then(res=>{
      this.getchildren(this.currentDir)
    })
  
    
  }
  downLoadFile(){
    let dirpath=_.filter(this.dirList,{path:this.selectDir})
    const fileTransfer: FileTransferObject = this.transfer.create();
    // const url = 'swns/file/download.gaeaway?files='+JSON.stringify(dirpath)
    const url = 'http://10.6.13.210:8200/share/shine.js'
    let downHeaders = new Headers({'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8','Authorization': AppConfig.token,'accept-encoding': 'gzip,deflate,sdch',
    'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6'})
   let downOptions= new RequestOptions({headers:downHeaders})
    let targetDir=this.file.externalRootDirectory 
    alert(targetDir)
    let headers = {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'accept-encoding': 'gzip,deflate,sdch',
      'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6'
    };
    // alert(targetDir)
      // const url = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590487530824&di=980961af5515a3723f31e3afdf4aa743&imgtype=0&src=http%3A%2F%2Fpic5.nipic.com%2F20100225%2F1399111_094253001130_2.jpg';
  fileTransfer.download(url, targetDir+ 'shine.js',false,downOptions).then((entry) => {
    alert('download complete: ' + entry.toURL());
    alert(JSON.stringify(entry));
  }, (error) => {
    alert(JSON.stringify(error));
    // handle error
  });
    

    
    let param={
      files:JSON.stringify(dirpath)
    }
//     var fileTransfer = new FileTransfer();
// var uri = encodeURI("http://some.server.com/download.php");

// fileTransfer.download(
//     uri,
//     fileURL,
//     function(entry) {
//         console.log("download complete: " + entry.toURL());
//     },
//     function(error) {
//         console.log("download error source " + error.source);
//         console.log("download error target " + error.target);
//         console.log("download error code" + error.code);
//     },
//     false,
//     {
//         headers: {
//             "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
//         }
//     }
// );
    // $("#files").val(JSON.stringify(dirpath));
		// $("#file-download-form").submit();
    // this.httpService.getDownFile(param).then(res=>{
    //   // var reader = new FileReader();
    //   console.log(JSON.stringify(res))
    //   let result = res
    //   // reader.readAsText(res);
    //   let blob = new Blob([res], {type: 'application/zip'});
    //   let objectUrl = URL.createObjectURL(blob);
    //   // reader.onloadend=function(e){
    //   // alert(JSON.stringify(e))
    //   // }
    //   this.zip.unzip(res, this.file.dataDirectory
    //       )
    //   .then((result) => {
    //     alert(JSON.stringify(result))
    //     // if(result === 0) console.log('SUCCESS');
    //     // if(result === -1) console.log('FAILED');
    //   });
    //   // alert(JSON.stringify(objectUrl))
      
    //   // fileTransfer.download(objectUrl, this.file.dataDirectory+'hosts.txt',true).then((entry) => {
    //   //   alert('download complete: ' + entry.toURL());
    //   // }, (error) => {
    //   //   alert(JSON.stringify(error))
          
    //   //   // handle error
    //   // });

    // }).catch(err=>{
    //   alert(JSON.stringify(err))
    // })
    // let options
    // let options: FileDownloadOptions = {
    //   headers: headers,
    // }
    
  }
  gitDir(){
    this.httpService.getDirTree().then(res=>{
      let data=JSON.parse(res)
      if(data.code==0){
        this.parentTree=data.data
        this.selectTree=data.data[1].id
        this.currentDir=data.data[1].id
        this.getchildren(data.data[1].id)
      }
      
    })
  }
  getchildren(directory){
    
    this.httpService.getDirChildTree(directory).then(async res=>{
      if(directory){

      }
      let msg=JSON.parse(res)
      if(msg.code==0){
        let curdirArr=directory.split('\\')
   
        let dirs=msg.data
        if(dirs.length>0){
           
        if(curdirArr.length>3){
          this.titleToolbar.leftBtn='上一级'
        }else{
          if(this.currentDir.indexOf('share')!=-1){
            this.titleToolbar.leftBtn='共享目录'
          }else{
            this.titleToolbar.leftBtn='用户目录'
          }
          
        }
          this.dirList=dirs
        }else{
          const toast = await this.toastController.create({
               
                message: '此文件夹为空',
                duration: 2000,
                position: 'top',
                
              });
              toast.present();
        }
        
      }
    })
  }
  segmentChanged(e){
    this.currentDir=e.detail.value
    this.getchildren(this.currentDir)
  }
}
