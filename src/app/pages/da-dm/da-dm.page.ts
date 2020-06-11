import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { LoadingController,ToastController,ModalController  } from '@ionic/angular'

import { ProviderService } from './../../service/provider.service'
import { IonicSelectableComponent } from 'ionic-selectable';
import { Baseui } from '../../common/baseui'
import { UnitsService } from './../../service/units.service'
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-da-dm',
  templateUrl: './da-dm.page.html',
  styleUrls: ['./da-dm.page.scss'],
})
export class DaDmPage implements OnInit {
  titles: any = '大断面分析';
  public chart: any;
  section
  sectonList
  selectedMsno
  minY=0
  maxY=300
  water=218
  selectwater=218
  rowsD=[]
	rowsDs=[]
	datas=Object()
  msnos
  sixData=[]
  btnFlag
  constructor(
    public httpService: ProviderService,
    public modalController: ModalController,
    public toastController: ToastController,
    private cd: ChangeDetectorRef,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public unitsService:UnitsService
  ) { }

  ngOnInit() {
    this.getAllDxscd()
  }
  getAllDxscd(){
    this.httpService.getAllDxscd().then(msg=>{
      let data=JSON.parse(msg)
      this.sectonList=data
      this.section=data[0]
      this.setMsno()
    })

  }
  sectionChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.setMsno()
  }
  setMsno(){
    let stcd=this.section.stcd
    this.httpService.getDaXscdByMsno(stcd).then(msg=>{
      let data=JSON.parse(msg)
      this.msnos=data
      this.selectedMsno=[data[0].OBDT]
      this.dmxChart()
    })
  }
  waterChange(e){
    this.water = e.detail.value
   
    var xscd =this.section.stcd;
    var meaTimeLen = this.selectedMsno.length;
   
    var msno = _.toString(this.selectedMsno);
    
        if (meaTimeLen && meaTimeLen > 1) {
         
          this.getSixs(xscd, msno, e.detail.value)
					
          
				} else if (meaTimeLen && meaTimeLen == 1) {
                var myOption = this.chart.getOption();
  
                  var waterData = myOption.series.filter(function (item) {
                    return item.name == "水位"
                  })[0]
                  for (var i = 0; i < waterData.data.length; i++) {
                    waterData.data[i][1] = e.detail.value
                  }
                  _.forEach(myOption.series, function (val,i) {
                    if (val.name == '水位') {
                      val = waterData
                    }
                  })
                 
                  this.chart.setOption(myOption)
					this.getSix(xscd, msno, e.detail.value)
	
				}
  }
  getSix(xscd, msno, value){
    
    this.httpService.getdSixData(xscd, msno, value).then(res=>{
      
      if(res){
        let resData=JSON.parse(res)
        resData.msno=msno
        this.sixData=[]
        this.sixData[0]=resData
      }
    })
  }
  getSixs(xscd, msno, value){
      this.httpService.getdSixsData(xscd, msno, value).then(res=>{
        if(res){
          this.sixData=JSON.parse(res)
        }
    })
  }
  dmxChart(){
    let xsnm=this.section.stnm
    var titleText = '断面:' + xsnm;
    let xscd=this.section.stcd
    var meaTimeLen = this.selectedMsno.length;
    let msno=_.toString(this.selectedMsno)
		var xType = "value";
		var pama = {
			stcd: xscd,
			obdts: msno,
    }
    let index,animal
        if (meaTimeLen && meaTimeLen > 1) {
          index=1
          animal=0
          this.btnFlag=true
				
          
				} else if (meaTimeLen && meaTimeLen == 1) {
          index=0
          this.btnFlag=false
				
	
				}
    this.httpService.dmxChart(pama).then(async msg=>{
      let data=JSON.parse(msg)
      if (index == 1) {
        if (data.length == 0) {
          // layer.msg('测次：' + msno + '</br>' + '断面：' + xscd + '</br>数据：无数据', {
          //   time: 1000
          // });
          const toast = await this.toastController.create({
            message: '该断面无数据',
            duration: 2000
          });
          toast.present();
        } else {
          
          var div = "daDmchart";
          var map = {};
          for (var i = 0; i < data.length; i++) {
            var key = data[i].name;
            var value = data[i];
            map[key] = value;
          }
        
          function renderItem(params, api) {
            if (params.context.rendered) {
              return;
            }
            params.context.rendered = true;
          
            var series = this.chart.getOption().series;
            var points = [];
            for (var i = 0; i < series[params.seriesIndex].data.length; i++) {
              points.push(api.coord(series[params.seriesIndex].data[i]));
            }
            var color = series[params.seriesIndex].color;
            return {
              type: 'polygon',
              shape: {
                points: echarts.graphic.clipPointsByRect(points, {
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                })
              },
              style: api.style({
                fill: color
              })
            };
          }
          
          map["minY"] = data[0].minY;
          var water= data[0].watermaxY
          this.minY= data[0].minY
          this.maxY= data[0].maxY
          this.water=Number(data[0].watermaxY)
        
          
          this.getSixs(xscd, msno,water)


        
          
          if(animal==0){
            this.chart = this.unitsService.chartLines(map, div, xType, "起点距(m)", "高程(m)", titleText,'duanmian');
           
          }else{
            var cylist=data.cyList[0];
            this.chart  = this.unitsService.chartLines(map, div, xType, "起点距(m)", "高程(m)", titleText,'duanmian');
            var len=cylist.length-1;
            var v=-1;
            let gaeaTimer=this.unitsService.gaeaTimer
            gaeaTimer.start({
              timenum:cylist.length,
              interval:3000,
              task:function(){
                UpData(cylist[gaeaTimer.j],this.chart)
            
              }
            });
            // $('#stopSection').click(function(){
            //   gaeaTimer.pause()
            // })
       
            function UpData(data,chartInit){
              var optionInt=chartInit.getOption()
              this.animationSeries=[];
              for(var n=0;n<data.yu.length;n++){
                this.animationSeries.push({
                  name:'淤'+n,
                  type: 'custom',
                  color:'rgb(255,0,0)',
                  data:data.yu[n],
                  renderItem: renderItem
                });
              }
              for(var m=0;m<data.chong.length;m++){
                this.animationSeries.push({
                  name:'冲'+m,
                  type: 'custom',
                  color:'rgb(0,255,0)',
                  data:data.chong[m],
                  renderItem:renderItem
                });
              }
              optionInt.series=optionInt.series.filter(function(item){
                return item.type=='line'
              })
              optionInt.series=this.animationSeries;
              chartInit.clear()
              this.chart.clear()
              
              this.chart.setOption(optionInt)
            }

          }
          

          // $('#tableMeaTimesTab').hide()
          // section_ops.showTableDataDiv(1)
        }

      } else {
        // $('.singerSection').show()
        // $('.meaTimes').hide()
        var div = "daDmchart";
        var dmData = data;
        this.rowsD = [];
        this.rowsDs = [];
        if (dmData.length == 0) {
          // layer.msg('测次：' + msno + '</br>' + '断面：' + xscd + '</br>数据：无数据', {
          //   time: 1000
          // });
          return;
        } else {
          let ctype = 'duanmian'
          // var water,searchType=3
          // if(searchType==3){
          // 	water=$("#water").val();
          // }else{
          // 	water =data[0].lobz;
          // }

          var water = dmData[0].watermaxY;
          
          this.maxY =dmData[0].maxY;
          this.minY = dmData[0].minY
          this.water=Number(dmData[0].watermaxY);
          this.getSix(xscd, msno, water)
          var waterLine = [];
          var xData = [];
          var yData = [];
          var xmax = 0;
          this.datas = Object();
          for (var i = 0; i < dmData[0].data.length; i++) {

            if (i == dmData[0].data.length - 1) {
              xmax = dmData[0].data[i][0];
            }
            xData.push(dmData[0].data[i][0]);


            if (i == 0 || dmData[0].data[i][0] > dmData[0].data[i - 1][0]) {

              yData.push([dmData[0].data[i][0], dmData[0].data[i][1]]);
              waterLine.push([dmData[0].data[i][0], water]);
              this.rowsD.push([dmData[0].data[i][0], dmData[0].data[i][1]]);
              // if (flags == 1) {
              // 	section_ops.datas["yDataB" + flag] = yDataBB;
              // 	flags = 0;
              // }
            } else {

              //yData.push([dmData[0].data[i][0],0]);
            
              this.rowsD.push([dmData[0].data[i][0], dmData[0].data[i][1]]);
              this.rowsDs.push([dmData[0].data[i][0], dmData[0].data[i][1]]);

              // if (i == dmData[0].data.length - 1) {

              // 	section_ops.datas["yDataB" + flag] = yDataBB;
              // }
            }

          }
          //yDataBB.sort(descend);
          var dmlineArr = [],
          dmsanntlineArr = [],
            markXaixArr = [],
            markDSANNTArr = [],
            zXaixArr = [],
            zDANNTXaixArr = [];
          if (dmData[0].dsan) {
            for (var i = 0; i < dmData[0].dsan.length; i++) {
              if (_.findIndex(dmlineArr, dmData[0].dsan[i].dsnm)==-1) {
                dmlineArr.push(dmData[0].dsan[i].dsnm)
                var h = dmData[0].dsan[i].h
                if (dmData[0].dsan[i].dsnm == '9999') {

                  var inptds = dmData[0].dsan[i].inptds
                  zXaixArr.push([inptds, h])
                } else {
                  var inptds = dmData[0].dsan[i].inptds
                  markXaixArr.push([inptds, h])
                }


              }
            }
            // this.cxmodalFlag=true
            // this.cxmodalData=dmData[0].dsan
          }else{
            // this.cxmodalData=[]
            // this.cxmodalFlag=false
          }
          if(dmData[0].dsannt) {
            
            for (var i = 0; i < dmData[0].dsannt.length; i++) {
              if (_.findIndex(dmsanntlineArr, dmData[0].dsannt[i].dsnm)==-1) {
                dmsanntlineArr.push(dmData[0].dsannt[i].dsnm)
                var h = dmData[0].dsannt[i].h;
                var inptds = dmData[0].dsannt[i].inptds
                var dsnm=dmData[0].dsannt[i].dsnm
                var dbd=dmData[0].dsannt[i].dbd
                if (dmData[0].dsannt[i].dsnm == '9999') {
                  
                  zDANNTXaixArr.push([inptds, h,dsnm,dbd])
                } else {
                  markDSANNTArr.push([inptds, h,dsnm,dbd])
                }


              }
            }
            // this.pjmodalFlag=true
            // this.pjmodalData=dmData[0].dsannt
          }else{
            // this.pjmodalFlag=false
            // this.pjmodalData=[]
          }

          var x = {
            data: xData,
            name: "起点距"
          }
          var newData = {
            data: yData,
            itemStyle: dmData[0].itemStyle,
            name: dmData[0].name,
            type: dmData[0].type,
            xAxis: x
          }


         
          var markXaix = {
            data: markXaixArr,
            type: 'scatter',
            name: '垂线颗粒级配',
            // symbol:"none",
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            showSymbol: false,
          }
          var zhongXaix = {
            data: zXaixArr,
            type: 'scatter',
            name: '断面平均颗粒级配',
            // symbol:"none",
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: 'yellow'
              }
            }
          }
        
          
          var map = {};
          map[dmData[0].name] = newData;
          map["waterLine"] = waterLine;
         
          if (dmData[0].dsan) {
            map["markXaixArr"] = markXaix;
            map["zhongXaix"] = zhongXaix;
            map["dsan"] = dmData[0].dsan;
            if (dmData[0].dsannt) {
              map["dsannt"] = dmData[0].dsannt;
            }
          }
          

          map["minY"] = dmData[0].minY;
          map["maxY"] = dmData[0].maxY;
          map["info"] = {
            xscd: xscd,
            xsnm: xsnm
          };
          if (this.chart) {
            this.chart.clear()
          }

          this.chart = this.unitsService.chartLine(map, div, xType, "起点距(m)", "高程(m)", titleText,'','duanmian');
          
          // section_ops.showTableDataDiv(0)
        }
      }
    })
  }
}
