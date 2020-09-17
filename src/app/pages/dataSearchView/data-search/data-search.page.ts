/*
 * @Author: your name
 * @Date: 2020-04-16 17:32:16
 * @LastEditTime: 2020-04-22 10:04:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\data-search\data-search.page.ts
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.page.html',
  styleUrls: ['./data-search.page.scss'],
})
export class DataSearchPage implements OnInit {

  public lists:any;
  constructor() {
	this.lists=[
		{
		  title:'实时数据查询',
		  menus:[
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
		  menus:[
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
		  menus:[
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
		  menus:[
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

  }
  goToDetail(url){
  	console.log(url)
  }

}
