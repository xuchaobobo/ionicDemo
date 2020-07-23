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
import { Baseui } from '../common/baseui'
const TOKEN_KEY = 'auth-token'

@Injectable({
  providedIn: 'root'
})
export class AutheticationService extends Baseui  {
  authenticationState = new BehaviorSubject(false)
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
        this.authenticationState.next(true)
        this.navCtrl.navigateForward('tabs')
      }else{
        this.httpService.login(json).then(res=>{
          console.log(res)
          super.hide(this.loadingCtrl)
          if(res=='success'){
            
            return this.storage.set(TOKEN_KEY,json).then(
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
     return this.authenticationState.value;
   }
   loginOut(){
    return this.storage.remove(TOKEN_KEY).then(()=>{
      this.authenticationState.next(false)
    })
   }
   checkToken(){
    return this.storage.get(TOKEN_KEY)
   }
}
