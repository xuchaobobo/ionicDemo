import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { SectionSelectComponent } from '../../../compontent/section-select/section-select.component'
import { KljpChartComponent } from '../../../compontent/kljp-chart/kljp-chart.component'
import { ProviderService } from '../../../service/provider.service'
import { UnitsService } from '../../../service/units.service'
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment'

@Component({
  selector: 'app-guding-dm',
  templateUrl: './guding-dm.page.html',
  styleUrls: ['./guding-dm.page.scss'],
})

export class GudingDmPage implements OnInit {
  titles: any = '固定断面分析';
  public chart: any;
  section = [{
    DSAN: 0,
    RIMODS: 2656492,
    XSCD: "LFA03003011",
    XSNM: "S400"
  }]
  cxmodalFlag=false
  cxmodalData=[]
  pjmodalFlag=false
  pjmodalData=[]
  minY=0
  maxY=300
  water=218
  selectwater=218
  rowsD=[]
	rowsDs=[]
	datas=Object()

	animiBtnShow=false
	animationSeries=[]
  msnos
  selectedMsno
  dateType='1'
  allSections
  sectionName = 'S400'
  sixData=[]
  btnFlag=false
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public httpService: ProviderService,
    public unitsService:UnitsService,
    public activeRoute: ActivatedRoute
  ) { 
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if(params['object']){
        let dmInfo=JSON.parse(params['object'])
        this.section[0].XSCD = dmInfo['XSCD'];
        this.section[0].XSNM = dmInfo['名称'];
        this.sectionName= dmInfo['名称']
        this.getMsnoData()
      }
      
    });
  }

  ngOnInit() {
    this.getMsnoData()
    
  }
  async selSection() {

    const modal = await this.modalController.create({
      component: SectionSelectComponent,
      cssClass: 'station_elect',
      componentProps: {
        dateType:this.dateType,
        defaultSection: this.section
      }
    })
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.section = data.selectSection
    this.allSections = data.allSection
    this.sectionName = _.map(data.selectSection, 'XSNM').join(',')
    this.getMsnoData()
  }
  async cxmodal() {
    var xscd =_.toString(_.map(this.section,'XSCD'));
    var xsnm =_.toString(_.map(this.section,'XSNM'));
    const modal = await this.modalController.create({
      component: KljpChartComponent,
      cssClass: 'station_elect',
      componentProps: {
        data:this.cxmodalData,
        xscd:xscd,
        xsnm:xsnm
      }
    })
    await modal.present();
    
  }
  async pjmodal() {
    var xscd =_.toString(_.map(this.section,'XSCD'));
    var xsnm =_.toString(_.map(this.section,'XSNM'));
    const modal = await this.modalController.create({
      component: KljpChartComponent,
      cssClass: 'station_elect',
      componentProps: {
        data:this.pjmodalData,
        xscd:xscd
      }
    })
    await modal.present();
    
  }
  getMsnoData(){
    let xscd=_.toString(_.map(this.section,'XSCD'))
    this.httpService.getXscdByMsno(xscd).then(res=>{
      let data = JSON.parse(res)
      var arr = []
      _.forEach(data, function (item,i) {
        var val = item.YR + "" + item.MD + "-" + item.MSNO.split("-")[1]
        var valtxt = item.YR + "" + item.SHOWMSNO + "-" + item.MSNO.split("-")[1]
        var dsanName = "";
        if(item.DSAN>0){
          dsanName = "(颗)"
        }
        if(item.DSANNT>0){
          dsanName = "(颗)(干)"
        }
        var obj = Object()
        obj.name = valtxt+dsanName
        obj.value=val
       
        if (_.findIndex(arr,obj)==-1) {
          arr.push(obj)
        }
  
      })
      this.msnos=arr
      this.selectedMsno=[arr[0].value]
      this.getRiverSections()
      this.searchData()
    })
  }
  getRiverSections(){
    let param=Object()
    
   
      param.riverMod ='[{"startdist":2656492,"endist":1861000}]'
    
    let url
    // if(this.dataType=='1'){
      url='swns/base/section/section.gaeaway'
    this.httpService.getSectionByRiver(url,param).then(res=>{
      let data=JSON.parse(res)
      this.allSections=data
    })
  }

  async nextDm(){
    let index = _.findIndex(this.allSections,this.section[0])
    if(index==this.allSections.length){
      const toast = await this.toastController.create({
        message: '已到最后一个断面',
        duration: 2000
      });
      toast.present();
    }else{
      index++
      this.section=[this.allSections[index]]
      this.sectionName=this.section[0].XSNM
      this.getMsnoData()
    }
   
  }
  async preDm(){
    let index = _.findIndex(this.allSections,this.section[0])
    if(index==0){
      const toast = await this.toastController.create({
        message: '已到第一个断面',
        duration: 2000
      });
      toast.present();
    }else{
      index--
      this.section=[this.allSections[index]]
      this.sectionName=this.section[0].XSNM
     
      this.getMsnoData()
    }
  }
  waterChange(e){
    this.water = e.detail.value
   
    var xscd =_.toString(_.map(this.section,'XSCD'));
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
    
    this.httpService.getSixData(xscd, msno, value).then(res=>{
      
      if(res){
        let resData=JSON.parse(res)
        resData.msno=msno
        this.sixData=[]
        this.sixData[0]=resData
      }
    })
  }
  getSixs(xscd, msno, value){
      this.httpService.getSixsData(xscd, msno, value).then(res=>{
        if(res){
          this.sixData=JSON.parse(res)
        }
    })
  }
  searchData(){
    var xscd =_.toString(_.map(this.section,'XSCD'));
				var meaTimeLen = this.selectedMsno.length;
				var xsnm = this.sectionName;
        var msno = _.toString(this.selectedMsno);
        var titleText = '断面:' + xsnm;

        var xType = "value";
        var pama = {
          xscd: xscd,
          msno: msno,
        };
        let index,animal
        if (meaTimeLen && meaTimeLen > 1) {
          index=1
          animal=0
          this.btnFlag=true
				
          
				} else if (meaTimeLen && meaTimeLen == 1) {
          index=0
          this.btnFlag=false
				
	
				}
        this.httpService.getSectionData(pama).then(async res=>{
          let data = JSON.parse(res)
          if (index == 1) {
            if (data.series.length == 0) {
              // layer.msg('测次：' + msno + '</br>' + '断面：' + xscd + '</br>数据：无数据', {
              //   time: 1000
              // });
              const toast = await this.toastController.create({
                message: '该断面无数据',
                duration: 2000
              });
              toast.present();
            } else {
              
              var div = "chart";
              var map = {};
              for (var i = 0; i < data.series.length; i++) {
                var key = data.series[i].name;
                var value = data.series[i];
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
              
              map["minY"] = data.series[0].minY;
              var water= data.series[0].watermaxY
              this.minY= data.series[0].minY
              this.maxY= data.series[0].maxY
              this.water=Number(data.series[0].watermaxY)
            
              
              this.getSixs(xscd, msno,water)
  
  
            
              var cylist=data.cyList[0];
              if(animal==0){
                this.chart = this.unitsService.chartLines(map, div, xType, "起点距(m)", "高程(m)", titleText,'duanmian');
               
              }else{
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
            var div = "chart";
            var dmData = data.series;
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
                    if (dmData[0].dsan[i].dsnm == '9999'||dmData[0].dsan[i].dsnm == '断面平均') {
  
                      var inptds = dmData[0].dsan[i].inptds
                      zXaixArr.push([inptds, h])
                    } else {
                      var inptds = dmData[0].dsan[i].inptds
                      markXaixArr.push([inptds, h])
                    }
  
  
                  }
                }
                this.pjmodalFlag=true
                let dmFlag=_.findIndex(dmData[0].dsan, {'dsnm': '9999'})
                let dmFlagavg=_.findIndex(dmData[0].dsan, {'dsnm': '断面平均'})
									
									var dmindex={'dsnm':"9999"};
										if(dmFlag!=-1){
											dmindex={'dsnm':"9999"}
										}
										if(dmFlagavg!=-1){
											dmindex={'dsnm':'断面平均'}
										}
                this.pjmodalData=_.filter(dmData[0].dsan,dmindex)
                this.cxmodalFlag=true
                this.cxmodalData=_.filter(dmData[0].dsan,function(item){
                  return item.dsnm!=dmindex['dsnm']
                })
              }else{
                this.pjmodalFlag=false
                this.pjmodalData=[]
                this.cxmodalData=[]
                this.cxmodalFlag=false
              }
              if(dmData[0].dsannt) {
                
                for (var i = 0; i < dmData[0].dsannt.length; i++) {
                  if (_.findIndex(dmsanntlineArr, dmData[0].dsannt[i].dsnm)==-1) {
                    dmsanntlineArr.push(dmData[0].dsannt[i].dsnm)
                    var h = dmData[0].dsannt[i].h;
                    var inptds = dmData[0].dsannt[i].inptds
                    var dsnm=dmData[0].dsannt[i].dsnm
                    var dbd=dmData[0].dsannt[i].dbd
                    if (dmData[0].dsannt[i].dsnm == '9999'||dmData[0].dsan[i].dsnm == '断面平均') {
                      
                      zDANNTXaixArr.push([inptds, h,dsnm,dbd])
                    } else {
                      markDSANNTArr.push([inptds, h,dsnm,dbd])
                    }
  
  
                  }
                }
               
              }else{
               
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
