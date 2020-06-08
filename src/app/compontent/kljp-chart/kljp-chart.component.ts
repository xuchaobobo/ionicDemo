import { Component, OnInit,Input,ChangeDetectorRef } from '@angular/core';
import {ModalController} from "@ionic/angular"
import { ProviderService } from './../../service/provider.service'
import * as _ from 'lodash';
@Component({
  selector: 'app-kljp-chart',
  templateUrl: './kljp-chart.component.html',
  styleUrls: ['./kljp-chart.component.scss'],
})
export class KljpChartComponent implements OnInit {
  @Input() data:any
  @Input() xscd:any
  @Input() xsnm:any
  slideList=[]
  constructor(
    public modal:ModalController,
    public httpServer:ProviderService,
    private cd: ChangeDetectorRef,
  ) {
    
   }

   ngOnInit() {
    this.inData()
    
  }

  initChart(id,option){
    let ec = echarts as any;
    let container = document.getElementById(id);
    let chart = ec.init(container);
    chart.clear()
    chart.setOption(option)
  }
  dissView(){
    this.modal.dismiss()
  }
 initChartList(){
   let that=this
   _.forEach(this.slideList,function(val,i){
    that.initChart(val.id,val.option)
  })
   
  
  }
  
  inData(){
    let xsnm=this.xsnm
    let arr=[]
    let xscd=this.xscd
    let that=this
    let dsnmArr=_.uniq(_.map(this.data,'dsnm'))
    _.forEach(dsnmArr,function(val,i){
      // ar yr = data[0]['yr']
      //   var md = data[0]['md']
      //   var dsnm = data[0]['dsnm']
      //   if(dbd[0]['dbd']!=null){
      //   $("#dbd").html("干容重："+dbd[0]['dbd']);
      //   }
      let dsnmData= _.filter(that.data,{'dsnm':val})

        var pamas = {
            xscd: xscd,
            yr: dsnmData[0].yr,
            md: dsnmData[0].md
        }
        that.httpServer.getDsannt(pamas).then(res=>{
          let datadn=JSON.parse(res)
          var ntdata = datadn.filter(function (item) {
            return item.dsnm == val
        })[0]
        var xAxisData = [],
            seriesData = []
        for (var i = 0; i < dsnmData.length; i++) {
            xAxisData.push(dsnmData[i].pd)
            seriesData.push([dsnmData[i].pd, dsnmData[i].p])
        }
        console.log(xAxisData, seriesData)
        var avpd='平均粒径:' + ntdata.avpd+'mm';
        var mxpd='最大粒径:' + ntdata.mxpd+'mm Dmax';
        var mdpd = '中值粒径:' + ntdata.mdpd+'mm D50'
        let ids='cx'+val
          
            let option={
              tooltip : {
                trigger : 'axis',
                hideDelay:2000,
                formatter:function(params){
                var str="<div class='_ec_tolltip'>";

                var xValue = params[0].value[0];
                // str+="<div><span class='_ec_title icon-bullet_green'>百分比：</span><span class='_ec_value'>"+parseFloat(xValue).toFixed(3)+"</span></div>";

                for(var i = 0;i<params.length;i++){
                  var name=params[i].seriesName
                  str+="<div><span class='_ec_title icon-bullet_yellow'>"+name+":</span><span class='_ec_value'>"+parseFloat(xValue).toFixed(3)+"mm -- "+params[i].value[1]+"%</span></div>";
                }

                str+="<div>";
                return str;

                }
                },
                grid : {
                  // top : 60,
                  // left : 80,
                  // right : 80,
                  // bottom : 20,
                  containLabel : true,
                  
                },
              xAxis: {
                  name: '粒径级(mm)',
                  gridIndex: 0,
                  scale: true,
                  nameLocation:'middle',
                  // min1,
                  // max: 1000,
                  // interval:xAxisData,
                  min:1,
                  type: "log",
                  // logBase: 5,
                  splitLine: {
                      show: false,
                      lineStyle: {
                          color: ['red'],
                          width: 1,
                          type: 'solid'
                      }
                  },
                  axisLabel:{
                      show:false
                  },
                  // data:xAxisData,
                  boundaryGap: false,
              },
              yAxis: {
                  name: '颗粒小于某粒径百分比(%)',
                  scale: true,
                  nameLocation:'middle',
                  nameTextStyle:{
                    lineHeight:60
                  },
                  splitLine: {
                      show: true,
                      // lineStyle: {
                      //     color: ['red'],
                      //     width: 1,
                      //     type: 'solid'
                      // }
                  },
                  boundaryGap: false,
              },
              series: [{
              name:xsnm,
                  data: seriesData,
                  type: 'line',
                  smooth : true,
                  // label: {
    // 		normal: {
    // 			show: true,
    // 			position: 'top'
    // 		}
    // 	},
                  markLine: {
                      symbol:'none',
        precision:3,
                      data: [
        
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
              }]


          }
          that.slideList.push({
            title:'垂线'+val,
            val:val,
            id:ids,
            avpd:avpd,
            mxpd:mxpd,
            mdpd:mdpd,
            option:option
          }) 
          // that.initChart(ids,option)
        })
      
    })
   this.cd.detectChanges();
    // this.slideList=arr
    // this.initChartList()

  }
  ionViewDidEnter(){
    let that=this
    setTimeout(function(){
    that.initChartList()},1000)
  }
  // ionViewDidEnter(){
  //   console.log(this.slideList)
  //   this.initChartList()
  // }
}
