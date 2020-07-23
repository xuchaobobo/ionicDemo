/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 19:00:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\kurong\kurong.page.ts
 */
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { ProviderService } from '../../../service/provider.service'
import * as _ from 'lodash';
import * as moment from 'moment'
import * as echarts from 'echarts';

@Component({
  selector: 'app-kurong',
  templateUrl: './kurong.page.html',
  styleUrls: ['./kurong.page.scss'],
})
export class KurongPage implements OnInit {
titles:any='库容分析';
stationList=[]
selectedStation;
upLc
time
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public httpService: ProviderService,
  ) {
    // this.selectedStation='60104800'
    
      this.time=moment(new Date(Date.now() - 24 * 365 * 5 * 60 * 60 * 1000)).format('YYYY MM DD')
   }

  ngOnInit() {
    this.getRealStation()
  	
  }
getRealStation(){
    this.httpService.getRealStaions().then(res=>{
        let data=JSON.parse(res)
        this.stationList=data.reverse()
        this.selectedStation=this.stationList[0].stcd
        this.upLc=this.stationList[0].dstrvm
        this.searchData() 
    })
}
getTimes(val){

}
async searchData(){
    var stcd=this.selectedStation
    var upId =_.filter(this.stationList,{'stcd':stcd})[0].ndid?_.filter(this.stationList,{'stcd':stcd})[0].ndid:'34';
	var upStation =_.filter(this.stationList,{'stcd':stcd})[0].ndnm;
	var downStation = '大坝';
	var downId =1;
    var kr = 0;
    var yimin =[
        [0,177],
        [7,177],
        [31.1,177],
        [37.6,177],
        [66.8,177],
        [72.5,177],
        [124.2,177],
        [162.2,177],
        [223.7,177],
        [248.4,177],
        [281.3,177],
        [288.3,177],
        [342.1,177],
        [370.3,177],
        [429,177],
        [432.5,177],
        [454.6,177],
        [472.5,177],
        [483,177],
        [493.9,177],
        [507.9,177],
        [514.4,177.2],
        [518.2,177.3],
        [522.8,177.4],
        [527,177.6],
        [529.3,178],
        [532.9,178.5],
        [539.1,179.4],
        [544.7,180.3],
        [549.9,180.9],
        [555.2,181.8],
        [560.1,182.6],
        [565.7,183.5],
        [570,184.2],
        [573.9,184.9],
        [579.6,186]
    ];
    var zhengyonmg =[
                [0,175],
                [7,175],
                [31.1,175],
                [37.6,175],
                [66.8,175],
                [72.5,175],
                [124.2,175.1],
                [162.2,175.1],
                [223.7,175.1],
                [248.4,175.1],
                [281.3,175.1],
                [288.3,175.1],
                [342.1,175.1],
                [370.3,175.1],
                [429,175.1],
                [432.5,175.1],
                [454.6,175.2],
                [472.5,175.2],
                [483,175.3],
                [493.9,175.4],
                [507.9,175.5],
                [514.4,175.5],
                [518.2,175.5],
                [522.8,175.5],
                [527,175.6],
                [529.3,175.7],
                [532.9,175.7],
                [539.1,175.8],
                [544.7,176.1],
                [549.9,176.8],
                [555.2,177.6],
                [560.1,178.4],
                [565.7,179.3],
                [570,180],
                [573.9,180.7]
            ];
	let time =moment(this.time).format('YYYYMMDD');
	if(time==""){}
	  var  pama={
		 upId:upId,
		 downId:downId,
		 year:time,
		 stcd:stcd
      }
      this.httpService.getRealKRData(pama).then(response=>{
          let data=JSON.parse(response)
        var  serie = [];
        var lend	= ['河床高程','坝前水位','实时水位','库区移民线','土地征用线'];
        var chartData = [];
        var chartData1 = [];
        var chartData2 = [];
        var chartData3=yimin;
          var chartData4=zhengyonmg;
        chartData.push([0,50]);
        chartData1.push([0,data.water]);
        chartData2.push([0,data.water]);
        for(var i = 0;i<data.nameAll.length;i++){
            chartData.push([data.nameAll[i].dstrvm,data.nameAll[i].rvbdelv]);
            chartData1.push([data.nameAll[i].dstrvm,data.water]);
              if(data.name[i]!=undefined){
                  chartData2.push([data.name[i].dstrvm,data.avz[i]]);
              }
        }
        var Data1= {
               data: chartData,
               type: 'line',
               //symbol:"none",
               name:'河床高程',
               areaStyle: {normal:{
                   color:'#CD4F39',
                   origin: 'start',
                   opacity: 1,
               }},
               z:4
                }
        var Data2= {
                   data: chartData1,
                   type: 'line',
                   //symbol:"none",
                   name:'坝前水位',
                   areaStyle: {normal:{
                       color:'#0CBDFF',
                       origin: 'start',
                       opacity: 1,
                   }},
                   z:3
                    }
        var Data3= {
                   data: chartData2,
                   type: 'line',
                   //symbol:"none",
                   name:'实时水位',
                   areaStyle: {normal:{
                       color:'#EBDAC0',
                       origin: 'start',
                       opacity: 1,
                   }},
                   z:2
                  }
          var Data4 ={
                    data: chartData3,
                    type: 'line',
                    name:'库区移民线',
                    //symbol: 'none',
                    itemStyle:{
                         normal:{
                             color:'#de3d28'
                         }
                    },
                       z:1
                }
          var Data5 ={
                data: chartData4,
                type: 'line',
                name:'土地征用线',
                //symbol: 'none',
                itemStyle:{
                    normal:{
                        color:'#e79b0b'
                    }
                   },
                   z:1
            }
        
           serie.push(Data3);
           serie.push(Data2);
           serie.push(Data1);
           serie.push(Data4);
           serie.push(Data5);
            this.chartLine(serie,[],"value","kurongchart","距坝里程","水位(吴淞m)",lend,"");
      })
}
 chartLine(data,xData,xType,divName,xName,yName,legendData,minType){
    let ec = echarts as any;
    let container = document.getElementById(divName);
    this.chart = ec.init(container);
	this.chart.clear();
	var option =  {
		    legend: {
		        data:legendData
		    },
		    grid:{
				bottom:10,
				top:30,
				left:'1%',
				right:64,
		        containLabel: true
			},
		    toolbox: {
		    	orient:"vertical",
		    	y:"top",
		    	show: true,
		    	feature : {
		    	    dataZoom : {show: true},
		    	    magicType : {show: true, type: ['line']},
		    	    restore : {show: true},
		    	    saveAsImage : {show: true},
		    	   
		    	 }
		     },
		     tooltip : {
		    	    trigger: 'axis',
		    	    axisPointer : {
						show : true,
						type : 'cross',
						lineStyle : {
							type : 'dashed',
							width : 1
						}
					},
		    	    formatter:function(params){
		    	    	var str="<div class='_ec_tolltip'>";
		    	    	if(params.length>1){
		    	    		if(_.isArray(params[0].value)){
		    	    			str+="<div><span class='_ec_title icon-bullet_green'>"+xName+"：</span><span class='_ec_value'>"+params[0].value[0]+"</span></div>";
		    	    			for(var i = 0;i<params.length;i++){
				    				str+="<div><span class='_ec_title icon-bullet_yellow'>"+params[i].seriesName+"：</span><span class='_ec_value'>"+params[i].value[1]+"</span></div>";
				    			}
				    	    	str+="<div>";
		    	    		}else{
		    	    			str+="<div><span class='_ec_title icon-bullet_green'>"+xName+"：</span><span class='_ec_value'>"+params[0].name+"</span></div>";
		    	    			for(var i = 0;i<params.length;i++){
				    				str+="<div><span class='_ec_title icon-bullet_yellow'>"+params[i].seriesName+"：</span><span class='_ec_value'>"+params[i].value+"</span></div>";
				    			}
				    	    	str+="<div>";
		    	    		}
		    	    	}else{
		    	    		if(_.isArray(params[0].value)){
		    	    			str+="<div><span class='_ec_title icon-bullet_green'>"+xName+"：</span><span class='_ec_value'>"+params[0].value[0]+"</span></div>";
				    		    str+="<div><span class='_ec_title icon-bullet_yellow'>"+yName+"：</span><span class='_ec_value'>"+params[0].value[1]+"</span></div>";
				    	    	str+="<div>";
		    	    		}else{
		    	    			str+="<div><span class='_ec_title icon-bullet_green'>"+xName+"：</span><span class='_ec_value'>"+params[0].name+"</span></div>";
				    		    str+="<div><span class='_ec_title icon-bullet_yellow'>"+yName+"：</span><span class='_ec_value'>"+params[0].value+"</span></div>";
				    	    	str+="<div>";
		    	    		}
		    	    	}
		    	    	//myChart.resize();
		    	    	return str;
		    	    }
		    	},
		    xAxis : [
		        {
		        	name:xName,
		            type :xType,
		            boundaryGap :xName=="断面"?true:false,
		            data : xData
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            name:yName,
		            min:minType=="m"?130:0
		        }
		    ],
		    series :data
		};
	 
	if(option.series.length>0||option.series.data.length>0){
		this.chart.setOption(option);
		this.chart.resize();
		
		
		
	}else{
		// $.messager.alert('提示框', '暂无数据!', 'error');
	}
}

 public chart: any;
 
}
