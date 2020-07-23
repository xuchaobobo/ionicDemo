/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-06 18:03:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\hyd-info\hyd-info.page.ts
 */
import { Component, OnInit,ChangeDetectorRef, } from '@angular/core';
import { LoadingController,ToastController  } from '@ionic/angular'

import { ProviderService } from '../../../service/provider.service'
import { IonicSelectableComponent } from 'ionic-selectable';
import { Baseui } from '../../../common/baseui'
import { ActivatedRoute, Params } from '@angular/router';

import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-hyd-info',
  templateUrl: './hyd-info.page.html',
  styleUrls: ['./hyd-info.page.scss'],

})
export class HydInfoPage extends Baseui implements OnInit {
  titles: any = '水文信息'
  station: any={
    stcd:''
  }
  
  dxstation: any 
  stationName='朱沱(三)'
  startTime: any;
  endTime: any;
  stations: any;
  year: any=[];
  years: any;
  lstype: any = 'z';
  dzType: any = 'z';
  selectTab: any = 'tab1'
  groupFlag:any=false;
  selectedPorts=[];
  constructor(
    public httpService: ProviderService,
    private cd: ChangeDetectorRef,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
		public activeRoute: ActivatedRoute
    ) {
    super()
    this.startTime = moment(new Date(Date.now() - 24 * 4 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss');

    this.endTime = moment(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');
    // this.station = '60104800';
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if(params['object']){
        let sationInfo=JSON.parse(params['object'])
        this.station.stcd = sationInfo['STCD'];
        this.station.stnm = sationInfo['STNM'];
        this.stationName=sationInfo['STNM']
        this.getTab1Data()
      }else{
        this.station.stcd  = '60104800';
        this.getStations()
      }
      
    });
   
    

  }

  ngOnInit() {
   
    
  }
 
  getStations() {
    let nowStation=this.station.stcd 
    this.httpService.getRealStaion({"sttp":"ZQ"}).then(res => {
      this.stations = JSON.parse(res)
      this.stationName=this.stations.filter(function(item){
        return item.stcd == nowStation
      })[0].stnm
      this.station=this.stations.filter(function(item){
        return item.stcd == nowStation
      })[0]
      this.selectedPorts = this.stations.filter(function(item){
        return item.stcd == nowStation
      });
      this.dxstation =this.stations.filter(function(item){
        return item.stcd == '60104800'||item.stcd == '60105400'
      });
      this.cd.detectChanges();
      this.getTab1Data()
    })
    
  }

  //自定义option，用来汉化日期
 
  staionChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.stationName=event.value
  }
    
  
  stratTimeChange(e) {
   
    this.startTime = moment(this.startTime).format('YYYY-MM-DD hh:mm:ss')
  }
  endTimeChange(e) {

    this.endTime = moment(this.endTime).format('YYYY-MM-DD hh:mm:ss')
  }
  segmentChanged(e) {
   
    this.selectTab = e.detail.value
    if(e.detail.value=='tab1'){
      this.startTime = moment(new Date(Date.now() - 24 * 4 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');

      this.endTime = moment(new Date(Date.now() - 24 * 1 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');
    } else if (e.detail.value == 'tab2') {
      this.startTime = moment(new Date(Date.now() - 24 * 30 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');

      this.endTime = moment(new Date(Date.now() - 24 * 1 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');
      this.httpService.getHisYears(this.station.stcd).then(res => {
        this.years = JSON.parse(res)
      })
    }else{
      this.startTime = moment(new Date(Date.now() - 24 * 4 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');

      this.endTime = moment(new Date(Date.now() - 24 * 1 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss');
    }
    this.getTab1Data()
  }
  getStationList(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if(event.value.length>3||event.value.length<1){
       super.showToast(this.toastCtrl, '最多只能选择3个站');
       return false
    }else{

    }
    
  }
  startTimeChange(e){

  }
  
  public chart: any;
  getTab1Data() {
    
    if (this.selectTab == "tab1") {
      let stcd=this.station.stcd
      let pama = {
        stcd: stcd,
        startDate: moment(this.startTime).format('YYYY-MM-DD hh:mm:ss'),
        endDate: moment(this.endTime).format('YYYY-MM-DD hh:mm:ss')
      }
      this.httpService.getRealStaionSearch(pama).then(res => {
       
        let chartData = JSON.parse(res)
        
        var minz = "";
        var minzTm;
        var maxz = "";
        var maxzTm;

        var minq = "";
        var minqTm;
        var maxq = "";
        var maxqTm;

        var mins = "";
        var minsTm;
        var maxs = "";
        var maxsTm;
        var xdata = [];
        var zdata = [];
        var qdata = [];
        var wrzdata = [];
        var sdata = [];
        var legend, yAxis, series;
        var grzdata = [];
        var obhtzdata = [];
        var hlzdata = [];
        legend = {
          data: ['水位', '流量', '警戒水位', '保证水位', '历史最高水位', '历史最低水位'],
          x: 'center',
          top: "6%",
          type:'scroll',
          width:'80%',
          selected: { "水位": true, "流量": true, '警戒水位': false, '保证水位': false, '历史最高水位': false, '历史最低水位': false }
        }
        
        for (var i = 0; i < chartData.list.length; i++) {
          // xdata.push((new Date(chartData.list[i].tm)).format("YYYY-MM-DD hh:mm:ss"));
          // zdata.push(chartData.list[i].z);
          // qdata.push(chartData.list[i].q);
          zdata.push([chartData.list[i].tm, chartData.list[i].z]);
          qdata.push([chartData.list[i].tm, chartData.list[i].q]);
          if(chartData.rvfcchList&&chartData.rvfcchList.length>0){
            wrzdata.push([chartData.list[i].tm,chartData.rvfcchList[0].wrz]);
          }
          if(chartData.rvfcchList&&chartData.rvfcchList.length>0){
            grzdata.push([chartData.list[i].tm,chartData.rvfcchList[0].grz]);
          }
          if(chartData.rvfcchList&&chartData.rvfcchList.length>0){
            obhtzdata.push([chartData.list[i].tm,chartData.rvfcchList[0].obhtz]);
          }
          if(chartData.rvfcchList&&chartData.rvfcchList.length>0){
            hlzdata.push([chartData.list[i].tm,chartData.rvfcchList[0].hlz]);
          }
          

          if (minz == "") {
            minz = chartData.list[i].z;
            minzTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
          if (maxz == "") {
            maxz = chartData.list[i].z;
            maxzTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
          if (minz > chartData.list[i].z) {
            minz = chartData.list[i].z;
            minzTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
          if (maxz < chartData.list[i].z) {
            maxz = chartData.list[i].z;
            maxzTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
          if (minq == "") {
            minq = chartData.list[i].q;
            minqTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
          if (maxq == "") {
            maxq = chartData.list[i].q;
            maxqTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
          if (minq > chartData.list[i].q) {
            minq = chartData.list[i].q;
            minqTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
          if (maxq < chartData.list[i].q) {
            maxq = chartData.list[i].q;
            maxqTm = moment(chartData.list[i].tm).format("YYYY-MM-DD hh:mm:ss");
          }
        }
        yAxis = [
          {
            name: '水位(m)',
            type: "value",
            splitLine: { show: true },
            scale: true
          },
          {
            name: '流量(m³/s)',
            type: 'value',
            splitLine: { show: false },
            scale: true
          }
        ]
        series = [{
          name: '水位',
          data: zdata,
          type: 'line',
          symbol:'none',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#ff00ff', //改变折线点的颜色
              lineStyle: {
                color: '#ff00ff' //改变折线颜色
              }
            }
          }
        }, {
          name: '流量',
          data: qdata,
          yAxisIndex: 1,
          symbol:'none',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#87cefa', //改变折线点的颜色
              lineStyle: {
                color: '#87cefa' //改变折线颜色
              }
            }
          }
        }, {
          name: '警戒水位',
          data: wrzdata,
          type: 'line',
          symbol:'none',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#8B0000', //改变折线点的颜色
              lineStyle: {
                color: '#8B0000' //改变折线颜色
              }
            }
          }
        }, {
          name: '保证水位',
          data: grzdata,
          type: 'line',
          symbol:'none',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#7FFFAA', //改变折线点的颜色
              lineStyle: {
                color: '#7FFFAA' //改变折线颜色
              }
            }
          }
        }, {
          name: '历史最高水位',
          data: obhtzdata,
          type: 'line',
          smooth: true,
          symbol:'none',
          itemStyle: {
            normal: {
              color: '#D8BFD8', //改变折线点的颜色
              lineStyle: {
                color: '#D8BFD8' //改变折线颜色
              }
            }
          }
        }, {
          name: '历史最低水位',
          data: hlzdata,
          type: 'line',
          symbol:'none',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#DC143C', //改变折线点的颜色
              lineStyle: {
                color: '#DC143C' //改变折线颜色
              }
            }
          }
        }]
        let option = {
          title: {
                  text: '过程线',
                  left: 'center',
              },
          tooltip: {
                trigger: 'axis'
          },
          grid:{
            // bottom:10,
            top:80,
            left:20,
            right:20,
           
            containLabel: true
          },
            legend: legend,
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
            splitNumber:3,
            type:'time',
            axisLabel:{
              formatter:function(value, index){
                let year =  moment(value).format("YYYY-MM-DD")
                let time =  moment(value).format("hh:mm:ss")
                return year + '\n' +time
                
              }
            },
                splitLine: {show: true}
            }, 
            yAxis: yAxis,
            series: series
        };
        this.initEchart(option)
      })
    } else if (this.selectTab == 'tab2') {

      let pama = {
        stcd: this.station.stcd,
        startDate: moment(this.startTime).format('YYYY-MM-DD hh:mm:ss'),
        endDate: moment(this.endTime).format('YYYY-MM-DD hh:mm:ss'),
        yr: this.year
      }
      let url;
      if (this.lstype != 's') {
        url = "swns/real/realHisStRiverR.gaeaway"
      } else {
        url = "swns/real/realHisStsedR.gaeaway"
      }
      this.httpService.getHisSearchData(url, pama).then(res => {
        let chartData = JSON.parse(res)
       
        var xdata = [];
        let zdata = [];
        let qdata = [];
        let wrzdata = [];
        let grzdata = [];
        let obhtzdata = [];
        let hlzdata = [];
        let series = [];
        let keyname;
        var yrlist = this.year;

        var legendData = [new Date().getFullYear() + ""];

        if (this.lstype == "z") {
          keyname = "水位(m)";
        } else if (this.lstype == "q") {
          keyname = "流量(m³/s)";
        } else {
          keyname = '含沙量(kg/m³)'
        }
        if (yrlist.length == 0) {

          for (var i = 0; i < chartData.list.length; i++) {
            xdata.push(moment(chartData.list[i].tm).format("MM-DD hh:mm"));
            zdata.push(chartData.list[i][this.lstype]);
          }
          series.push({
            name: legendData[0],
            data: zdata,
            type: 'line',
            smooth: true,
          });
        }
        var standard = [];
        for (var i = 0; i < yrlist.length; i++) {
          zdata = [];
          xdata = [];
          legendData.push(yrlist[i]);
          var his = chartData[yrlist[i] + "HisList"];
          if (his.length > standard.length) {
            standard = his;
          }
          var hisdata = [];
          for (var j = 0; j < standard.length; j++) {
            xdata.push(moment(standard[j].tm).format("MM-DD hh:mm"));
            if (chartData.list.length > j) {
              if (moment(standard[j].tm).format("MM-DD") == "02-29" && moment(chartData.list[j].tm).format("MM-DD") != "02-29") {
                zdata.push("-");
              }
              zdata.push(chartData.list[j][this.lstype]);
            } else if (standard.length > zdata.length) {
              zdata.push("-");
            }
            if (moment(standard[j].tm).format("MM-DD") == "02-29" && moment(his[j].tm).format("MM-DD") != "02-29") {
              hisdata.push("-");
            }
            if (j < his.length) {
              hisdata.push(his[j][this.lstype]);
            }
          }
          if (i == 0) {
            series.push({
              name: legendData[0],
              data: zdata,
              type: 'line',
              smooth: true,
            });
          }
          series.push({
            name: yrlist[i],
            data: hisdata,
            symbol:'none',
            type: 'line',
            smooth: true,
          });
        }
        let yAxis=[
		    	{
		    		name: keyname,
			    	type:"value",
			    	splitLine: {show: true},
			    	scale:true
			    }
        ]
        let option = {
          title: {
                  text: '历史同期对比',
                  left: 'center',
              },
          tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:legendData,
                type:'scroll',
                width:'80%',
              x: 'center',
              top:"6%"
          },
          grid:{
            // bottom:10,
            top:60,
            left:20,
            right:20,
            containLabel: true
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
                name: keyname,
                type:"value",
                splitLine: {show: true},
                scale:true
              }
            ],
            series: series
        };
        this.initEchart(option)
      })
    }else {
      let stcds =_.toString(_.map(this.dxstation,'stcd'))
      let pama = {
        stcds: stcds,
        startDate: moment(this.startTime).format('YYYY-MM-DD hh:mm:ss'),
        endDate: moment(this.endTime).format('YYYY-MM-DD hh:mm:ss'),
        
      }
      if(this.dxstation.length>3||this.dxstation.length<1){
        super.showToast(this.toastCtrl, '最多只能选择3个站');
        return false
     }else{
 
      let url;
      if (this.dzType != 's') {
        url = "swns/real/realStaStRiverR.gaeaway"
      } else {
        url = "swns/real/realStsedR.gaeaway"
      }
      this.httpService.getHisSearchData(url, pama).then(res => {
        let chartData = JSON.parse(res)
        if(this.groupFlag){
         this.chartLineGroup(chartData,this.dzType);
        }else{
         this.chartLsLine(chartData,this.dzType);
        }
      })
      
     }
    }

  }
  chartLineGroup(chartData,key){
    this.chart.clear()
    
    let xdata=[];
	  let xAxis=[];
	let yAxis=[];
	let series=[];
	let xAxisIndex=[];
  let grid=[];
  let selectStation=this.dxstation
  let chartHeight=0;
	var keyname,unit;
	//var stations=formSelects.value('station','val');
	var stationsarr=this.dxstation
 
	var legendData=[];
	
	if(key=="z"){
		keyname="水位";
		unit='(m)'
	}else if(key=="q"){
		keyname="流量";
		unit='(m³/s)'
	}else{
		keyname="含沙量";
		unit='(kg/m³)'
	}
	

	for(var i=0;i<stationsarr.length;i++){
		legendData.push(stationsarr[i].stnm);
		var list=chartData[stationsarr[i].stcd];
		xdata=[];
		var nowdata=[];
		for(var j=0;j<list.length;j++){
      let year =  moment(new Date(list[j].tm)).format("YYYY-MM-DD")
      let time =  moment(new Date(list[j].tm)).format("hh:mm:ss")
     let nowDate= year + '\n' +time
			xdata.push(nowDate);
			nowdata.push(list[j][key]);
		}
		series.push({
			xAxisIndex: i,
        yAxisIndex: i,
	    	name:stationsarr[i].stnm,
	        data: nowdata,
	        type: 'line',
	        smooth: true
	    });
		xAxis.push({
			gridIndex: i,
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: xdata
        });
		yAxis.push({
			gridIndex: i,
    		name: keyname+unit,
	    	type:"value",
	    	splitLine: {show: true},
	    	scale:true
	    });
		xAxisIndex.push(i);
		if(stationsarr.length==1){
			grid.push({
          left:20,
          right:20,
            height: '100%',
            containLabel: true
		    });
		}else if(stationsarr.length==2){
			if(i==0){
				grid.push({
          left:20,
            right:20,
          height: '32%',
          containLabel: true
			    });
			}else{
				grid.push({
          left:20,
            right:20,
          top: '62%',
          height: '35%',
          containLabel: true
			    });
			}
		}else{
			if(i==0){
				grid.push({
          left:20,
            right:20,
          height: 100,
          containLabel: true
			    });
			}else{
				grid.push({
          left:20,
            right:20,
          top: i*100+(i+1)*50,
          height: 100,
          containLabel: true
			    });
      }
      
			chartHeight=500+i*100+(i+1)*80;
		}
	}
	
	let option = {
			title: {
	            text: '河道多站'+keyname+'对比',
	            left: 'center',
	        },
			tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
            data:legendData,
            type:'scroll',
            width:'80%',
		    	x: 'center',
		    	top:30
		    },
		    axisPointer: {
		        link: {xAxisIndex: 'all'}
		    },
		    dataZoom: [
		        {
		            show: true,
		            realtime: true,
		            start: 0,
		            end: 100,
		            xAxisIndex: xAxisIndex
		        }
		    ],
		    grid: grid,
		    xAxis: xAxis,
		    yAxis: yAxis,
		    series: series
    };
    if(stationsarr.length>2){

      this.chart.getDom().style.height = chartHeight+"px";
    }else{
      this.chart.getDom().style.height = "300px";
    }
  
    this.chart.setOption(option)
    this.chart.resize()
  }
  
  chartLsLine(chartData,key){
    
    let selectStation=this.dxstation
    
    this.chart.clear()
	var xdata=[];
	var series=[];
  var keyname,unit;
  var stationsArr=this.dxstation
  
  var stations=[]
  let staionText=[]
	//var stations=formSelects.value('station','val');
	// if(stationsArr.length==0){
	// 	stationsArr.push({name:"朱沱(三)",value:"60104800"});
	// }else{
	// 	stationsArr=formSelects.value('stationHis','text');
	// }
	
	var legendData=[];
	
	if(key=="z"){
		keyname="水位";
		unit='(m)'
	}else if(key=="q"){
		keyname="流量";
		unit='(m³/s)'
	}else{
		keyname="含沙量";
		unit='(kg/m³)'
	}
	

	for(var i=0;i<stationsArr.length;i++){
		legendData.push(stationsArr[i].stnm);
		var list=chartData[stationsArr[i].stcd];
		xdata=[];
		var nowdata=[];
		for(var j=0;j<list.length;j++){
      let year =  moment(new Date(list[j].tm)).format("YYYY-MM-DD")
      let time =  moment(new Date(list[j].tm)).format("hh:mm:ss")
     let nowDate= year + '\n' +time
			xdata.push(nowDate);
			nowdata.push(list[j][key]);
		}
		series.push({
	    	name:stationsArr[i].stnm,
	        data: nowdata,
	        type: 'line',
	        smooth: true
	    });
	}
	
	let option = {
			title: {
	            text: '河道多站'+keyname+'对比',
	            left: 'center',
	        },
			tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
            data:legendData,
            type:'scroll',
            width:'80%',
		    	x: 'center',
		    	top:"6%"
			},
			grid:{
				// bottom:10,
				top:60,
				left:20,
            right:20,
				containLabel: true
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
		    		name: keyname+unit,
			    	type:"value",
			    	splitLine: {show: true},
			    	scale:true
			    }
		    ],
		    series: series
		};
		this.chart.getDom().style.height = "300px";
		this.chart.setOption(option);
		this.chart.resize();

  }
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('hydInfochart');
    this.chart = ec.init(container);
    this.chart.clear()
    
    this.chart.setOption(option);
  }
}
