/*
 * @Author: your name
 * @Date: 2020-04-08 11:24:52
 * @LastEditTime: 2020-04-08 12:14:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\service\authetication.service.ts
 */
import {Platform,NavController,LoadingController,ToastController} from '@ionic/angular'
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import {Storage} from '@ionic/storage'
import { ProviderService } from '../service/provider.service'
import { AppConfig } from './../api.config';
import { Baseui } from '../common/baseui'
const TOKEN_KEY = 'auth-token'

@Injectable({
  providedIn: 'root'
})
export class AutheticationService extends Baseui  {
  authenticationState = new BehaviorSubject(false)
  tokenFlag:boolean=true
  constructor(
    private storage:Storage,
    private plt:Platform,
    public navCtrl:NavController,
    public loadingCtrl:LoadingController,
    public httpService:ProviderService,
    public toastController: ToastController
    ) {
    super()
    this.plt.ready().then(()=>{
      this.checkToken()
    })
   }
   login(json){
    super.show(this.loadingCtrl);
    this.storage.get(TOKEN_KEY).then(res=>{
       
      //  this.authenticationState.next(true)
      if(res&&res.name==json.name&&res.password!==json.password&&res.dep==json.dep){
        super.hide(this.loadingCtrl)
        super.showToast(this.toastController,'账号或密码错误')
      }else if(res&&res.name==json.name&&res.dep==json.dep&&res.password==json.password){
        super.hide(this.loadingCtrl)
        
        json.time=new Date().getTime()
        AppConfig.userName=res.name
        AppConfig.userId=res.id
        AppConfig.password=res.password
        this.storage.set(TOKEN_KEY,json)
        this.tokenFlag=true
        this.authenticationState.next(true)
        this.navCtrl.navigateForward('tabs')
      }else{
        this.httpService.login(json).then(res=>{
          
          res=JSON.parse(res)
          console.log(res)
          super.hide(this.loadingCtrl)
          if(res.code=='200'){
            let user=res.user
            AppConfig.userName=user.name
            AppConfig.userId=user.id
            AppConfig.password=user.password
            
            json.time=new Date().getTime()
            return this.storage.set(TOKEN_KEY,JSON.stringify(user)).then(
              res=>{
                this.authenticationState.next(true)
                this.navCtrl.navigateForward('tabs')
              }
            )
              
          }else{
            super.showToast(this.toastController,'账号或密码错误')
          }
          
         
        }).catch(async e=>{
            const toast =await this.toastController.create({
              message: '数据报错',
              duration: 2000
            })
            toast.present()
          });
      }
       
     }).catch(err=>{
      super.showToast(this.toastController,'账号或密码错误')
     })
   
   }
   isAuthentication(){
     if(this.checkToken()&&this.authenticationState.value){
      return true
     }else{
       return false
     }
   }
   loginOut(){
    return this.storage.remove(TOKEN_KEY).then(()=>{
      this.authenticationState.next(false)
    })
   }
   checkToken(){
    let timeNow=new Date().getTime()
    let that=this
    if(this.storage.get(TOKEN_KEY)){
      this.storage.get(TOKEN_KEY).then(res=>{
        let oldTime=res.time
        console.log(oldTime,timeNow)
        if((timeNow-oldTime)>1000*60*60*24){
          that.tokenFlag=false
        }else{
          that.tokenFlag=true
        }
      })
    }else{
      this.tokenFlag=false
    }
    return this.tokenFlag
   }
}
