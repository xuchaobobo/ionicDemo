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
		title:'专题分析',
		menus:[
		{
			icon:'icon-shuiwenzhuanti',
			title:'水文泥沙原型',
			url:'/tabs/tab3/prototype-chart',
			name:'三峡水库蓄水以来坝前水位变化',
			startDate:'2003-06-14,2006-09-20,2008-10-10',
			endDate:'2006-09-20,2008-10-09,2018-12-31',
			stcd:'60107000',
			
		},
		{
			icon:'icon-shuiwenzhuanti',
			title:'典型断面',
			url:'/tabs/tab3/d-section',
			name:'典型断面',
			msno:'2018-1,2018-2',
			endDate:'2006-09-20,2008-10-09,2018-12-31',
			xscds:'LFA03003011,LFA03003021',
			
		},{
			icon:'icon-shuiku',
			title:'来水来沙变化',
			url:'/tabs/tab3/water-and-sed-change',
			name:'来水来沙变化',
			msno:'2018-1,2018-2',
			endDate:'2006-09-20,2008-10-09,2018-12-31',
			xscds:'LFA03003011,LFA03003021',
		},{
			icon:'icon-shuiku',
			title:'沙重',
			url:'/tabs/tab3/sand-weight',
			name:'沙重',
			msno:'2018-1,2018-2',
			endDate:'2006-09-20,2008-10-09,2018-12-31',
			xscds:'LFA03003011,LFA03003021',
		}
		// ,{
		// 	icon:'icon-shuiku',
		// 	title:'河段泥沙冲淤',
		// 	url:''
		// },{
		// 	icon:'icon-shuiku',
		// 	title:'坝区泥沙',
		// 	url:''
		// },{
		// 	icon:'icon-shuiku',
		// 	title:'水沙变化及河床冲刷',
		// 	url:''
		// }

		]  
	},
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
		obj={
			titleName:menu.name,
			param:{
				stcd:menu.stcd,
				startDate:menu.startDate,
				endDate:menu.endDate
			}
		}
	}else if(menu.url=='/tabs/tab3/d-section'){
		obj={
			titleName:menu.name,
			param:{
				xscds:menu.xscds,
				msno:menu.msno,
				endDate:menu.endDate
			}
		}
	}else if(menu.url=='/tabs/tab3/water-and-sed-change'){
		obj={
			titleName:menu.name,
			param:{
				xscds:menu.xscds,
				msno:menu.msno,
				endDate:menu.endDate
			}
		}
	}else if(menu.url=='/tabs/tab3/sand-weight'){
		obj={
			titleName:menu.name,
			param:{
				xscds:menu.xscds,
				msno:menu.msno,
				endDate:menu.endDate
			}
		}
	}
	this.router.navigate([menu.url], {
        queryParams: {
          object: JSON.stringify(obj)
        }
      })
	
	
  }

}
