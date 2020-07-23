import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProviderService } from '../../../service/provider.service'

@Component({
  selector: 'app-water-and-sed-change',
  templateUrl: './water-and-sed-change.page.html',
  styleUrls: ['./water-and-sed-change.page.scss'],
})
export class WaterAndSedChangePage implements OnInit {
  titleName:string;
  chart:any
  constructor(
    public httpService:ProviderService,
    public activeRoute: ActivatedRoute,
  ) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if (params['object']) {
        let chartInfo = JSON.parse(params['object'])
        this.titleName=chartInfo.titleName
      }
    })
   }

  ngOnInit() {
    this.serarData()
  }
  serarData(){
    let waterOption={
        color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['2002年前', '2003-2017年', '2018年']
        },
        toolbox: {
            show: false,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                data: ['宜昌', '枝城', '沙市', '监利', '螺山','汉口','大通']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'径流量(亿m³)'
            }
        ],
        series: [
            {
                name: '2002年前',
                type: 'bar',
                barGap: 0,
                
                data: [320, 332, 301, 334, 390,366,410]
            },
            {
                name: '2003-2017年',
                type: 'bar',
                
                data: [220, 182, 191, 234, 290,230,240]
            },
            {
                name: '2018年',
                type: 'bar',
                
                data: [150, 232, 201, 154, 190,160,180]
            }
        ]
    
    }
    this.initEchart(waterOption,'waterchart')
    let sandOption={
      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {
          data: ['2002年前', '2003-2017年', '2018年']
      },
      toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
      },
      xAxis: [
          {
              type: 'category',
              axisTick: {show: false},
              data: ['宜昌', '枝城', '沙市', '监利', '螺山','汉口','大通']
          }
      ],
      yAxis: [
          {
              type: 'value',
              name:'输沙量(万t)'
          }
      ],
      series: [
          {
              name: '2002年前',
              type: 'bar',
              barGap: 0,
              
              data: [320, 332, 301, 334, 390,366,410]
          },
          {
              name: '2003-2017年',
              type: 'bar',
              
              data: [220, 182, 191, 234, 290,230,240]
          },
          {
              name: '2018年',
              type: 'bar',
              
              data: [150, 232, 201, 154, 190,160,180]
          }
      ]
    }
    this.initEchart(sandOption,'sandchart')
  }
  
  initEchart(option,id) {
    let ec = echarts as any;
    let container = document.getElementById(id);
    let chart = ec.init(container);
   
    if(option.series.length>0){
      chart.setOption(option);
      setTimeout(() => {
        chart.resize()
      }, 300);
      
      
    }
   
  }
}