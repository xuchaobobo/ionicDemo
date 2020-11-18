import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-observation-data',
  templateUrl: './observation-data.page.html',
  styleUrls: ['./observation-data.page.scss'],
})
export class ObservationDataPage implements OnInit {
  public lists:any=[
    {
		title:'三峡水库运行与水文泥沙原型观测',
		menus:[
		{
			icon:'icon-shuiwenzhuanti',
			title:'水文泥沙原型',
			url:'/tabs/tab3/prototype-chart',
			name:'三峡水库蓄水以来坝前水位变化',
			startDate:'2003-06-14,2006-09-20,2008-10-10',
			endDate:'2006-09-20,2008-10-09,2018-12-31',
			stcd:'60107000',
		}
		]  
	},
	{
		title:'三峡水库上游来水来沙变化',
		menus:[
			{
				icon:'icon-shuiku',
				title:'三峡水库上游来水来沙变化',
				url:'/tabs/tab3/water-and-sed-change',
				name:'三峡水库上游来水来沙变化',
				msno:'2018-1,2018-2',
				endDate:'2006-09-20,2008-10-09,2018-12-31',
				xscds:'LFA03003011,LFA03003021',
			},{
				icon:'icon-shuiku',
				title:'三峡库区颗粒级配',
				url:'/tabs/tab3/sand-weight',
				name:'三峡库区颗粒级配',
				msno:'2018-1,2018-2',
				endDate:'2006-09-20,2008-10-09,2018-12-31',
				xscds:'LFA03003011,LFA03003021',
			}
		]
	},
	{
		title:'典型断面',
		menus:[
			{
			icon:'icon-shuiwenzhuanti',
			title:'典型断面',
			url:'/tabs/tab3/d-section',
			name:'典型断面',
			msno:'2018-1,2018-2',
			endDate:'2006-09-20,2008-10-09,2018-12-31',
			xscds:'LFA03003011,LFA03003021',
			
		}
		]
	}
	,
	{
		title:'坝下游河道水沙变化及河床冲刷',
		menus:[
			{
				icon:'icon-shuiku',
				title:'坝下游水沙变化',
				url:'/tabs/tab3/water-and-sed-change',
				name:'坝下游水沙变化',
				msno:'2018-1,2018-2',
				endDate:'2006-09-20,2008-10-09,2018-12-31',
				xscds:'LFA03003011,LFA03003021',
			}
			,{
				icon:'icon-shuiku',
				title:'长江中下游颗粒级配',
				url:'/tabs/tab3/sand-weight',
				name:'长江中下游颗粒级配',
				msno:'2018-1,2018-2',
				endDate:'2006-09-20,2008-10-09,2018-12-31',
				xscds:'LFA03003011,LFA03003021',
			}
		]
	}
	,
	{
		title:'冲淤厚度图',
		menus:[
			{
				icon:'icon-shuiku',
				title:'冲淤厚度图',
				url:'/tabs/tab3/cyhd',
				name:'冲淤厚度图',
				msno:'2018-1,2018-2',
				endDate:'2006-09-20,2008-10-09,2018-12-31',
				xscds:'LFA03003011,LFA03003021',
			}
		]
	}
  ];
  constructor(
	public router: Router,
	
  ) {

   }

  ngOnInit() {
  }
  navToDetail(menu){
	  let obj;
	if(menu.url=='/tabs/tab3/prototype-chart'){
	
		this.router.navigate([menu.url], {
			queryParams: {
				titleName: menu.name,
				param:JSON.stringify({
					stcd:menu.stcd,
					startDate:menu.startDate,
					endDate:menu.endDate
				})
			}
		  })
	}else if(menu.url=='/tabs/tab3/d-section'){
		
		this.router.navigate([menu.url], {
			queryParams: {
				titleName: menu.name,
				param:{
					xscds:menu.xscds,
					msno:menu.msno,
					endDate:menu.endDate
				}
			}
		  })
	}else if(menu.url=='/tabs/tab3/water-and-sed-change'){
		obj={
			dataUrl:'',
			dataUrl1:'',
			
		}
		if(menu.name=='坝下游水沙变化'){
			obj.dataUrl='yearFlowContrastChart'
			obj.dataUrl1='yearSandContrastChart'
		}else{
			obj.dataUrl='upstreamFlowContrastChart'
			obj.dataUrl1='upstreamSandContrastChart'
		}
		this.router.navigate([menu.url], {
			queryParams: {
				titleName: menu.name,
				dataUrl:obj.dataUrl,
				dataUrl1:obj.dataUrl1
			}
		  })
	}else if(menu.url=='/tabs/tab3/sand-weight'){
		
		let dataUrl=''
		if(menu.name=='三峡库区颗粒级配'){
			dataUrl='getGrainComposition'
		}else{
			dataUrl='getGrainCompositionZX'
		}
		this.router.navigate([menu.url], {
			queryParams: {
				titleName: menu.name,
				dataUrl:dataUrl,
			}
		  })
	}else if(menu.url=='/tabs/tab3/cyhd'){
		
	
		this.router.navigate([menu.url], {
			queryParams: {
				titleName: menu.name,
				
			}
		  })
	}
	
	
	
  }

}
