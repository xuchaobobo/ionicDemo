/*
 * @Author: your name
 * @Date: 2020-04-16 17:32:16
 * @LastEditTime: 2020-04-22 10:04:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\data-search\data-search.page.ts
 */
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/api.config';
import { ProviderService } from '../../../service/provider.service'

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.page.html',
  styleUrls: ['./data-search.page.scss'],
})
export class DataSearchPage implements OnInit {

  public lists:any;
  constructor( public httpService: ProviderService,) {
	this.lists=[
		{
		  title:'实时数据查询',
		  children:[
			{
			  icon:'icon-shuiwenzhuanti',
			  title:'水文信息',
			  url:'/tabs/tab2/hyd-info'
			},{
			  icon:'icon-shuiku',
			  title:'水库信息',
			  url:'/tabs/tab2/river-info'
			}
		  ]  
		},
		{
		  title:'整编数据查询',
		  children:[
			{
			  icon:'icon-guochengfenxi',
			  title:'过程线',
			  url:'/tabs/tab2/process-line'
			},{
			  icon:'icon-zhandianshujutongji',
			  title:'沿程线',
			  url:'/tabs/tab2/along-line'
			},{
			  icon:'icon-guanxi',
			  title:'关系线',
			  url:'/tabs/tab2/relative-line'
			},{
			  icon:'icon-shachen',
			  title:'颗粒级配',
			  url:'/tabs/tab2/kljp-line'
			},{
			  icon:'icon-table',
			  title:'整编表查询',
			  url:'/tabs/tab2/zb-table'
			  },{
				icon:'icon-RectangleCopy',
				title:'实测表查询',
				url:'/tabs/tab2/real-table'
				}
		  ]  
		},
		{
		  title:'年际变化分析',
		  children:[
			{
			  icon:'icon-nianbianhua',
			  title:'年际变化',
			  url:'/tabs/tab2/interannual-variation'
			},{
			  icon:'icon-nianhualishuai',
			  title:'历年过程线',
			  url:'/tabs/tab2/cal-year-line'
			},{
			  icon:'icon-linianzhenti',
			  title:'多年平均年内分配',
			  url:'/tabs/tab2/ann-avg-line'
			},{
			  icon:'icon-sheji',
			  title:'多年颗粒级配',
			  url:'/tabs/tab2/ann-kl-line'
			}
		  ]  
		},
		{
		  title:'断面分析',
		  children:[
			{
			  icon:'icon-biaozhunhengduanmian',
			  title:'固断分析',
			  url:'/tabs/tab2/guding-dm'
			},
			{
			  icon:'icon-bianpoduanmianpipei',
			  title:'大断面分析',
			  url:'/tabs/tab2/da-dm'
			}
		  ]  
		},
		//  {
		//   title:'库容分析',
		//   menus:[
		// 	{
		// 	  icon:'icon-kurong',
		// 	  title:'库容分析',
		// 	  url:'/tabs/tab4/kurong'
		// 	}
		//   ]  
		// },
		]
  }
  ngOnInit(){
	  this.getResource()
	this.getyearData()
	this.getdataYear()
  }
  getResource(){
	this.httpService.getResource().then(res=>{
	
		let json=JSON.parse(res)
		this.lists=json[0].children
	})
  }
  getyearData(){
	let id=AppConfig.userId
	this.httpService.getyearByid(id).then(res=>{
		let json=JSON.parse(res)[0]
		AppConfig.year=json.year
		AppConfig.systemCode=json.systemCode
		AppConfig.type=json.type
	
	})
  }
  getdataYear(){
	this.httpService.getLastYear().then(res=>{
		let json=JSON.parse(res)
		AppConfig.lastYear=json.year
		AppConfig.defaultStcd=json.defaultStcd
		// AppConfig.type=json.type
	
	})
  }
  goToDetail(url){
  	console.log(url)
  }

}
