/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-22 10:17:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\my-info\my-info.page.ts
 */
import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular'
import {Storage} from '@ionic/storage'
const TOKEN_KEY = 'auth-token'
@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.page.html',
  styleUrls: ['./my-info.page.scss'],
})
export class MyInfoPage implements OnInit {
	infoList: Object[];
	useName=''
  constructor(private storage:Storage,public navCtrl:NavController) {
	  console.log(this.storage.get(TOKEN_KEY))
	this.storage.get(TOKEN_KEY).then(res=>{
		  let json =res
		  this.useName=json.name
	  })
  	 this.infoList = [
  	 	// {
  	 	// 	'icon':'heart-outline',
  	 	// 	'text':'收藏站点',
  	 	// 	'url':'',
  	 	// 	'badgeFlag':true,
  	 	// 	'badge':5
  	 	// },
  	 	// {
  	 	// 	'icon':'notifications',
  	 	// 	'text':'系统公告',
  	 	// 	'url':'/tabs/tab5/notice',
  	 	// 	'badgeFlag':true,
  	 	// 	'badge':0
  	 	// },
  	 	{
  	 		'icon':'folder-open',
  	 		'text':'我的文件',
  	 		'url':'/tabs/tab5/file',
  	 		'badgeFlag':false,
  	 		'badge':5
  	 	},
  	 	// {
  	 	// 	'icon':'lock-open',
  	 	// 	'text':'安全设置',
  	 	// 	'url':'',
  	 	// 	'badgeFlag':false,
  	 	// 	'badge':0
		//    },
		   {
			'icon':'arrow-down-circle-outline',
			'text':'检查更新',
			'url':'',
			'badgeFlag':true,
			'badge':1
		},
  	 	{
  	 		'icon':'help-circle-outline',
  	 		'text':'系统帮助',
  	 		'url':'/tabs/tab5/app-help',
  	 		'badgeFlag':false,
  	 		'badge':0
  	 	},
  	 	// {
  	 	// 	'icon':'pencil-outline',
  	 	// 	'text':'反馈',
  	 	// 	'url':'',
  	 	// 	'badgeFlag':false,
  	 	// 	'badge':0
  	 	// },
  	 	{
  	 		'icon':'information-circle',
  	 		'text':'关于',
  	 		'url':'/tabs/tab5/about',
  	 		'badgeFlag':false,
  	 		'badge':0
  	 	},
  	 	{
  	 		'icon':'arrow-undo',
  	 		'text':'退出登录',
  	 		'url':'/login',
  	 		'badgeFlag':false,
  	 		'badge':0
  	 	},
  	 ]
  }
 
  ngOnInit() {
  }
  navToUrl(url){
	  if(url.indexOf('login')!=-1){
		  
		this.storage.set(TOKEN_KEY,'')
	  }
	this.navCtrl.navigateForward(url)
  }
}
