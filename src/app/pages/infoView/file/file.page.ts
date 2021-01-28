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
import { ProviderService} from '../../../service/provider.service'
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { FileUpComponent } from '../../../compontent/file-up/file-up.component'
import { AppConfig } from '../../../api.config';
import * as _ from 'lodash';
import * as $ from 'jquery'
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {Storage} from '@ionic/storage'
import { environment } from '../../../../environments/environment'
const TOKEN_KEY = 'auth-token'

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
  userJson
  httpurl
  titleToolbar={
    leftBtn:'用户目录',
    title:'文件管理',
    rightBtn:'操作',
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
    public storage:Storage,
    public toastController:ToastController,
    private fileOpener: FileOpener
  ) { 
    let url='swns/file/download.gaeaway'
    if(environment.production){
      this.httpurl=environment.baseUrl+'/'+url
    }else{
      this.httpurl=url
    }
    console.log(this.httpurl)
  }

  ngOnInit() {
    this.userJson={
      dep:AppConfig.dep,
      name:AppConfig.userName
    }
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
      this.titleToolbar.rightBtn='操作'
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
            
            let parse={
              dep:this.userJson.dep,
              userName:this.userJson.name,
              directory: dirPath, 
              name: data.dirname 
            }
            this.httpService.creatDir(parse).then(res=>{
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
    this.selectDir=dir.path
    if(this.titleToolbar.btnFlag){

    }else{
      if(dir.isDirectory===1){
        this.currentDir=dir.path
        this.getchildren(dir.path)
      }else{
        this.downLoadFile()
      }
    }
    
  }
  async addFile(){
    const modal = await this.modalController.create({
			component: FileUpComponent,
			cssClass: 'station_elect',
			componentProps: {
        currentDirectory: this.currentDir,
        dep:this.userJson.dep,
        userName:this.userJson.name,
			}
		})
		await modal.present();
    this.gitDir()
    // await alert.present();
  }
 async deleteDir(){
    
    let dirpath=_.filter(this.dirList,{path:this.selectDir})
    let parse={
      dep:this.userJson.dep,
      userName:this.userJson.name,
      files: JSON.stringify(dirpath)
    }
    this.httpService.deleteDir(parse).then(res=>{
      this.getchildren(this.currentDir)
    })
  
    
  }
 
  downLoadFile(){
    
    let dirpath=_.filter(this.dirList,{path:this.selectDir})
    let fileName=dirpath[0].name
    var param={
      dep:this.userJson.dep,
      userName:this.userJson.name,
      files:JSON.stringify(dirpath)
    }
    
    if(AppConfig.platform=='browser'){
      
      $("#files").val(JSON.stringify(dirpath));
		  $("#file-download-form").submit();
    }else{
      let targetDir=this.file.externalRootDirectory 
      this.httpService.getDownFile(param).then(res=>{
      
        this.file.writeFile(targetDir,fileName,res,{replace:true}).then(async data=>{
          this.fileOpener.showOpenWithDialog(targetDir+fileName, data.type)
          const toast = await this.toastController.create({
                  message: '下载成功',
                  duration: 2000,
                  position: 'middle',
                });
                toast.present();
          
        })
   
  
      }).catch(err=>{
        console.log(JSON.stringify(err))
      })
    }
    
  
    
  }
  gitDir(){
    let parse={
      dep:this.userJson.dep,
      userName:this.userJson.name
    }
    this.httpService.getDirTree(parse).then(res=>{
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
    let parse={
      dep:this.userJson.dep,
      userName:this.userJson.name,
      page: 1,
      limit: 10,
      directory: directory
    }
    this.httpService.getDirChildTree(parse).then(async res=>{
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
          if(curdirArr.length>3){
            this.titleToolbar.leftBtn='上一级'
          }else{
            if(this.currentDir.indexOf('share')!=-1){
              this.titleToolbar.leftBtn='共享目录'
            }else{
              this.titleToolbar.leftBtn='用户目录'
            }
            
          }
          const toast = await this.toastController.create({
               
                message: '此文件夹为空',
                duration: 2000,
                position: 'top',
                
              });
              toast.present();
              this.dirList=dirs
        }
        
      }
    })
  }
  segmentChanged(e){
    this.currentDir=e.detail.value
    this.getchildren(this.currentDir)
  }
}
