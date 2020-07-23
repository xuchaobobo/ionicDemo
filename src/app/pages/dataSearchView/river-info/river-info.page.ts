/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-06 17:07:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\river-info\river-info.page.ts
 */
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular'
import { ProviderService } from '../../../service/provider.service'
import { IonicSelectableComponent } from 'ionic-selectable';
import { Baseui } from '../../../common/baseui'
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-river-info',
  templateUrl: './river-info.page.html',
  styleUrls: ['./river-info.page.scss'],
})
export class RiverInfoPage extends Baseui implements OnInit {
  titles:any='水库信息'
  stationWaterList:any;
  stationWater:any={
    stcd:'',
    stnm:''
  };
  stationWaterName:any='三峡';
  startTime: any;
  endTime: any;
  selectTab: any = 'tab1'
  constructor(
    public httpService: ProviderService,
    public toastController: ToastController,
    public activeRoute: ActivatedRoute
    ) {
    super()
    this.startTime = moment(new Date(Date.now() - 24 * 3 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss');

    this.endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if(params['object']){
        let sationInfo=JSON.parse(params['object'])
        this.stationWater.stcd = sationInfo['STCD'];
        this.stationWater.stnm = sationInfo['STNM'];
        this.stationWaterName=sationInfo['STNM']
        this.getTabData()
      }else{
        this.getStations()
      }
      
    });

   }

  ngOnInit() {
   
    
    
  }
  staionChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.stationWater=event.value
    this.stationWaterName= this.stationWater.stnm
  }
  startTimeChange(e){
    this.startTime = moment(this.startTime).format('YYYY-MM-DD hh:mm:ss')
  }
  endTimeChange(e){
    this.endTime = moment(this.endTime).format('YYYY-MM-DD hh:mm:ss')
  }
  segmentChanged(e) {
   
    this.selectTab = e.detail.value
    let tabSelected=e.detail.value
    if(tabSelected=='tab1'){
      this.startTime = moment(new Date(Date.now() - 24 * 3 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');
    this.endTime = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    }else if(tabSelected=='tab2'){
      this.startTime = moment(new Date(Date.now() - 24 * 15 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');
      this.endTime = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    }else{
      this.startTime = moment(new Date(Date.now() - 24 * 15 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');
      this.endTime = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    }
  
    this.getTabData()
  }
  getStations() {
    this.httpService.getRealStaion({"sttp":"RR"}).then(res => {

      this.stationWaterList = JSON.parse(res)
      this.stationWaterName=this.stationWaterList.filter(function(item){
        return item.stcd == '60106980'
      })[0].stnm
      this.stationWater = this.stationWaterList.filter(function(item){
        return item.stcd == '60106980'
      })[0]
      this.getTabData()
    })
  }
   getTabData(){
    let stcd = this.stationWater.stcd
    let pama = {
      stcd: stcd,
      startDate: moment(this.startTime).format('YYYY-MM-DD hh:mm:ss'),
      endDate: moment(this.endTime).format('YYYY-MM-DD hh:mm:ss')
    }
      if (this.selectTab == "tab1") {
        let url ='swns/real/realStRsvrR.gaeaway'
      this.httpService.getRealWaterData(url,pama).then(res => {
          
           let date=moment(this.endTime).format('MM-DD')
           console.log(this.stationWaterName)
           let chartData = JSON.parse(res)
          this.chartWaterTab1Line(this.stationWaterName,chartData,date)
        }).catch(async e=>{
          const toast =await this.toastController.create({
            message: '数据报错',
            duration: 2000
          })
          toast.present()
        });
      }else if(this.selectTab == "tab2"){
        let url ='swns/real/realStRiverRToWater.gaeaway'
        this.httpService.getRealWaterData(url,pama).then(res => {
            
             let chartData = JSON.parse(res)
            this.chartWaterTab2Line(this.stationWaterName,chartData)
          }).catch(async e=>{
            const toast =await this.toastController.create({
              message: '数据报错',
              duration: 2000
            })
            toast.present()
          });
      }else{
        let url ='swns/real/realStRiverRToWater.gaeaway'
        this.httpService.getRealWaterData(url,pama).then(res => {
            
            
             let chartData = JSON.parse(res)
            this.chartWaterTab3Line(this.stationWaterName,chartData)
          }).catch(async e=>{
            const toast =await this.toastController.create({
              message: '数据报错',
              duration: 2000
            })
            toast.present()
          });
      }
  
  }
  chartWaterTab1Line(stationName,chartData,timeName){
    var swjzname='长江委:'+timeName+' 08:00水位';
    var swjqname='长江委:'+timeName+' 08:00入库流量';
    var sxqname='三峡:'+timeName+' 08:00入库流量';
    var lengendSelected = {"水位":true,"入库流量":true,'出库流量':true,'坝顶高程':false,'效核洪水位':false,'设计洪水位':false,'死水位':false,'正常高水位':false};
    lengendSelected[swjzname] = false;
    lengendSelected[swjqname] = false;
    lengendSelected[sxqname] = false;
    var minRz="";
var minRzTm;
var maxRz="";
var maxRzTm;
var minInq="";
var minInqTm;
var maxInq="";
var maxInqTm;
    
    var xdata=[];
    var rzdata=[];
    var inqdata=[];
    var otqdata=[];
    var dameldata=[];
    var ckflzdata=[];
    var dsflzdata=[];
    var normzdata=[];
    var ddzdata=[];
    var swjzdata=[];
    var swjqdata=[];
    var sxqdata=[];
    
    for(var i=0;i<chartData.list.length;i++){
      //xdata.push((new Date(chartData.list[i].tm)).format("yyyy-MM-dd hh:mm:ss"));
      if(chartData.list[i].rz!=null){
        rzdata.push([chartData.list[i].tm,chartData.list[i].rz]);
        if(minRz==""){
          minRz=chartData.list[i].rz;
          minRzTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
        if(maxRz==""){
          maxRz=chartData.list[i].rz;
          maxRzTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
        if(minRz>chartData.list[i].rz){
          minRz=chartData.list[i].rz;
          minRzTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
        if(maxRz<chartData.list[i].rz){
          maxRz=chartData.list[i].rz;
          maxRzTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
      }else{
        rzdata.push(null);
      }
      if(chartData.list[i].inq!=null){
        inqdata.push([chartData.list[i].tm,chartData.list[i].inq]);
        if(minInq==""){
          minInq=chartData.list[i].inq;
          minInqTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
        if(maxRz==""){
          maxInq=chartData.list[i].inq;
          maxInqTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
        if(minInq>chartData.list[i].inq){
          minInq=chartData.list[i].inq;
          minInqTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
        if(maxRz<chartData.list[i].inq){
          maxInq=chartData.list[i].inq;
          maxInqTm=moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
        }
      }else{
        inqdata.push(null);
      }
      if(chartData.list[i].otq!=null){
        otqdata.push([chartData.list[i].tm,chartData.list[i].otq]);
      }else{
        otqdata.push(null);
      }
      dameldata.push([chartData.list[i].tm,chartData.rsvrfcchList[0].damel]);
      ckflzdata.push([chartData.list[i].tm,chartData.rsvrfcchList[0].ckflz]);
      dsflzdata.push([chartData.list[i].tm,chartData.rsvrfcchList[0].dsflz]);
      normzdata.push([chartData.list[i].tm,chartData.rsvrfcchList[0].normz]);
      ddzdata.push([chartData.list[i].tm,chartData.rsvrfcchList[0].ddz]);
    }
    
    var time;
    for(var i=0;i<chartData.swjList.length;i++){
      if(i==0){
        swjzdata.push([chartData.swjList[i].ymdh,chartData.swjList[i].z]);
        swjqdata.push([chartData.swjList[i].ymdh,chartData.swjList[i].q]);
      }else{
        if(chartData.swjList[i].ymdh==time){
          swjzdata.pop();
          swjqdata.pop();
        }
        swjzdata.push([chartData.swjList[i].ymdh,chartData.swjList[i].z]);
        swjqdata.push([chartData.swjList[i].ymdh,chartData.swjList[i].q]);
      }
      time = chartData.swjList[i].ymdh;
    }
    for(var i=0;i<chartData.sxList.length;i++){
      if(i==0){
        sxqdata.push([chartData.sxList[i].ymdh,chartData.sxList[i].q]);
      }else{
        if(chartData.sxList[i].ymdh==time){
          sxqdata.pop();
        }
        sxqdata.push([chartData.sxList[i].ymdh,chartData.sxList[i].q]);
      }
      time = chartData.sxList[i].ymdh;
    }
    let option = {
        title: {
                text: stationName+'水位-入出库流量过程',
                left: 'center'
            },
        tooltip: {
              trigger: 'axis'
        },
        grid:{
          top : 80,
          left:20,
          right:20,
          // left : 20,
          // right : 30,
          // bottom : 10,
          containLabel: true
        },
          legend: {
              data:['水位','入库流量','出库流量','坝顶高程','效核洪水位','设计洪水位','死水位','正常高水位',swjzname,swjqname,sxqname],
            x: 'center',
            top:"6%",
            type:'scroll',
            width:'80%',
            selected: lengendSelected
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100,
                  xAxisIndex: [0]
              }
          ],
          xAxis: {
            type:'time',
              //data: xdata,
              splitLine: {show: true}
          }, 
          yAxis: [
            {
              name: '水位(m)',
              type:"value",
              splitLine: {show: true},
              scale:true
            },
              {
                  name: '流量(m³/s)',
                  type: 'value',
                  splitLine: {show: false},
                  scale:true
              }
          ],
          series: [{
            name:'水位',
              data: rzdata,
              type: 'line',
              smooth: true,
              symbol:'none',
              itemStyle : { 
                normal : { 
                color:'#ff00ff', //改变折线点的颜色
                lineStyle:{ 
                color:'#ff00ff' //改变折线颜色
                } 
                } 
                }
          },{
            name:'入库流量',
              data: inqdata,
              yAxisIndex:1,
              type: 'line',
              symbol:'none',
              smooth: true,
              connectNulls: true,
              itemStyle : { 
                normal : { 
                color:'#ff7f50', //改变折线点的颜色
                lineStyle:{ 
                color:'#ff7f50' //改变折线颜色
                } 
                } 
                }
  
          },{
            name:'出库流量',
              data: otqdata,
              yAxisIndex:1,
              type: 'line',
              symbol:'none',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#1A77BB', //改变折线点的颜色
                lineStyle:{ 
                color:'#1A77BB' //改变折线颜色
                } 
                } 
                }
          },{
            name:'坝顶高程',
              data: dameldata,
              type: 'line',
              smooth: true,
              symbol:'none',
              itemStyle : { 
                normal : { 
                color:'#DC143C', //改变折线点的颜色
                lineStyle:{ 
                color:'#DC143C' //改变折线颜色
                } 
                } 
                }
          },{
            name:'效核洪水位',
              data: ckflzdata,
              type: 'line',
              symbol:'none',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#D8BFD8', //改变折线点的颜色
                lineStyle:{ 
                color:'#D8BFD8' //改变折线颜色
                } 
                } 
                }
          },{
            name:'设计洪水位',
              data: dsflzdata,
              type: 'line',
              symbol:'none',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#7FFFAA', //改变折线点的颜色
                lineStyle:{ 
                color:'#7FFFAA' //改变折线颜色
                } 
                } 
                }
          },{
            name:'死水位',
              data: ddzdata,
              type: 'line',
              symbol:'none',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#00FF00', //改变折线点的颜色
                lineStyle:{ 
                color:'#00FF00' //改变折线颜色
                } 
                } 
                }
          },{
            name:'正常高水位',
              data: normzdata,
              type: 'line',
              symbol:'none',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#8B0000', //改变折线点的颜色
                lineStyle:{ 
                color:'#8B0000' //改变折线颜色
                } 
                } 
                }
          },{
            name:swjzname,
              data: swjzdata,
              type: 'line',
              symbol:'none',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#CD5C5C', //改变折线点的颜色
                lineStyle:{ 
                color:'#CD5C5C' //改变折线颜色
                } 
                } 
                }
          },{
            name:swjqname,
            yAxisIndex:1,
              data: swjqdata,
              symbol:'none',
              type: 'line',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#FFA500', //改变折线点的颜色
                lineStyle:{ 
                color:'#FFA500' //改变折线颜色
                } 
                } 
                }
          },{
            name:sxqname,
            yAxisIndex:1,
              data: sxqdata,
              symbol:'none',
              type: 'line',
              smooth: true,
              itemStyle : { 
                normal : { 
                color:'#40E0D0', //改变折线点的颜色
                lineStyle:{ 
                color:'#40E0D0' //改变折线颜色
                } 
                } 
                }
          }]
      };
      this.initEchart(option)
  }
  chartWaterTab2Line(stationName,chartData){
    var xdata=[];
	var rzdata=[];
	var wdata=[];

	for(var i=0;i<chartData.length;i++){
		xdata.push(moment(chartData[i].tm).format("YYYY-MM-DD hh:mm"));
		if(chartData[i].rz!=null){
			rzdata.push(chartData[i].rz);
		}else{
			rzdata.push("-");
		}
		if(chartData[i].w!=null){
			wdata.push(chartData[i].w);
		}else{
			wdata.push("-");
		}
	}
	let option = {
			title: {
	            text: stationName+'水位-蓄水量过程线',
	            left: 'center'
	        },
			tooltip: {
		        trigger: 'axis'
			},
			grid:{
        left:20,
        right:20,
				containLabel: true
			},
		    legend: {
            data:['库水位','蓄水量'],
            type:'scroll',
            width:'80%',
		    	x: 'center',
		    	top:"6%"
		    },
		    dataZoom: [
		        {
		            show: true,
		            realtime: true,
		            start: 0,
		            end: 100,
		            xAxisIndex: [0]
		        }
		    ],
		    xAxis: {
		        data: xdata,
		        splitLine: {show: true}
		    }, 
		    yAxis: [
		    	{
		    		name: '水位(m)',
			    	type:"value",
			    	splitLine: {show: true},
			    	scale:true
			    },
		        {
		            name: '蓄水量(百万m³)',
		            type: 'value',
		            splitLine: {show: false},
		            scale:true
		        }
		    ],
		    series: [{
		    	name:'库水位',
		        data: rzdata,
		        type: 'line',
		        smooth: true,
		        itemStyle : { 
		        	normal : { 
		        	color:'#ff00ff', //改变折线点的颜色
		        	lineStyle:{ 
		        	color:'#ff00ff' //改变折线颜色
		        	} 
		        	} 
		        	}
		    },{
		    	name:'蓄水量',
		        data: wdata,
		        yAxisIndex:1,
		        type: 'line',
		        smooth: true,
		        connectNulls: true,
		        itemStyle : { 
		        	normal : { 
		        	color:'#ff7f50', //改变折线点的颜色
		        	lineStyle:{ 
		        	color:'#ff7f50' //改变折线颜色
		        	} 
		        	} 
		        	}

		    }]
    };
    this.initEchart(option)
  }
  chartWaterTab3Line(stationName,chartData){
    var xdata=[];
    var rzdata=[];
    var inqdata=[];
    var otqdata=[];
  
    for(var i=0;i<chartData.length;i++){
      //xdata.push((new Date(chartData[i].tm)).format("yyyy-MM-dd hh:mm"));
      if(chartData[i].rz!=null){
        rzdata.push({value:[moment(chartData[i].tm - 24*60*60*1000).format("YYYY-MM-DD hh:mm"),chartData[i].rz]});
        rzdata.push({value:[moment(chartData[i].tm).format("YYYY-MM-DD hh:mm"),chartData[i].rz]});
      }
      if(chartData[i].inq!=null){
        inqdata.push({value:[moment(chartData[i].tm - 24*60*60*1000).format("YYYY-MM-DD hh:mm"),chartData[i].inq]});
        inqdata.push({value:[moment(chartData[i].tm).format("YYYY-MM-DD hh:mm"),chartData[i].inq]});
      }
      if(chartData[i].otq!=null){
        otqdata.push({value:[moment(chartData[i].tm - 24*60*60*1000).format("YYYY-MM-DD hh:mm"),chartData[i].otq]});
        otqdata.push({value:[moment(chartData[i].tm).format("YYYY-MM-DD hh:mm"),chartData[i].otq]});
      }
    }
    let option = {
        title: {
                text: stationName+'一日均值',
                left: 'center'
            },
            tooltip: {
              trigger: 'axis'
        },
        grid:{
          // top : 50,
          // left : 20,
          // right : 30,
          // bottom : 10,
          left:20,
          right:20,
          containLabel: true
        },
          legend: {
              data:['库水位','入库流量','出库流量'],
              type:'scroll',
              width:'80%',
            x: 'center',
            top:"6%"
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100,
                  xAxisIndex: [0]
              }
          ],
          xAxis: {
             type: 'time',
             splitLine: {show: true}
              //data: xdata
          }, 
          yAxis: [
            {
              name: '水位(m)',
              type:"value",
              splitLine: {show: true},
              scale:true
            },
              {
                  name: '流量(m³/s)',
                  type: 'value',
                  splitLine: {show: false},
                  scale:true
              }
          ],
          series: [{
            name:'库水位',
              data: rzdata,
          type: 'line',
          showSymbol:false,
              itemStyle : { 
                normal : { 
                color:'#ff00ff', //改变折线点的颜色
                lineStyle:{ 
                color:'#ff00ff' //改变折线颜色
                } 
                } 
                }
          },{
            name:'入库流量',
              data: inqdata,
          yAxisIndex:1,
          showSymbol:false,
              type: 'line',
              connectNulls: true,
              itemStyle : { 
                normal : { 
                color:'#ff7f50', //改变折线点的颜色
                lineStyle:{ 
                color:'#ff7f50' //改变折线颜色
                } 
                } 
                }
  
          },{
            name:'出库流量',
              data: otqdata,
          yAxisIndex:1,
          showSymbol:false,
              type: 'line',
              connectNulls: true,
              itemStyle : { 
                normal : { 
                color:'#1A77BB', //改变折线点的颜色
                lineStyle:{ 
                color:'#1A77BB' //改变折线颜色
                } 
                } 
                }
  
          }]
      };
      this.initEchart(option)
  }
  public nowDay;//声明日期
  //自定义option，用来汉化日期
  public customPickerOptions = {
    buttons: [{
      text: '取消',
      handler: () => console.log('Clicked 取消!')
    }, {
      text: '确认',
      handler: () => {
        console.log('Clicked 确认');
        // return false; 选择日期完成后，日期控件不会消失      
        console.log(this.nowDay);
      }
    }]}
  public chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('riverInfochart');
    this.chart = ec.init(container);
    this.chart.clear()
    this.chart.setOption(option);
  }

}
