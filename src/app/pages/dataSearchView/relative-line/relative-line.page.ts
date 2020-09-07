/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-30 10:19:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\relative-line\relative-line.page.ts
 */
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'
import { ProviderService } from '../../../service/provider.service'
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-relative-line',
  templateUrl: './relative-line.page.html',
  styleUrls: ['./relative-line.page.scss'],
})
export class RelativeLinePage implements OnInit {

  titles:any='关系线';
  area='三峡库区'
  	river='长江'
  seleceList:any=[
    {
      'name':'水位流量',
      'id':'1',
      'flag':true
    },
    {
      'name':'流量含沙量',
      'id':'2',
      'flag':false
    },
    {
      'name':'流量输沙率',
      'id':'3',
      'flag':false
    },
    
]
station
types= ['Z']
stationName
selectedList='1'
selectYear=['2018']
years=[]
dataType='2'
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
		this.stationName = "朱沱(三)"
   }

  ngOnInit() {
    this.initYears()
    this.searchData()
  	
  }
  changeSelect(id){
    this.selectedList=id
    this.seleceList.forEach(function(item){
      item.flag=false
        if(item.id==id){
            item.flag=!item.flag
            
        }
    })
  }
  async selectSation() {

		const modal = await this.modalController.create({
			component: StationSelectComponent,
			cssClass: 'station_elect',
			componentProps: {
				types: this.types,
        typeLen: 2,
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
  initYears(){
    let nowYear=new Date().getFullYear()-1
    for(var i=0;i<50;i++){
			this.years.push({"name":nowYear,"value":nowYear})
		
			nowYear--
		}
  }
  chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('relativeInfochart');
    this.chart = ec.init(container);
    this.chart.clear()
    this.chart.setOption(option);
  }
 async searchData(){
   let type=this.dataType
  let  param={
    'stcds' : _.toString(_.map(this.station,'stcd')),
    'yrs':_.toString(this.selectYear),
    'type':type
  }
  let url;
    if(this.station.length>1&&this.selectYear.length>1){
      const toast = await this.toastController.create({
        message: '条件错误，只能选择单个站点和多年数据或者多个站点单年数据套绘.',
        duration: 2000
      });
      toast.present();
      return false
    }else{
      let title,xAxisName,yAxisName;
      if( this.selectedList=='1'){
        url='swns/stsc/obq/selectWaterFlow.gaeaway'
        title='水位-流量'
        xAxisName='流量(m³/s)'
        yAxisName='水位(m)'
      }else if(this.selectedList=='2'){
        url='swns/stsc/obqs/selectFlowSandy.gaeaway'
        title='流量-含沙量'
        xAxisName='流量(m³/s)'
        yAxisName='含沙量(kg/m³)'
      }else{
        url='swns/stsc/obqs/selectFlowSendSandy.gaeaway'
        title='流量-输沙率'
        xAxisName='流量(m³/s)'
        yAxisName='输沙率(kg/s)'
      }
      this.httpService.getRelativeData(url,param).then(async res=>{
        var msg=JSON.parse(res)
        var option={
          title: {
            text: title,
            x:'center'
          },
          tooltip: {
            // trigger:'axis',
            // triggerOn: 'none',
            triggerOn:"mousemove", 
            formatter: function (params) {
            
              return '开始时间: ' + params.data[2] + '<br>截止时间: ' + params.data[3]+'<br>流量: ' + params.data[0].toFixed(2) + '<br>水位: ' + params.data[1].toFixed(2);
            }
          },
          legend:{
            orient:"horizontal",
            x:'center',
            y:20,
            data:[]
          },
          grid: {
            // top : 60,
            // left : 10,
            // right : 80,
            // bottom : 20,
            containLabel : true,
          },
          xAxis: {
            name:xAxisName,
            scale:true,
            type: 'value',
            minInterval: 0.01,
            nameLocation:'middle',
          nameTextStyle:{
            lineHeight:60
          },
            axisLine: {onZero: false}
          },
          yAxis: {
            name:yAxisName,
            scale:true,
            type: 'value',
            axisLine: {onZero: false}
          },
        
          series: []
        }
        let name=_.toString(_.map(this.station,'stnm'));
        if(this.selectedList=='1'){
          if(type!='0'&&this.seleceList.length==1&&this.station.length>1){
            var list=msg;
            var series=[]
           
            if(type=='1'){
              _.forEach(list,function(val,i){
                var arr=[]
                for(var j=0;j<val.length;j++){
                  var start=moment(val[j].MSQBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(val[j].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
                  
                  arr.push([val[j].Q,val[j].BSGGZ,start,end])
                }
                var seriesdata={
                  name:name,
                  type: 'scatter',
                  // symbol: 'none',
                  symbolSize: 3,
                  smooth: true,
                  // symbol: 'none',
                  // symbolSize: 5,
                  data:arr
                }
                series.push(seriesdata)
              })
            }else{
              _.forEach(list,function(val,i){
                var arr=[]
                for(var j=0;j<val.length;j++){
                  var start=moment(val[j].DT).format("yyyy-MM-dd hh:mm:ss"),end=''
                  arr.push([val[j].AVQ,val[j].AVZ,start,end])
                }
                var seriesdata={
                  name:name,
                  type: 'scatter',
                  // symbol: 'none',
                  symbolSize: 3,
                  smooth: true,
                  // symbol: 'none',
                  // symbolSize: 5,
                  data:arr
                }
                series.push(seriesdata)
              })
            }
            option.series=series
          
            option.legend.data=_.map(this.station,'stnm')
          }else if(type!='0'&&this.selectYear.length>1&&this.station.length==1){
           
  
            var list=msg;
            var series=[]
            if(type=='1'){
              _.forEach(list,function(val,i){
                
                var arr=[]
                for(var j=0;j<val.length;j++){
                  var start=moment(val[j].MSQBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(val[j].MSQEDTM).format("yyyy-MM-dd hh:mm:ss")
                  
                  arr.push([val[j].Q,val[j].BSGGZ,start,end])
                }
                var seriesdata={
                  name:i,
                  type: 'scatter',
                  // symbol: 'none',
                  symbolSize: 3,
                  smooth: true,
                  // symbol: 'none',
                  // symbolSize: 5,
                  data:arr
                }
                series.push(seriesdata)
              })
            }else{
              _.forEach(list,function(val,i){
                var arr=[]
                for(var j=0;j<val.length;j++){
                  var start=moment(val[j].DT).format("YYY-MM-DD hh:mm:ss"),end=''
                  arr.push([val[j].AVQ,val[j].AVZ,start,end])
                }
                var seriesdata={
                  name:i,
                  type: 'scatter',
                  // symbol: 'none',
                  symbolSize: 3,
                  smooth: true,
                  // symbol: 'none',
                  // symbolSize: 5,
                  data:arr
                }
                series.push(seriesdata)
              })
            }
            
            option.series=series
         
            option.legend.data=this.selectYear
            
          } else if(type!='0'&&this.selectYear.length==1&&this.station.length==1){
            var list=msg.list;
            var serdata=[],realSer=[];
            var series=[];
            var seriesdata={
              name:'',
              type: 'scatter',
                  // symbol: 'none',
                  symbolSize: 3,
              smooth: true,
              // symbol: 'none',
              // symbolSize: 5,
              data:[]
            }
            if(type=='1'){
  
              for(var i=0;i<list.length;i++){
                var start=moment(list[i].MSQBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(list[i].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
                serdata.push([list[i].Q,list[i].BSGGZ,start,end])
              }
              seriesdata.data=serdata;
              seriesdata.name='实测数据';
              series.push(seriesdata)
            }else{
              
              for(var i=0;i<list.length;i++){
                var start=moment(list[i].DT).format("yyyy-MM-dd hh:mm:ss"),end=''
                realSer.push([list[i].AVQ,list[i].AVZ,start,end])
              }
              seriesdata.data=realSer;
              seriesdata.name='整编数据';
              series.push(seriesdata)
            }
            option.series=series
            
            option.legend.data=[]
            
          
         
        }else {
          const toast = await this.toastController.create({
            message: '条件错误，只能选择单个站点和多年数据或者多个站点单年数据套绘.',
            duration: 2000
          });
          toast.present();
        }
        }else if(this.selectedList=='2'){
          if(type!='0'&&this.selectYear.length==1&&this.station.length>1){
						var list=msg;
						var series=[]
						if(type=='1'){
							_.forEach(list,function(val,i){
								
								
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].MSQBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(val[j].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
									
									arr.push([val[j].Q,val[j].XSAVCS,start,end])
								}
								var seriesdata={
									name:name,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}else{
							_.forEach(list,function(val,i){
								
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].DT).format("YYYY-MM-DD hh:mm:ss"),end=''
                  arr.push([val[j].AVQ,val[j].AVCS,start,end])
								}
								var seriesdata={
									name:name,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}
						option.series=series
						option.title.text='水位-流量';
						option.legend.data=_.map(this.station,'stnm')
					
						
					}else if(type!='0'&&this.selectYear.length>1&&this.station.length==1){
						
						var list=msg;
						var series=[]
						if(type=='1'){
							_.forEach(list,function(val,i){
								
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].MSQBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(val[j].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
									
									arr.push([val[j].Q,val[j].XSAVCS,start,end])
								}
								var seriesdata={
									name:i,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}else{
							_.forEach(list,function(val,i){
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].DT).format("YYYY-MM-DD hh:mm:ss"),end=''
									arr.push([val[j].AVQ,val[j].AVCS,start,end])
								}
								var seriesdata={
									name:i,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}
						
						option.series=series
						// option.title.text='水位-流量';
						option.legend.data=this.selectYear
					} else if(type!='0'&&this.selectYear.length==1&&this.station.length==1){
						var list=msg.list;
						var serdata=[],realSer=[];
						var series=[];
						var seriesdata={
							name:'',
							type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
							smooth: true,
							// symbol: 'none',
							// symbolSize: 5,
							data:[]
						}
						if(type=='1'){

							for(var i=0;i<list.length;i++){
								var start=moment(list[i].MSQBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(list[i].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
                serdata.push([list[i].Q,list[i].XSAVCS,start,end])
							}
							seriesdata.data=serdata;
							seriesdata.name='实测数据';
							series.push(seriesdata)
						}else{
							
							for(var i=0;i<list.length;i++){
								var start=moment(list[i].DT).format("YYYY-MM-DD hh:mm:ss"),end=''
								realSer.push([list[i].AVQ,list[i].AVCS,start,end])
							}
							seriesdata.data=realSer;
							seriesdata.name='整编数据';
							series.push(seriesdata)
						}
						option.series=series
						// option.title.text='水位-流量';
						option.legend.data=[]
				}else {
          const toast = await this.toastController.create({
            message: '条件错误，只能选择单个站点和多年数据或者多个站点单年数据套绘.',
            duration: 2000
          });
          toast.present();
        }
        }else{
          if(type!="0"&&this.selectYear.length==1&&this.station.length>1){
						var list=msg;
						var series=[]
						if(type=="1"){
							_.forEach(list,function(val,i){
								
								
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].MSSBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(val[j].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
									
									arr.push([val[j].Q,val[j].SSQS,start,end])
								}
								var seriesdata={
									name:name,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}else{
							_.forEach(list,function(val,i){
								
								
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].DT).format("YYYY-MM-DD hh:mm:ss"),end=''
									arr.push([val[j].AVQ,val[j].AVQS,start,end])
								}
								var seriesdata={
									name:name,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}
						option.series=series
						// option.title.text='流量-输沙率';
						option.legend.data=_.map(this.station,'stnm')
						
					}else if(type!='0'&&this.selectYear.length>1&&this.station.length==1){
					
						var list=msg;
						var series=[]
						if(type=='1'){
							_.forEach(list,function(val,i){
								
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].MSSBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(val[j].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
									
									arr.push([val[j].Q,val[j].XSAVCS,start,end])
								}
								var seriesdata={
									name:i,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}else{
							_.forEach(list,function(val,i){
								var arr=[]
								for(var j=0;j<val.length;j++){
									var start=moment(val[j].DT).format("YYYY-MM-DD hh:mm:ss"),end=''
									arr.push([val[j].AVQ,val[j].AVQS,start,end])
								}
								var seriesdata={
									name:i,
									type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
									smooth: true,
									// symbol: 'none',
									// symbolSize: 5,
									data:arr
								}
								series.push(seriesdata)
							})
						}
						
						option.series=series
					
						option.legend.data=this.selectYear
						
					} else if(type!='0'&&this.selectYear.length==1&&this.station.length==1){
						var list=msg.list;
						var serdata=[],realSer=[];
						var series=[];
						var seriesdata={
							name:'',
							type: 'scatter',
									// symbol: 'none',
									symbolSize: 3,
							// symbol: 'none',
							smooth: true,
							// symbolSize: 5,
							data:[]
						}
						if(type=='1'){

							for(var i=0;i<list.length;i++){
								var start=moment(list[i].MSSBGTM).format("YYYY-MM-DD hh:mm:ss"),end=moment(list[i].MSQEDTM).format("YYYY-MM-DD hh:mm:ss")
								serdata.push([list[i].Q,list[i].SSQS,start,end])
							}
							seriesdata.data=serdata;
							seriesdata.name='实测数据';
							series.push(seriesdata)
						}else{
							
							for(var i=0;i<list.length;i++){
								var start=moment(list[i].DT).format("YYYY-MM-DD hh:mm:ss"),end=''
								realSer.push([list[i].AVQ,list[i].AVQS,start,end])
							}
							seriesdata.data=realSer;
							seriesdata.name='整编数据';
							series.push(seriesdata)
						}
						option.series=series
						option.title.text='流量-输沙率';
						option.legend.data=[]
						console.log(option)
					
					
					
				}else {
				  const toast = await this.toastController.create({
            message: '条件错误，只能选择单个站点和多年数据或者多个站点单年数据套绘.',
            duration: 2000
          });
          toast.present();
				}
        }
        console.log(option)
      this.initEchart(option)
      })
    }
  }
}
