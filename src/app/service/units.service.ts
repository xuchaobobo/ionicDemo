/*
 * @Author: your name
 * @Date: 2020-04-22 15:47:09
 * @LastEditTime: 2020-05-15 13:50:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\service\units.service.ts
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview'
import { ProviderService } from './provider.service'

// import { ConfigProvider } from '../config/config';
import { AlertController,LoadingController,Platform,ToastController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx'

@Injectable({
	providedIn: 'root'
})
export class UnitsService {
	chart: any;
	areaData
	gaeaTimer = {
		timer: null, //全局变量,暂停用。
		j: 0, //全局变量 继续用。
		start: function (options) { //开始方法
			var timenum = options.timenum; //总数 /区域= 时间次数
			this.gaeaTimer.timer = setInterval(function () {
				if (this.gaeaTimer.j < timenum) {
					if (!!options.task && $.isFunction(options.task)) options.task();
					this.gaeaTimer.j++; //记录次数 继续。
				} else {
					this.gaeaTimer.j = 0; //主要是让 开始重新继续。
				}
			}, options.interval || 3000);
		}, pause: function () { //暂停方法
			if (this.gaeaTimer.timer != null) {
				clearInterval(this.gaeaTimer.timer);
				this.gaeaTimer.timer = null;
			}
		}
	}
	constructor(
		public httpService: ProviderService,
		public alertCtrl:AlertController,
		public loadingCtrl:LoadingController,
		private transfer: FileTransfer,
		private file: File,
		private appVersion: AppVersion,
		private fileOpener:FileOpener,
		private androidPermissions: AndroidPermissions,
		public toastCtrl: ToastController,
		public platform: Platform
	) {
		// this.areaData=this.initAreaData()
		// console.log(this.areaData)
	}
  //检查版本更新
  new_version(callback){
    var url = 'http://www.test.com/test';
    return this.httpService.get(url).then(res=>{
		callback(res);
	})
  }



  /***** 自动更新APP版本  开始 ******************************/  
  public now_version = '';//当前版本
  public new_app = {//最新版本
    new_version: '',//版本号
    text : '',//更新简介
    url : '',//下载地址
  };

  public has_new : boolean = false;
  get_now_version(){
    var _that = this;
    this.appVersion.getVersionNumber().then(data=>{
      _that.now_version = data;
    });
    return _that.now_version
  }
  check_version(){
    var _that = this;

    //服务器端获取最新版
    this.new_version(data=>{
      _that.new_app.new_version = data.data.version;
      _that.new_app.text = data.data.text;
      _that.new_app.url =  data.data.file_url;
    });

    console.log('_that.new_app');
    console.log(_that.new_app);

    this.appVersion.getVersionNumber().then(data=>{
      _that.now_version = data;
    });

    console.log('_that.now_version = ' + _that.now_version);
  
    //当前版本
    let nowVersionNum = parseInt(this.now_version.toString().replace(new RegExp(/(\.)/g), '0')); 
    // alert('当前版本：'+nowVersionNum);
    let newVersionNum = parseInt(this.new_app.new_version.toString().replace(new RegExp(/(\.)/g), '0'));
    if(nowVersionNum < newVersionNum){
      this.has_new = true;
    }

    console.log('nowVersionNum = ' + nowVersionNum);
    console.log('newVersionNum = ' + newVersionNum);
  }

  async presentToast(message: string) {
    let toast = await this.toastCtrl.create({message: message, duration: 2000});
    await toast.present()
  }

  autoUpdateApp(){
    setTimeout(() => {

      this.appVersion.getVersionNumber().then(data=>{
        this.now_version = data;
      });
      //服务器端获取最新版
      this.new_version(data=>{
        this.new_app.new_version = data.data.version;
        this.new_app.text = data.data.text;
        this.new_app.url =  data.data.file_url;
        this.updateAPP()
      });

    }, 3000);
  }

  async updateAPP(){
    this.check_version()
    //当前版本
    let nowVersionNum = parseInt(this.now_version.toString().replace(new RegExp(/(\.)/g), '0')); 
    // alert('当前版本：'+nowVersionNum);
    let newVersionNum = parseInt(this.new_app.new_version.toString().replace(new RegExp(/(\.)/g), '0')); 
    // alert('最新版本：'+newVersionNum);
    if(nowVersionNum < newVersionNum){
          
      let confirm = await this.alertCtrl.create({
        header: '有新版本发布，是否下载更新？',
        message: this.new_app.text,
        buttons: [
          {
            text: '取消',
            handler: () => {
              console.log('Disagree clicked');
              // return false;
              this.check_version()
            }
          },
          {
            text: '确认',
            handler: () => {
              this.permissionsFun()
              //this.download();
            }
          }
        ]
      });
      await confirm.present();
    }else{
      this.presentToast('当前已是最新版本');
    }
    
  }

 async download(){
    if (this.isAndroid()) {
      var _that = this;
      const fileTransfer: FileTransferObject = this.transfer.create();
      
      //目录创建文件夹 new Date().getTime()
      this.file.createDir(this.file.externalRootDirectory, "martiantoken", false)
      let externalRootDirectory = this.file.externalRootDirectory + 'martiantoken/martiantoken.apk';
      console.log('this.new_app.url')
      console.log(this.new_app.url)

      console.log('externalRootDirectory')
      console.log(externalRootDirectory)


      let num :number = 1;
      fileTransfer.onProgress((event: ProgressEvent) => {
        num =Math.floor(event.loaded/event.total * 100);
      });
      
      let loading = await _that.loadingCtrl.create({
        message: '下载进度：'+ num + '%'
      });
     await loading.present(); 

      fileTransfer.download(this.new_app.url, externalRootDirectory).then((entry) => {
          // alert('下载成功: ' + entry.toURL());
          _that.fileOpener.open(entry.toURL(),'application/vnd.android.package-archive');
        }, async (error) => { 
          
          let confirm =await this.alertCtrl.create({
            header: '请开启存储权限',
            message: '权限被拒绝，请在手机设置里手动开启存储权限',
            buttons: [
              {
                text: '取消',
                handler: () => {
                  console.log('Disagree clicked');
                  // return false;
                  //this.check_version()
                  loading.dismiss();
                }
              },
              {
                text: '确认',
                handler: () => {
                  loading.dismiss();
                  this.download();
                }
              }
            ]
          });
          await confirm.present();
          
          return false;
        }
      );
    

      

      let timer = setInterval(() => {
          loading.append("下载进度：" + num + "%");
          if (num >= 99) {
              clearInterval(timer);
              loading.dismiss();
          }
      }, 300);

    }


    // if (this.isIos()) {
    //   this.openUrlByBrowser("这里边填写下载iOS地址");
    // }


  }


   //检查权限
   permissionsFun(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (!result.hasPermission){
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
            .then(result => {//弹出弹框是否允许
              if(result.hasPermission){//点击允许
                this.download();
                // alert("允许使用LOCATION权限");
              }else{//点击拒绝
                // alert("拒绝使用LOCATION权限");
                //this.platform.exitApp();//退出APP
              }
          });
        }else{
          this.download();
          // alert("已允许位置权限" + result.hasPermission);
        }
  
      },
      err => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      }
  
    );
  }


  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    //this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }
	chartLine(data, divName, xType, xName, yName, titleText, typet, ctype?) {
		if (!ctype) {
			ctype = 'count'
		}
		let stcdarrs = ''
		let ec = echarts as any;
		let container = document.getElementById(divName);
		this.chart = ec.init(container);

		this.chart.clear();
		// if(data.unit){
		// 	yName=data.unit
		// }
		var smooth = false;
		var maxminData = []
		let option = {
			title: {
				text: titleText,
				x: 'center',
				align: 'right'
			},
			legend: {
				orient: "horizontal",
				x: 'center',
				y: 20,
				type:'scroll',
				width:'50%',
				data: []
			},
			grid: {
				// bottom: 10,
				left:20,
				right:20,
				containLabel: true
			},
			toolbox: {
				orient: "vertical",
				y: "top",
				show: false,
				iconStyle: {
					borderColor: '#1E9FFF'
				},
				feature: {
					dataZoom: {
						show: true
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					selfButtons: {// 自定义按钮
						show: true,// 是否显示
						title: '保存为Excel', // 鼠标移动上去显示的文字
						icon: 'images/down.png', // 图标
						onclick: function (opData) {// 点击事件,这里的opData是chart的option信息

						}
					},
					saveAsImage: {
						show: true
					},

				}
			},
			tooltip: {
				trigger: 'axis',
				hideDelay: 2000,
				// formatter : function(params, ticket, callback) {
				// 	// params=_.uniqBy(params, function (e) {
				// 	// 	if(e.seriesId){
				// 	// 		return e.seriesId;
				// 	// 	}

				// 	//   })
				// 	var str = "<div class='_ec_tolltip'>";

				// 		if (xType == "category") {
				// 			str += "<div><span class='_ec_title icon-bullet_green'>"
				// 					+ xName
				// 					+ "：</span><span class='_ec_value'>"
				// 					+ params[0].name + "</span></div>";
				// 			for (var i = 0; i < params.length; i++) {
				// 				str += "<div><span class='_ec_title icon-bullet_yellow'>"
				// 						+ params[i].seriesName
				// 						+ "：</span><span class='_ec_value'>"
				// 						+ params[i].value + "</span></div>";
				// 			}
				// 		} else {
				// 			if(params[0].value.length>0){
				// 			var xValue = (xType=='time') ? moment(
				// 					params[0].value[0]).format("YYYY-MM-DD")
				// 					: params[0].value[0];
				// 			str += "<div><span class='_ec_title icon-bullet_green'>"
				// 					+ xName
				// 					+ "：</span><span class='_ec_value'>"
				// 					+ xValue + "</span></div>";
				// 			for (var i = 0; i < params.length; i++) {
				// 				str += "<div><span class='_ec_title icon-bullet_yellow'>"
				// 						+ params[i].seriesName
				// 						+ "：</span><span class='_ec_value'>"
				// 						+ params[i].value[1] + "</span></div>";
				// 			}
				// 		}else{
				// 				var xValue = (xType=='time') ? params[0].name
				// 					: params[0].value[0];
				// 					str += "<div><span class='_ec_title icon-bullet_green'>"
				// 							+ xName
				// 							+ "：</span><span class='_ec_value'>"
				// 							+ xValue + "</span></div>";
				// 					for (var i = 0; i < params.length; i++) {
				// 						str += "<div><span class='_ec_title icon-bullet_yellow'>"
				// 								+ params[i].seriesName
				// 								+ "：</span><span class='_ec_value'>"
				// 								+ params[i].value + "</span></div>";
				// 					}
				// 			}
				// 		}
				// 	str += "</div>";
				// 	return str;
				// }
			},
			xAxis: {
				type: xType,
				name: xName,
				// min: 0,
				// max: 300,
				minInterval: 0,
				axisLine: {
					onZero:false,
					lineStyle: {
						color: 'black',
						width: 2
					}
				},
				nameLocation:'middle',
				nameTextStyle:{
					lineHeight:60
				},
				axisLabel: {
					formatter: function (value, index) {
						if (xType == 'time') {
							let year =  moment(value).format("YYYY")
							let month= moment(value).format("MM-DD")
							return year + '\n' +month
						} else {
							return value
						}
					}
				},
				splitLine: {
					show: false
				},
				boundaryGap: false,
				data: []
			},
			yAxis: {
				type: "value",
				min: '',
				max: '',
				scale: true,
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2
					},
					onZero: false
				},
				boundaryGap: ['0%', '0%'],
				splitLine: {
					show: true
				},

				axisLabel: {
					align: 'right'
				},
				name: yName
			},
			series: []
		};
		var optionSeries = [];
		var lendData = [];
		var xData;
		var keys = [];
		if (ctype == "count") {
			var keysArr = []
			var keyDate = "";
			for (var key in data) {
				keys.push(key);
				var k = key.split(":");
				if (k.length > 1) {
					keyDate = k[1];
				}
			}
			if (keysArr.length > 2) {
				keys = [];
				for (var i = 0; i < keysArr.length - 1; i++) {
					keys.push(keysArr[i] + ":" + keyDate);
				}
			} else {
				keys = keys.sort();
			}
		} else if (ctype == "duanmian") {
			option.xAxis.minInterval = 1
			option.yAxis.splitLine.show = false
			for (var key in data) {
				keys.push(key);
			}
			if (keys.length == 1) {
				keys.push("");
			}
		} else {
			keys = stcdarrs.split(",");
		}
		for (var i = 0; i < keys.length - 1; i++) {
			if (keys[i] == 'waterLine') {
				var watertLineData = {
					data: data.waterLine,
					type: 'line',
					name: '水位',
					// smooth: true,
					symbol: 'circle',
					symbolSize: 5,
					showSymbol: false,
					lineStyle: {
						normal: {
							color: '#0184d5',
							width: 2
						}
					},
					areaStyle: {
						color:{
							type: 'linear',
							   x: 0,
							   y: 0,
							   x2: 0,
							   y2: 1,
							   colorStops: [{
								   offset: 0, color: 'rgba(1, 132, 213, 0.4)' // 0% 处的颜色
							   }, {
								   offset: 1, color: 'rgba(1, 132, 213, 0.1)' // 100% 处的颜色
							   }],
							   global: false // 缺省为 false
					   },
					   origin:'start',
					},
					itemStyle: {
						normal: {
							// color: '#0184d5',
							// borderColor: 'rgba(221, 220, 107, 0.1)',
							borderWidth: 12
						}
					},
					z: 1
				}
				optionSeries.push(watertLineData);
			}
			if (keys[i] == 'markXaixArr') {

				optionSeries.push(data['markXaixArr']);

			}
			if ((keys[i] == 'zhongXaix')) {
				optionSeries.push(data['zhongXaix']);
			}

			if (data[keys[i]].data && keys[i] != 'markXaixArr' && keys[i] != 'markDannt' && keys[i] != 'waterLine' && keys[i] != 'zhongXaix' && keys[i] != 'minAndmax') {
				if (data[keys[i]].data.length > 0) {
					var sData = {};
					if ((ctype == "duanmian") || keys[i] == 'duomine') {
						var dataAll = [];
						var dataX = [];
						var xmin = 0;
						var xmax = 0;

						if (data[keys[i]].xAxis) {
							for (var m = 0; m < data[keys[i]].xAxis.data.length; m++) {
								if (parseFloat(data[keys[i]].xAxis.data[m]) <= xmin) {
									xmin = data[keys[i]].xAxis.data[m];
								}
								if (parseFloat(data[keys[i]].xAxis.data[m]) >= xmax) {
									xmax = data[keys[i]].xAxis.data[m];
								}
							}
						}
						if (data[keys[i]].xAxis) {
							option.xAxis['min'] = xmin;
							option.xAxis['max'] = xmax;
						}

						sData = {
							data: data[keys[i]].data,
							itemStyle: data[keys[i]].itemStyle,
							name: data[keys[i]].name,
							type: data[keys[i]].type,
							// smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: false,
							lineStyle: {
								normal: {
									color: '#a0522d',
									width: 2
								}
							},

							areaStyle: {

								normal: {
									// color:{
									// 	image:'<img src="soilImg.jpg"/>',
									// 	repeat: 'repeat'
									// },
									color: 'rgb(150,120,80)',
									origin: 'start',
									opacity: 1,
								}
							},
							z: 2
						};

						var n = 0;
						var m = 0;
						for (let k in data.datas) {
							m++;
							var origin = "start";
							if (n++ == Object.keys(data.datas).length - 1) {
								origin = "end";
							}
							var a = data.datas[k];
							var sDataBB = {
								data: a,
								itemStyle: data[keys[i]].itemStyle,
								name: data[keys[i]].name,
								type: data[keys[i]].type,
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {
									normal: {
										color: '#0184d5',
										width: 2
									}
								},
								areaStyle: {
									normal: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: 'rgba(0, 216, 135, 0.4)'
										}, {
											offset: 0.8,
											color: 'rgba(0, 216, 135, 0.1)'
										}], false),
										shadowColor: 'rgba(0, 0, 0, 0.1)',
									}
								},

								z: 2
							};
							optionSeries.push(sDataBB);
						}
						if (data[keys[i]].name) {
							optionSeries.push(sData);
						}
					} else {
						let watertLineData;
						if (data.waterLine) {
							watertLineData = {
								data: data.waterLine,
								type: 'line',
								name: '水位',
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								areaStyle: {
									color:{
										type: 'linear',
										   x: 0,
										   y: 0,
										   x2: 0,
										   y2: 1,
										   colorStops: [{
											   offset: 0, color: 'rgba(1, 132, 213, 0.4)' // 0% 处的颜色
										   }, {
											   offset: 1, color: 'rgba(1, 132, 213, 0.1)' // 100% 处的颜色
										   }],
										   global: false // 缺省为 false
								   },
								   origin:'start',
								},
								z: 1
							}
							sData = {
								data: data[keys[i]].data,
								itemStyle: data[keys[i]].itemStyle,
								name: data[keys[i]].name,
								type: data[keys[i]].type,
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,

								areaStyle: {
									normal: {
										color: 'rgb(199,158,4)',
										origin: 'start',
										opacity: 1,
									}
								},
								z: 2
							};
							if (data['markXaixArr']) {

								optionSeries.push(data['markXaixArr']);
								optionSeries.push(data['zhongXaix']);
							}
							optionSeries.push(watertLineData);
							optionSeries.push(sData);
						} else {
							if (data[keys[i]].maxData) {
								var maxTime, minTime, maxData, minData;
								if (data[keys[i]].name.indexOf('年') != -1) {
									maxTime = (moment(data[keys[i]].maxTime).format("YYYY")).toString()
									minTime = (moment(data[keys[i]].minTime).format("YYYY")).toString()

								} else {
									maxTime = moment(data[keys[i]].maxTime).format("YYYY-MM")
									minTime = moment(data[keys[i]].minTime).format("YYYY-MM")
								}
								minData = (data[keys[i]].minData).toString()
								maxData = (data[keys[i]].maxData).toString()
								// option.yAxis.min = minData;
								// option.yAxis.max = maxData;
								sData = {
									data: data[keys[i]].data,
									// itemStyle : data[keys[i]].itemStyle,
									name: data[keys[i]].name,
									type: data[keys[i]].type,
									// smooth: true,
									symbol: 'circle',
									symbolSize: 5,
									showSymbol: false,
									// markPoint: {
									// 	symbol: 'pin',
									// 	data: [
									// 		{
									// 			coord: [maxTime, maxData],
									// 			value:maxData,
									// 			name: '最大值',

									// 		},
									// 		{
									// 			coord: [minTime, minData],
									// 			value:minData,
									// 			name: '最小值',
									// 		}
									// 	]
									// },
									// markLine: {
									// 	data: [
									// 		{type: 'average', name: '平均值'}
									// 	]
									// },
									lineStyle: {

										normal: {
											// color:  map_ops.RandomColor(),
											width: 2
										}
									},

								};
							} else {
								sData = {
									data: data[keys[i]].data,
									// itemStyle : data[keys[i]].itemStyle,
									name: data[keys[i]].name,
									type: data[keys[i]].type,
									// smooth: true,

									symbol: 'circle',
									symbolSize: 5,
									showSymbol: false,
									// markPoint: {
									// 	data: [
									// 		{type: 'max', name: '最大值'},
									// 		{type: 'min', name: '最小值'}
									// 	]
									// },
									// markLine: {
									// 	data: [
									// 		{type: 'average', name: '平均值'}
									// 	]
									// },
									// areaStyle: {},

								};
							}
							optionSeries.push(sData);
						}
					}
				}
				if (data[keys[i]].data.length > 0) {
					if (data[keys[i]].xAxis) {
						xData = (xType == "category") ? data[keys[i]].xAxis.data : "";
					}

				}
			}

			if (data[keys[i]].name) {
				lendData.push({ 'name': data[keys[i]].name });
			}
		}
		option.series = optionSeries;
		option.legend.data = lendData;
		option.yAxis.min = data.minY ? data.minY : 'dataMin';
		option.yAxis.max = data.maxY ? data.maxY : 'dataMax';
		option.xAxis.type = xType;

		if (xType == "category") {
			option.xAxis.data = xData;
		}
		if (option.series.length > 0) {
			this.chart.setOption(option);
			this.chart.resize();
		}


		return this.chart
	}
	chartLines(data, divName, xType, xName, yName, titleText, ctype?) {
		if (!ctype) {
			ctype = 'count'
		}
		let stcdarrs = ''
		let smoothFlag = false
		let ec = echarts as any;
		let container = document.getElementById(divName);
		this.chart = ec.init(container);
		this.chart.clear()
		if (data.unit) {
			yName = data.unit
		}
		var smooth = false;
		if (smoothFlag) {
			smooth = true;
		}
		var option = {
			title: {
				text: titleText,
				x: 'center',
				align: 'right'
			},
			legend: {
				orient: "horizontal",
				x: 150,
				y: 40,
				data: []
			},
			toolbox: {
				orient: "vertical",
				y: "top",
				iconStyle: {

					borderColor: '#1E9FFF'
				},
				show: true,
				feature: {
					dataZoom: { show: true },
					magicType: { show: true, type: ['line', 'bar'] },
					restore: { show: true },
					selfButtons: {//自定义按钮
						show: true,//是否显示    
						title: '保存为Excel', //鼠标移动上去显示的文字  
						icon: 'images/down.png', //图标  
						onclick: function (opData) {//点击事件,这里的opData是chart的option信息   

						}
					},
					saveAsImage: { show: true },

				}
			},
			dataZoom: [{
				type: 'slider',
				filterMode: 'none',
				height: 8,
				bottom: 20,
				borderColor: 'transparent',
				backgroundColor: '#e2e2e2',
				handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
				handleSize: 20,
				handleStyle: {
					shadowBlur: 6,
					shadowOffsetX: 1,
					shadowOffsetY: 2,
					shadowColor: '#aaa'
				}
			}, {
				type: 'inside',
				filterMode: 'none'
			}],
			tooltip: {
				trigger: 'axis',
				hideDelay: 2000,
				formatter: function (params) {
					var str = "<div class='_ec_tolltip'>";
					if (xType == "category") {
						for (var i = 0; i < params.length; i++) {
							str += "<div><span class='_ec_title icon-bullet_yellow'>" + params[i].seriesName + "：</span><span class='_ec_value'>" + xName + ":" + params[i].value[0] + "," + yName + ":" + params[i].value[1] + "</span></div>";
						}
					} else {
						var xValue = (xName == "时间") ? moment(params[0].value[0]).format("YYYY-MM-DD") : params[0].value[0];
						str += "<div><span class='_ec_title icon-bullet_green'>" + xName + "：</span><span class='_ec_value'>" + xValue + "</span></div>";
						for (var i = 0; i < params.length; i++) {
							str += "<div><span class='_ec_title icon-bullet_yellow'>" + params[i].seriesName + "：</span><span class='_ec_value'>" + params[i].value[1] + "</span></div>";
						}
					}
					str += "<div>";
					return str;

				}
			},
			xAxis: {
				type: '',
				scale: true,
				axisLine: {
				},
				splitLine: {
					show: false
				},
				name: xName
			},
			yAxis: {
				min: '',
				axisLine: {
					onZero: false
				},
				splitLine: {
					show: false
				},
				scale: true,
				name: yName
			},
			series: []
		};
		var optionSeries = [];
		var lendData = [];
		var xData;
		var keys = [];
		var keysArr = stcdarrs.split(",");
		var keyDate = "";
		for (var key in data) {
			keys.push(key);
			var k = key.split(":");
			if (k.length > 1) {
				keyDate = k[1];
			}
		}
		if (keysArr.length > 2) {
			keys = [];
			for (var i = 0; i < keysArr.length - 1; i++) {
				keys.push(keysArr[i] + ":" + keyDate);
			}
		} else {
			keys = keys.sort();
		}
		for (var i = 0; i < keys.length; i++) {
			if (data[keys[i]].data) {
				if (data[keys[i]].data.length > 0) {
					var sData = {};
					if (data.waterLine) {
						sData = {
							data: data[keys[i]].data,
							itemStyle: data[keys[i]].itemStyle,
							name: data[keys[i]].name,
							type: data[keys[i]].type,
							// smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: false,
							lineStyle: {
								normal: {
									color: '#0184d5',
									width: 2
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(1, 132, 213, 0.4)'
									}, {
										offset: 0.8,
										color: 'rgba(1, 132, 213, 0.1)'
									}], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
								}
							},

							z: 2
						};
					} else {
						sData = {
							data: data[keys[i]].data,
							itemStyle: data[keys[i]].itemStyle,
							name: data[keys[i]].name,
							type: data[keys[i]].type,
							// smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: false
						};
					}
					optionSeries.push(sData);
				}
				if (data[keys[i]].data.length > 0) {
					xData = (xType == "category") ? data[keys[i]].xAxis.data : "";
				}
			}
			if (data[keys[i]].name) {
				lendData.push({ 'name': data[keys[i]].name });
			}
		}
		option.series = optionSeries;
		option.legend.data = lendData;
		option.yAxis.min = data.minY;
		option.xAxis.type = xType;
		if (option.series.length > 0) {
			this.chart.setOption(option);
			this.chart.resize();


		} else {

		}
		return this.chart
	}
	doLineData(data, xType) {
		let ctype = "count";
		let stcdarrs = ''

		var obj = Object()
		var optionSeries = [];
		var lendData = [];
		var xData;
		var divName;
		var keys = [];
		var smooth = false;
		if (ctype == "count") {
			var keysArr = stcdarrs.split(",");
			var keyDate = "";
			for (var key in data) {
				keys.push(key);
				var k = key.split(":");
				if (k.length > 1) {
					keyDate = k[1];
				}
			}
			if (keysArr.length > 2) {
				keys = [];
				for (var i = 0; i < keysArr.length - 1; i++) {
					keys.push(keysArr[i] + ":" + keyDate);
				}
			} else {
				keys = keys.sort();
			}
		} else if (ctype == "duanmian") {
			for (var key in data) {
				keys.push(key);
			}
			if (keys.length == 1) {
				keys.push("");
			}
		} else {
			keys = stcdarrs.split(",");
		}

		for (var i = 0; i < keys.length - 1; i++) {
			if (data[keys[i]].data) {
				if (data[keys[i]].data.length > 0) {
					var sData = {};
					if (ctype == "duanmian" && divName == "main") {
						var dataAll = [];
						var dataX = [];
						var xmin = 0;
						var xmax = 0;

						if (data[keys[i]].xAxis) {
							for (var m = 0; m < data[keys[i]].xAxis.data.length; m++) {
								if (parseFloat(data[keys[i]].xAxis.data[m]) <= xmin) {
									xmin = data[keys[i]].xAxis.data[m];
								}
								if (parseFloat(data[keys[i]].xAxis.data[m]) >= xmax) {
									xmax = data[keys[i]].xAxis.data[m];
								}

								// dataX.push([data[keys[i]].xAxis.data[m],data.waterLine[m]])
							}
						}

						/*
						 * for(var m=0;m<data[keys[i]].data.length;m++){
						 * if(data[keys[i]].xAxis){
						 * dataAll.push([data[keys[i]].xAxis.data[m],data[keys[i]].data[m]]); } }
						 */

						// if (data[keys[i]].xAxis) {
						// 	option.xAxis.min = xmin;
						// 	option.xAxis.max = xmax;
						// }
						var watertLineData = {
							data: data.waterLine,
							type: 'line',
							// symbol:"none",
							// smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: false,
							lineStyle: {

								normal: {
									color: '#0184d5',
									width: 2
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(1, 132, 213, 0.4)'
									}, {
										offset: 0.8,
										color: 'rgba(1, 132, 213, 0.1)'
									}], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
								}
							},
							itemStyle: {
								normal: {
									color: '#0184d5',
									borderColor: 'rgba(221, 220, 107, .1)',
									borderWidth: 12
								}
							},
							z: 1
						}
						sData = {
							data: data[keys[i]].data,
							itemStyle: data[keys[i]].itemStyle,
							name: data[keys[i]].name,
							type: data[keys[i]].type,
							// symbol:"none",
							// smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: false,
							lineStyle: {

								normal: {
									color: '#0184d5',
									width: 2
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(1, 132, 213, 0.4)'
									}, {
										offset: 0.8,
										color: 'rgba(1, 132, 213, 0.1)'
									}], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
								}
							},

							z: 2
						};
						/*
						 * if(data.newDataBB){
						 * optionSeries.push(data.newDataBB); }
						 */
						var n = 0;
						var m = 0;
						for (let k in data.datas) {


							var color = ['rgba(1, 132, 213, 0.4)', 'rgba(120, 132, 213, 0.4)']
							var color1 = ['rgba(1, 132, 213, 0.1)', 'rgba(120, 132, 213, 0.1)']
							var origin = "start";
							if (n++ == Object.keys(data.datas).length - 1) {
								origin = "end";
							}

							var a = data.datas[k];
							var sDataBB = {
								data: a,
								itemStyle: data[keys[i]].itemStyle,
								name: data[keys[i]].name,
								type: data[keys[i]].type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {

									normal: {
										color: '#0184d5',
										width: 2
									}
								},
								areaStyle: {
									normal: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: color[m]
										}, {
											offset: 0.8,
											color: color1[m]
										}], false),
										shadowColor: color1[m],
									}
								},

								z: 2
							};
							optionSeries.push(sDataBB);
							m++
						}
						if (data[keys[i]].name) {
							optionSeries.push(watertLineData);
							optionSeries.push(sData);
						}

					} else {
						let watertLineData;
						if (data.waterLine) {
							watertLineData = {
								data: data.waterLine,
								type: 'line',
								name: '水位',
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {

									normal: {
										color: '#0184d5',
										width: 2
									}
								},
								areaStyle: {
									normal: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: 'rgba(1, 132, 213, 0.4)'
										}, {
											offset: 0.8,
											color: 'rgba(1, 132, 213, 0.1)'
										}], false),
										shadowColor: 'rgba(0, 0, 0, 0.1)',
									}
								},
								itemStyle: {
									normal: {
										color: '#0184d5',
										borderColor: 'rgba(221, 220, 107, .1)',
										borderWidth: 12
									}
								},
								z: 1
							}
							sData = {
								data: data[keys[i]].data,
								itemStyle: data[keys[i]].itemStyle,
								name: data[keys[i]].name,
								type: data[keys[i]].type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {

									normal: {
										color: '#0184d5',
										width: 2
									}
								},
								areaStyle: {
									normal: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: 'rgba(1, 132, 213, 0.4)'
										}, {
											offset: 0.8,
											color: 'rgba(1, 132, 213, 0.1)'
										}], false),
										shadowColor: 'rgba(0, 0, 0, 0.1)',
									}
								},

								z: 2
							};
							optionSeries.push(watertLineData);
							optionSeries.push(sData);
						} else {
							sData = {
								data: data[keys[i]].data,
								itemStyle: data[keys[i]].itemStyle,
								name: data[keys[i]].name,
								type: data[keys[i]].type,
								// symbol:"none",

								//  smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
							};
							optionSeries.push(sData);
						}
					}
				}
				if (data[keys[i]].data.length > 0) {
					if (data[keys[i]].xAxis) {
						xData = (xType == "category") ? data[keys[i]].xAxis.data : "";
					}

				}
			}
			if (data[keys[i]].name) {
				lendData.push(data[keys[i]].name);
			}
		}
		// option.symbol='none';
		obj.series = optionSeries;
		obj.data = lendData;

		obj.type = xType;
		return obj
	}
	getLineData(url, stcds, startTime, endTime, stationNames, type) {
		var dataist = {};
		// $.ajax({
		// 	type : "POST",
		// 	url : url,
		// 	 async: false,
		// 	data : {
		// 		"stcds":stcds,
		// 		'startTime':startTime,
		// 		'endTime':endTime,
		// 		'stationNames':stationNames,
		// 		"type" : type
		// 	},
		// 	dataType : "json",

		// 	success : function success(msg) {
		// 		dataist=msg
		// 		}
		//        })
		return dataist
	}
	async initAreaData() {
		let arrdata = await this.httpService.getAllAreas().then(res => {
			var areaArr = [];
			res = JSON.parse(res)

			_.forEach(res, function (val, i) {
				var obj = {

				};
				if (val.length >= 1) {
					var arr = []
					for (let i = 0; i < val.length; i++) {

						if (val[i].area2 != null) {

							val[i]['text'] = val[i].area2;
							val[i]['value'] = val[i].area2
							val[i]['pid'] = 0
							val[i]['checked'] = false
							arr.push(val[i])
						} else {
							val[i]['text'] = val[i].area1;
							val[i]['value'] = val[i].area1
							val[i]['pid'] = 1
							if (val[i].area1 == '三峡库区') {
								val[i]['checked'] = true
							} else {
								val[i]['checked'] = false
							}

							obj = val[i]
						}
					}
					obj['children'] = arr
				}
				areaArr.push(obj)
			})

			// this.fenqu = '[{"startdist":2656492,"endist":1861000}]'
			// this.initRiverAndStation(this.fenqu)

			this.areaData = areaArr

			// this.initTree('#myZtree', areaArr);
		})

	}
	getAreas(): TreeviewItem[] {


		let vegetableCategory: any;
		this.httpService.getAllAreas().then(async res => {
			var areaArr = [];
			res = JSON.parse(res)

			_.forEach(res, function (val, i) {
				var obj = {

				};
				if (val.length >= 1) {
					var arr = []
					for (let i = 0; i < val.length; i++) {

						if (val[i].area2 != null) {

							val[i]['text'] = val[i].area2;
							val[i]['value'] = val[i].area2
							val[i]['pid'] = 0
							val[i]['checked'] = false
							arr.push(val[i])
						} else {
							val[i]['text'] = val[i].area1;
							val[i]['value'] = val[i].area1
							val[i]['pid'] = 1
							if (val[i].area1 == '三峡库区') {
								val[i]['checked'] = true
							} else {
								val[i]['checked'] = false
							}

							obj = val[i]
						}
					}
					obj['children'] = arr
				}
				areaArr.push(obj)
			})

			// this.fenqu = '[{"startdist":2656492,"endist":1861000}]'
			// this.initRiverAndStation(this.fenqu)

			this.areaData = areaArr
			return vegetableCategory = new TreeviewItem({
				text: '全部分区', value: 2, children: areaArr
			})
			// this.initTree('#myZtree', areaArr);
		})

		console.log(vegetableCategory.children)
		// vegetableCategory.children=
		// vegetableCategory.correctChecked(); 
		return [vegetableCategory];
	}
	getDayNumByYearMonth(year, month) {
		let day=31
		year = Number(year)
		month=Number(month)
		switch (month) {
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				day=31
			case 4:
			case 6:
			case 9:
			case 11:
				day=30
				
			case 2:
				if(this.isLeapYear(year)){
					day=29
				}else{
					day=28
				}
				
		}
		return day
	}
	isLeapYear(year) {
		if (year / 4 == 0 && year / 100 != 0) {
			return true;
		} else if (year / 400 == 0) {
			return true;
		} else {
			return false;
		}
	}
}
