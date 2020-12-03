/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-30 13:25:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\kljp-line\kljp-line.page.ts
 */
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'
import { ProviderService } from '../../../service/provider.service'
import { AppConfig } from '../../../api.config'
import * as _ from 'lodash';
import * as moment from 'moment'
@Component({
  selector: 'app-kljp-line',
  templateUrl: './kljp-line.page.html',
  styleUrls: ['./kljp-line.page.scss'],
})
export class KljpLinePage implements OnInit {

  titles: any = '颗粒级配';
  nowDay: any;
  area='金沙江下游'
  river='长江'
  seleceList = [{
    'name': '悬移质',
    'value': '',
    'id': '1',
    'flag': true
  },
  {
    'name': '沙推移质',
    'value': '',
    'id': '2',
    'flag': false
  },
  {
    'name': '卵石推移质',
    'value': '',
    'id': '3',
    'flag': false
  }]

  station
  types = ['TZ']
  dateType = 'year'
  stationName
  selectedList = '悬移质'
  selectYear = ['2018']
  selectedMonth = ['1']
  years = []
  momths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  klInfo=[]
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public httpService: ProviderService,
  ) {
    this.station = [{
      stcd: "60104800",
      stnm: "朱沱(三)",
      stct: null,
      bshncd: null,
      hnnm: null,
      rvnm: "长江",
      obitmcd: null
	}]
	this.selectYear[0]= AppConfig.lastYear
    this.stationName = "朱沱(三)"
  }

  ngOnInit() {
    this.initYears()
    this.searchData()
  }

  changeSelect(name) {
    this.selectedList = name
    this.seleceList.forEach(function (item) {
      item.flag = false
      if (item.name == name) {
        item.flag = !item.flag

      }
    })
  }
  async selectSation() {

    const modal = await this.modalController.create({
      component: StationSelectComponent,
      cssClass: 'station_elect',
      componentProps: {
        types: this.types,
		typeLen: this.types.length,
		defaultArea:this.area,
		defaultRiver:this.river,
        defaultStation: this.station
      }
    })
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.station = data.selectStation
	this.area=data.selectarea
	this.river=data.selectriver
    this.stationName = _.map(data.selectStation, 'stnm').join(',')
  }
  initYears() {
	let year=parseInt(AppConfig.year)
    let nowYear=parseInt(AppConfig.lastYear)
    for (var i = 0; i < year; i++) {
      this.years.push({ "name": nowYear, "value": nowYear })

      nowYear--
    }
  }
  async monthChange(e){
    if(this.selectYear.length>1){
      const toast = await this.toastController.create({
        message: '条件错误，只能选择单年和多月数据或者多年单月数据套绘.',
        duration: 2000
      });
      toast.present();
      
      console.log(e)
      return false
    }
  }
  searchData(){
    var time;
    if(this.dateType=="year"){
      time=_.toString(this.selectYear);
    }else if(this.dateType=="month"){
      var y=this.selectYear;
      var m=this.selectedMonth;
      if(y.length>1&&m.length>1){
        alert("年月无法同时多选");
        return;
      }
      var t=[];
      if(y.length>1){
        for(var i=0;i<y.length;i++){
          t.push(y[i]+"-"+m[0]);
        }
      }else if(m.length>1){
        for(var i=0;i<m.length;i++){
          t.push(y[0]+"-"+m[i]);
        }
      }else{
        t.push(y[0]+"-"+m[0]);
      }
      time=_.toString(t);
    }
    let stcds=_.toString(_.map(this.station,'stcd'))
    let stcdnms=_.toString(_.map(this.station,'stnm'))
    let mulType = this.selectedList
    let param={
      'stcds' : stcds,
					'stationNames' : stcdnms,
					'time' :time,
					"type" : this.dateType,
					"mulType" : mulType
    }
    let chpdOption={
			title:{},
			tooltip : {
				trigger : 'axis',
				hideDelay:2000,
				formatter:function(params){
					var str="<div class='_ec_tolltip'>";
				
					var xValue = params[0].value[0];
					// str+="<div><span class='_ec_title icon-bullet_green'>百分比：</span><span class='_ec_value'>"+parseFloat(xValue).toFixed(3)+"</span></div>";
					
					for(var i = 0;i<params.length;i++){
						var name=_.replace(params[i].seriesName,'颗粒级配','')
						str+="<div><span class='_ec_title icon-bullet_yellow'>"+name+":</span><span class='_ec_value'>"+parseFloat(xValue).toFixed(3)+"mm -- "+params[i].value[1]+"%</span></div>";
					}
					
					str+="<div>";
					return str;
					
				}
			},
			grid : {
				top : 60,
				left:40,
				right:20,
				// left : 80,
				// right : 80,
				// bottom : 20,
				containLabel : true,
				
			},
			
			legend:{
				orient : "horizontal",
				type:'scroll',
				width:'80%',
				X:'center',
				// itemWidth:200,
				data:[]
			},
			xAxis : {
			
				// scale:true,
				name : "粒径级(mm)",
				type : 'log',
				// logBase:2,
				
				nameLocation:'middle',
				min:0.001,
				boundaryGap : false,
				splitLine:{
					show:false     //去掉网格线
				 },
				 axisLabel:{
					 show:false,
					 formatter:function(value,index){
						 return value.toFixed(3)
					 }
				 },
				
				data : [  ]
			},
			yAxis : {
				axisLine:{  
					// lineStyle:{  
					// 	color:'white',  
					// 	width:2  
					// }  
				},
				name : "颗粒小于某粒径百分比(%)",
				nameLocation:'middle',
				scale:true,
				axisLabel:{
					show:false,
					formatter:function(value,index){
						return value.toFixed(3)
					}
				},
				type : 'value'
			},
			series : [ {
				name : '水位(m)',
				
				data : [  ],
				type : 'line'
			}]
    }
     
    this.httpService.getKlJPData(param).then(res=>{
      let msg=JSON.parse(res)
      var series=[],klData=[],klName=[],legendData=[];
					for(var i in msg){
						if(msg[i].data&&msg[i].data.length>0){
							klName.push(msg[i].name)
						series.push(
							{
								name : msg[i].name,
								data : msg[i].data,
								itemStyle:msg[i].itemStyle,
								type : 'line',
								smooth : true,
								// label: {
								// 	normal: {
								// 		show: true,
								// 		position: 'top'
								// 	}
								// },
								markLine:{
									symbol:'none',
									precision:3,
									data:[
										{
											xAxis: 0.001,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:1
											},
											label:{
												position:'start'
											}
										},
										{
											xAxis: 0.002,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.003,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.004,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.005,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.006,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.007,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.008,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.009,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.01,
											lineStyle:{
												type:'solid',
												color:"#000"
											},
											label:{
												position:'start'
											}
										},
										{
											xAxis: 0.02,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.03,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.04,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.05,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.06,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.07,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.08,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.09,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.1,
											lineStyle:{
												type:'solid',
												color:"#000"
											},
											label:{
												position:'start'
											}
										},
										{
											xAxis: 0.2,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.3,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.4,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												show:false
											}
										},
										{
											xAxis: 0.5,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 0.6,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 0.7,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 0.8,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
											
												show:false
											}
										},
										{
											xAxis: 0.9,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 1,
											lineStyle:{
												type:'solid',
												color:"#000"
											},label:{
												position:'start'
											}
										},
										{
											xAxis: 2,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 3,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 4,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 5,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 6,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 7,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 8,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 9,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 10,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:1
											},
											label:{
												position:'start'
											}
										},{
											xAxis: 20,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 30,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 40,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 50,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 60,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 70,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 80,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 90,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 100,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:1
											},
											label:{
												position:'start'
											}
										},{
											xAxis: 200,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 300,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 400,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 500,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 600,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 700,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},
										{
											xAxis: 800,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 900,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:0.5
											},
											label:{
												
												show:false
											}
										},{
											xAxis: 1000,
											lineStyle:{
												type:'solid',
												color:"#000",
												width:1
											},
											label:{
												position:'start'
											}
										}
										
									]
								}
							}
						)
						}
						if(i.indexOf('chpd') !=-1){
							var mdpd=msg[i].mppdY?parseFloat(msg[i].mppdX).toFixed(2):''
							var avpd=msg[i].avpdY?parseFloat(msg[i].avpdY).toFixed(2):''
							var mxpd=msg[i].mxpdY?parseFloat(msg[i].mxpdX).toFixed(2):''
							let avpdX=msg[i].avpdX?msg[i].avpdX:''
							var obj={
								
								mdpd:mdpd+'mm D50 ',
								avpd:avpdX+'mm--D'+avpd,
								mxpd:mxpd+'mm Dmax'
							}
							klData.push(obj)
						
						}
						legendData.push(msg[i].name);


					}
					for(let i=0;i<klData.length;i++){
						klData[i]['title']=klName[i]
					}
          			this.klInfo=klData
					chpdOption.legend.data=klName
					
					chpdOption.xAxis.min=msg.minValue
					chpdOption.series=series
					if(chpdOption.series.length>0){
						this.initEchart(chpdOption)
					}else{
						this.chart.clear()
					}
					
    })
  }
  public chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('kljpchart');
    this.chart = ec.init(container);
    this.chart.clear()
    this.chart.setOption(option);
  }

}
