import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ProviderService } from '../../../service/provider.service'

@Component({
  selector: 'app-prototype-chart',
  templateUrl: './prototype-chart.page.html',
  styleUrls: ['./prototype-chart.page.scss'],
})
export class PrototypeChartPage implements OnInit {
  public chart: any;
  titleName:any
  param:any
  
  constructor(
    public httpService:ProviderService,
    public activeRoute: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar
    ) {
    
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if(params['object']){
        let chartInfo=JSON.parse(params['object'])
        this.titleName=chartInfo.titleName
        this.param=chartInfo.param
        // console.log(chartInfo.option)
        let that=this
        this.httpService.getObservictionData(that.param).then(res=>{
          let json=JSON.parse(res).data
          let option={
            title: {
        
              text:'三峡水库蓄水以来坝前水位变化',
              textStyle:{
                color:'#ddd',
                fontWeight:300
              },
              left:'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            toolbox: {
              show: true,
              feature: {
                // saveAsImage: {}
              }
            },
            xAxis: {
              name:'时间',
              type: 'time',
              boundaryGap: false,
              data: []
            },
            yAxis: {
              type: 'value',
              name:'水位(m)',
              scale:true,
        
              axisLabel: {
                formatter: '{value}'
              },
              axisPointer: {
                snap: true
              }
            },
            visualMap: {
              show: false,
              dimension: 0,
            },
            series: [
              {
                name: '水位',
                type: 'line',
                symbolSize:0,
                smooth: true,
                symbol:false,
                data: json,
                scale:true,
                markArea: {
                  data: [ [{
                    name: '围堰蓄水期',
                    xAxis: '2003-06-14 00:00:00',
                    itemStyle:{
                      color:'#c60c30'
                    }
                  }, {
                    xAxis: '2006-09-20 00:00:00'
                  }], [{
                    name: '初期蓄水期',
                    xAxis: '2006-09-20 00:00:00',
                    // label:{
                    //   position:'inside'
                    // }
                  }, {
                    xAxis: '2008-10-09 00:00:00'
                  }] , [{
                    name: '试验性蓄水期',
                    xAxis: '2008-10-10 00:00:00',
                    itemStyle:{
                      color:'#25C50E'
                    }
                  }, {
                    xAxis: '2018-12-31 00:00:00'
                  }]]
                }
              }
            ]
          }
          
          
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    
          this.statusBar.hide();
          that.initEchart(option)
         
        }).catch(err=>{
          // alert(err)
        })
        
      }
    })
   }

  ngOnInit() {
    
    this.screenOrientation.onChange().subscribe(
      () => {
        // if(this.chart){
        //   alert(JSON.stringify(this.chart.getOption()))
        //   this.chart.resize()
        // }
          console.log("Orientation Changed");
      }
    );
    
  }
  ngAfterViewInit(){
   
  }
  ngAfterContentInit(){
    this.screenOrientation.unlock()
    this.statusBar.show();
    // setTimeout(function(){
    //   
    // },3000)
   
  }
  screenChange(){
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      this.statusBar.hide();
  }
  ngOnDestroy(){
    this.screenOrientation.unlock();
    this.statusBar.show();
  }
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('protoTypechart');
    this.chart = ec.init(container);
   
    if(option.series.length>0){
      this.chart.setOption(option);
      setTimeout(() => {
        this.chart.resize()
      }, 3000);
      
      
    }
    
    // 

    // detect orientation changes
   
  }
}
