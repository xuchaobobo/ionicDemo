import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProviderService } from '../../../service/provider.service'

@Component({
  selector: 'app-sand-weight',
  templateUrl: './sand-weight.page.html',
  styleUrls: ['./sand-weight.page.scss'],
})
export class SandWeightPage implements OnInit {
  titleName: any
  dataUrl:string

  constructor(
    public httpService: ProviderService,
    public activeRoute: ActivatedRoute,
  ) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if (params['object']) {
        let chartInfo = JSON.parse(params['object'])
        this.titleName = chartInfo.titleName
        this.dataUrl=chartInfo.dataUrl
      }
    })
  }

  ngOnInit() {
    this.searchData()
  }
  searchData() {

    var labelOption = {
      show: true,

      formatter: '{c}',
      fontSize: 16,
      rich: {
        name: {
          textBorderColor: '#fff'
        }
      }
    };

    let option = {
      title: {
        // text: '交错正负轴标签',
        // subtext: 'From ExcelHome',
        // sublink: 'http://e.weibo.com/1341556070/AjwF2AgQm'
      },
      legend: {
        data: ['<0.031', '>0.125', '0.031<0.125']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: 50,
        right:100,
        bottom: 50
      },
      xAxis: {
        type: 'value',
        position: 'bottom',
        max:100,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: [{
        type: 'category',
        data: ['宜昌', '黄陵庙', '万县','清溪场', '武隆', '寸滩', '北碚', '朱沱']
    },{
        yAxisIndex:1,
        type: 'category',
        axisTick:{
          show:false
      },
        data: ['2018', '2013-2017','三峡蓄水前' ,'2018', '2013-2017','三峡蓄水前' ,'2018', '2013-2017','三峡蓄水前' ,'2018', '2013-2017','三峡蓄水前' ,'2018', '2013-2017','三峡蓄水前' ,'2018', '2013-2017','三峡蓄水前' ,'2018', '2013-2017','三峡蓄水前' ,'2018', '2013-2017','三峡蓄水前' ]
    }],
      series: [
        {
          name: '<0.031',
          type: 'bar',
          stack: '三峡蓄水前',
          label: labelOption,
          itemStyle: {
            normal: { color: "#3FBB49" },
          },
          data: [0.4, 0.6, 0.4,0.4, 0.6, 0.4, 0.6, 0.4]
        },
        {
          name: '>0.125',
          type: 'bar',
          stack: '三峡蓄水前',
          label: labelOption,
          itemStyle: {
            normal: { color: "#006699" },
          },
          data: [0.3, 0.2, 0.3,0.3, 0.2, 0.3,0.2, 0.3]
        },
        {
          name: '0.031<0.125',
          type: 'bar',
          stack: '三峡蓄水前',
          label: labelOption,
          itemStyle: {
            normal: { color: "#4cabce" },
          },
          data: [0.3, 0.2, 0.3,0.3, 0.2, 0.3, 0.2, 0.3]
        },
        {
          name: '<0.031',
          type: 'bar',
          stack: '2013-2017',
          label: labelOption,
          itemStyle: {
            normal: { color: "#3FBB49" },
          },
          data: [0.2, 0.3, 0.2,0.2, 0.3, 0.2, 0.3, 0.2]
        },
        {
          name: '>0.125',
          type: 'bar',
          stack: '2013-2017',
          label: labelOption,
          itemStyle: {
            normal: { color: "#006699" },
          },
          data: [0.4, 0.5, 0.5,0.4, 0.5, 0.5, 0.5, 0.5]
        },
        {
          name: '0.031<0.125',
          type: 'bar',
          stack: '2013-2017',
          label: labelOption,
          itemStyle: {
            normal: { color: "#4cabce" },
          },
          data: [0.4, 0.2, 0.3,0.4, 0.2, 0.3, 0.2, 0.3]
        }, {
          name: '<0.031',
          type: 'bar',
          stack: '2018',
          itemStyle: {
            normal: { color: "#3FBB49" },
          },
          label: labelOption,
          data: [0.7, 0.4, 0.2,0.7, 0.4, 0.2, 0.4, 0.2]
        }
        , {
          name: '>0.125',
          type: 'bar',
          stack: '2018',
          itemStyle: {
            normal: { color: "#006699" },
          },
          label: labelOption,
          data: [0.2, 0.3, 0.6,0.2, 0.3, 0.6, 0.3, 0.6]
        }, {
          name: '0.031<0.125',
          type: 'bar',
          stack: '2018',
          label: labelOption,
          itemStyle: {
            normal: { color: "#4cabce" },
          },
          data: [0.1, 0.3, 0.2,0.1, 0.3, 0.2, 0.3, 0.2]
        }
      ]
    }
    this.httpService.queryGrainCompositionChart(this.dataUrl).then(res=>{
      let json=JSON.parse(res)
      console.log(json)
      option.yAxis[0].data=json.names
      option.yAxis[1].data=json.yearList
      option.series=json.series
      console.log(option)
      this.initEchart(option, 'sandWeightChart')
    })
    
  }
  initEchart(option, id) {
    let ec = echarts as any;
    let container = document.getElementById(id);
    let chart = ec.init(container);

    if (option.series.length > 0) {
      chart.setOption(option);
      setTimeout(() => {
        chart.resize()
      }, 300);


    }

  }
}
