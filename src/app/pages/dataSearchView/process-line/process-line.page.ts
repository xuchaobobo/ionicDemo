import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'
import { ProviderService } from '../../../service/provider.service'
import { UnitsService } from '../../../service/units.service'
import { AppConfig } from '../../../api.config'
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
	selector: 'app-process-line',
	templateUrl: './process-line.page.html',
	styleUrls: ['./process-line.page.scss'],
})
export class ProcessLinePage implements OnInit {

	titles: any = '过程线';
	types = ['Z', 'CS']
	typeObj = {
		'Z': '水位',
		'Q': '流量',
		'WTMP': '水温',
		'QS': '输沙量',
		'CS': '含沙量',
	}
	seleceList: any = [
		{
			'name': '水位',
			'value': 'Z',
			'id': '1',
			'flag': true
		},
		{
			'name': '流量',
			'value': 'Q',
			'id': '2',
			'flag': false
		},
		{
			'name': '含沙量',
			'value': 'CS',
			'id': '6',
			'flag': true
		},
		{
			'name': '输沙率',
			'value': 'QS',
			'id': '5',
			'flag': false
		},
		{
			'name': '水温',
			'value': 'WTMP',
			'id': '3',
			'flag': false
		},
		
		
	]
	station: any;
	stcds:any
	stationName;
	dateType = 'day'
	area='金沙江下游'
  	river='长江'
	startDay;//声明日期
	endDay;
	min;
	max;
	forYear = 'YYYY'
	disMonth = 'YYYY-MM'
	picMonth = 'YYYY MM'
	disDay = 'YYYY-MM-DD'
	picDay = 'YYYY MM DD'
	startDisTime = this.disDay
	endDisTime = this.disDay
	startPicTime = this.picDay
	endPicTime = this.picDay
	maxAndMinList=[];
	public chart: any;
	constructor(
		public modalController: ModalController,
		public toastController: ToastController,
		public httpService: ProviderService,
		public unitService: UnitsService,
		public activeRoute: ActivatedRoute
	) {
		
		let year=parseInt(AppConfig.year)
		let lastYear=AppConfig.lastYear
		let dataStart=(parseInt(AppConfig.lastYear)-year+1).toString()
		let nowYear=moment(new Date(Date.now())).format('YYYY')
		this.startDay = moment().startOf('year').format('YYYY-MM-DD').toString().replace(nowYear,lastYear);
		this.endDay = moment(new Date(Date.now())).format('YYYY-MM-DD').replace(nowYear,lastYear);
		
		this.min=moment(new Date(Date.now())).format('YYYY-MM-DD').replace(nowYear,dataStart);
		this.max=this.endDay
		this.station = [{
			stcd: "60104800",
			stnm: "朱沱(三)",
			stct: null,
			bshncd: null,
			hnnm: null,
			rvnm: "长江",
			obitmcd: null
		}]
		this.stationName = "朱沱(三)"
		this.activeRoute.queryParams.subscribe((params: Params) => {
			if(params['object']){
			  let stationInfo=JSON.parse(params['object'])
			  this.station[0].stcd = stationInfo['STCD'];
			  this.station[0].stnm = stationInfo['STNM'];
			  this.stationName= stationInfo['STNM']
			}
			
		  });
		
	}
	async selectSation() {

		const modal = await this.modalController.create({
			component: StationSelectComponent,
			cssClass: 'station_elect',
			componentProps: {
				types: this.types,
				typeLen: this.types.length,
				defaultArea:this.area,
				defaultRiver:this.river,
				defaultStation: this.station
			}
		})
		await modal.present();
		const { data } = await modal.onDidDismiss();
		this.station = data.selectStation
		this.area=data.selectarea
		this.river=data.selectriver
		this.stationName = _.map(data.selectStation, 'stnm').join(',')
		console.log(data);
	}
	//自定义option，用来汉化日期
	public customPickerOptions = {

		buttons: [{
			text: '取消',
			handler: () => console.log('Clicked 取消!')
		}, {
			text: '确认',
			handler: () => {

			}
		}]
	}
	ngOnInit() {
		this.doProcessLine()
	}
	charAvgtLine(data, divName, xType, xName, yName, titleText, typet) {
		let ec = echarts as any;
		let container = document.getElementById(divName);
		this.chart = ec.init(container);
		this.chart.clear();
		let smooth = false;
		if (data.unit) {
			yName = data.unit
		}
		var maxminData = []
		let option = {
			title: {
				text: titleText,
				x: 'center',
				align: 'right'
			},
			grid: {
				bottom: 10,
				left:20,
				right:20,
				containLabel: true
			},
			legend: {
				orient: "horizontal",
				// x : 150,
				x: 'center',
				y: 20,
				data: []
			},
			toolbox: {
				orient: "vertical",
				y: "top",
				show: false,
				// show: true,
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
				formatter: function (params, ticket, callback) {
					let str = "<div class='_ec_tolltip'>";

					if (xType == "category") {
						str += "<div><span class='_ec_title icon-bullet_green'>"
							+ xName
							+ "：</span><span class='_ec_value'>"
							+ params[0].name + "</span></div>";
						for (var i = 0; i < params.length; i++) {
							str += "<div><span class='_ec_title icon-bullet_yellow'>"
								+ params[i].seriesName
								+ "：</span><span class='_ec_value'>"
								+ params[i].value + "</span></div>";
						}
					} else {
						var xValue = (xName == "时间") ? moment(
							params[0].value[0]).format("YYYY-MM-DD")
							: params[0].value[0];
						str += "<div><span class='_ec_title icon-bullet_green'>"
							+ xName
							+ "：</span><span class='_ec_value'>"
							+ xValue + "</span></div>";
						for (var i = 0; i < params.length; i++) {
							str += "<div><span class='_ec_title icon-bullet_yellow'>"
								+ params[i].seriesName
								+ "：</span><span class='_ec_value'>"
								+ params[i].value[1] + "</span></div>";
						}
					}



					str += "</div>";
					// myChart.resize();
					return str;

				}
			},
			xAxis: {

				type: xType,
				name: xName,
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2
					},
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
				data: [],
			},
			yAxis: {
				type: "value",
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2
					},
				},
				boundaryGap: ['0%', '0%'],
				splitLine: {
					show: false
				},
				axisLabel: {
					align: 'right'
				},
				name: yName,
				// splitNumber:1,
				scale: true
			},
			series: []
		};
		var optionSeries = [];
		var lendData = [];
		var xData;
		var ctype = 'count'
		var keys = [];
		if (ctype == "count") {
			var keysArr = this.stcds;
			var keyDate = "";
			for (var key in data) {
				keys.push(key);
				var k = key.split(":");
				if (k.length > 1) {
					keyDate = k[1];
				}
			}
			// if (keysArr.length > 2) {
			// 	keys = [];
			// 	for (var i = 0; i < keysArr.length - 1; i++) {
			// 		keys.push(keysArr[i] + ":" + keyDate);
			// 	}
			// } else {
			// 	keys = keys.sort();
			// }
		} else {
			keys = this.stcds;
		}
		var xAxisdata;
		for (var i = 0; i < keys.length ; i++) {
			if (data[keys[i]].avg) {
				_.forEach(data[keys[i]], function (val,j) {
					var sData = {};
					var sname;
					if (j == 'avg') {
						sname = val.name + '平均值';
						var seardatas = []
						var xAdata = val.xAxis.data
						if(xAdata.length>0&&val.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push(xAdata[m])
							}
							sData = {
								data: val.data,
								itemStyle: val.itemStyle,
								name: sname,
								scale: true,
								type: val.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {
	
									normal: {
										// color:  map_ops.RandomColor(),
										width: 2
									}
								},
	
							};
							optionSeries.push(sData);
							lendData.push({ 'name': sname });
							xAxisdata = seardatas
						}
						
						
					}


				})




			}

		}

		// option.symbol='none';
		option.series = optionSeries;
		option.legend.data = lendData;

		option.xAxis.type = 'category';
		// option.xAxis.inverse=true;
		// option.xAxis.nameLocation='start';
		option.xAxis.data = xAxisdata;

		if (option.series.length > 0) {

			this.chart.setOption(option);
			this.chart.resize();

		} else {


		}
		return this.chart
	}
	charSantLine(data, divName, xType, xName, yName, titleText, typet) {
		let ec = echarts as any;
		let container = document.getElementById(divName);
		this.chart = ec.init(container);
		this.chart.clear();
		var smooth = false;
		//		if (smoothFlag) {
		//			smooth = true;
		//		}
		if (data.unit) {
			yName = data.unit
		}
		var maxminData = []
		var option = {
			title: {
				text: titleText,
				x: 'center',
				align: 'right',
				// textStyle:{
				// 	color :'white',
				// }
			},
			legend: {
				orient: "horizontal",
				// x : 150,
				x: 'center',
				y:20,
				data: []
			},
			grid: {
				bottom: 10,
				left:20,
				right:20,
				containLabel: true
			},
			toolbox: {
				orient: "vertical",
				y: "top",
				show: false,
				// show: true,
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
				formatter: function (params, ticket, callback) {
					var str = "<div class='_ec_tolltip'>";

					if (xType == "category") {
						str += "<div><span class='_ec_title icon-bullet_green'>"
							+ xName
							+ "：</span><span class='_ec_value'>"
							+ params[0].name + "</span></div>";
						for (var i = 0; i < params.length; i++) {
							str += "<div><span class='_ec_title icon-bullet_yellow'>"
								+ params[i].seriesName
								+ "：</span><span class='_ec_value'>"
								+ params[i].value + "</span></div>";
						}
					} else {
						var xValue = (xName == "时间") ? moment(
							params[0].value[0]).format("YYYY-MM-DD")
							: params[0].value[0];
						str += "<div><span class='_ec_title icon-bullet_green'>"
							+ xName
							+ "：</span><span class='_ec_value'>"
							+ xValue + "</span></div>";
						for (var i = 0; i < params.length; i++) {
							str += "<div><span class='_ec_title icon-bullet_yellow'>"
								+ params[i].seriesName
								+ "：</span><span class='_ec_value'>"
								+ params[i].value[1] + "</span></div>";
						}
					}



					str += "</div>";
					// myChart.resize();
					return str;

				}
			},
			xAxis: {

				type: xType,
				name: xName,
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2
					},
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
				data: [],
			},
			yAxis: {
				type: "value",
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2
					},
				},
				boundaryGap: ['0%', '0%'],
				splitLine: {
					show: false
				},
				axisLabel: {
					align: 'right'
				},
				name: yName,
				// splitNumber:1,
				scale: true
			},
			series: []
		};
		var optionSeries = [];
		var lendData = [];
		var xData;
		let ctype = 'count'
		var keys = [];
		if (ctype == "count") {
			var keysArr = this.stcds;
			var keyDate = "";
			for (var key in data) {
				keys.push(key);
				var k = key.split(":");
				if (k.length > 1) {
					keyDate = k[1];
				}
			}
			// if (keysArr.length > 2) {
			// 	keys = [];
			// 	for (var i = 0; i < keysArr.length - 1; i++) {
			// 		keys.push(keysArr[i] + ":" + keyDate);
			// 	}
			// } else {
			// 	keys = keys.sort();
			// }
		} else {
			keys = this.stcds;
		}
		var xAxisdata;
		for (var i = 0; i < keys.length - 1; i++) {
			if (data[keys[i]].avg) {
				_.forEach(data[keys[i]], function (val,j) {
					var sData = {};
					var sname;
					if (j == 'avg') {
						sname = val.name + '平均值';
						var seardatas = []
						var xAdata = val.xAxis.data
						if(xAdata.length>0&&val.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push([xAdata[m], val.data[m], ''])
							}
							sData = {
								data: val.data,
								itemStyle: val.itemStyle,
								name: sname,
								scale: true,
								type: val.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {
	
									normal: {
										// color:  map_ops.RandomColor(),
										width: 2
									}
								},
								
							};
							optionSeries.push(sData);
							lendData.push({ 'name': sname });
						}
						
						
						
					} else if (j == 'max') {
						sname = val.name + '最大值';
						var seardatas = []
						var xAdata = val.xAxis.data
						if(xAdata.length>0&&val.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push([xAdata[m], val.data[m].value, val.data[m].tm])
							}
							sData = {
								data: seardatas,
								itemStyle: val.itemStyle,
								name: sname,
								scale: true,
								type: val.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {
	
									normal: {
										// color:  map_ops.RandomColor(),
										width: 2
									}
								},
								
	
							};
							optionSeries.push(sData);
							lendData.push({ 'name': sname });
						}
						
						
					} else if (j == 'min') {
						sname = val.name + '最小值'
						var seardatas = []
						var xAdata = val.xAxis.data
						if(xAdata.length>0&&val.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push([xAdata[m], val.data[m].value, val.data[m].tm])
							}
								
							sData = {
								data: seardatas,
								itemStyle: val.itemStyle,
								name: sname,
								scale: true,
								type: val.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {

									normal: {
										// color:  map_ops.RandomColor(),
										width: 2
									}
								},
							};
							optionSeries.push(sData);
							lendData.push({ 'name': sname });
						}
					
					}

					
				})




			}

		}
		// option.symbol='none';
		option.series = optionSeries;
		option.legend.data = lendData;

		option.xAxis.type = 'category';
		// option.xAxis.inverse=true;
		// option.xAxis.nameLocation='start';
		option.xAxis.data = xAxisdata;

		if (option.series.length > 0) {
			console.log(option)
			this.chart.setOption(option);
			this.chart.resize();
			// $(window).resize(function() {
			// 	setTimeout(function() {
			// 		myChart.resize();
			// 	}, 100);
			// });
		} else {


		}
		return this.chart
	}
	doNewLineData(data) {
		var obj = Object()
		var optionSeries = [];
		var lendData = [];
		var xData;
		var keys = [];
		var smooth = false;
		let ctype = 'count'
		if (ctype == "count") {
			var keysArr = this.stcds;
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
			keys = this.stcds;
		}
		for (var i = 0; i < keys.length - 1; i++) {
			var xAxisdata;
			for (var i = 0; i < keys.length - 1; i++) {
				if (data[keys[i]].avg) {
					_.forEach(data[keys[i]], function (val,j) {
						var sData = {};
						var sname;
						if (j == 'avg') {
							sname = val.name + '平均值';
							var seardatas = []
							var xAdata = val.xAxis.data
							if(xAdata.length>0&&val.data.length>0){
								for (var m = 0; m < xAdata.length; m++) {
									seardatas.push(xAdata[m])
								}
								sData = {
									data: val.data,
									itemStyle: val.itemStyle,
									name: sname,
									scale: true,
									type: val.type,
									// symbol:"none",
									// smooth: true,
									symbol: 'circle',
									symbolSize: 5,
									showSymbol: false,
									lineStyle: {
	
										normal: {
											// color:  map_ops.RandomColor(),
											width: 2
										}
									},
								};
								optionSeries.push(sData);
								lendData.push({ 'name': sname });
								xAxisdata = seardatas
							}
							
						}
					})
				}
			}
		}
		// option.symbol='none';
		obj.series = optionSeries;
		obj.data = lendData;

		// obj.type = xType;
		return obj
	}
	logAvgChart(data, divName, xName, yName, titleText, type) {
		let ec = echarts as any;
		let container = document.getElementById('processLinechart');
		this.chart = ec.init(container);
		this.chart.clear();
		if (data.unit) {
			yName = data.unit
		}
		var xAxisType;

		var option = {
			title: {
				text: titleText,
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c}'
			},
			legend: {
				orient: "horizontal",
				// x : 150,
				x: 'center',
				y: 20,
				data: []
			},
			grid: {
				bottom: 10,
				left:20,
				right:20,
				containLabel: true
			},
			xAxis: {
				type: xAxisType,
				name: xName,
				splitLine: { show: false },
				axisLabel: {
					formatter: function (value, index) {
						if (option.xAxis.type == 'time') {
							let year =  moment(value).format("YYYY")
							let month= moment(value).format("MM-DD")
							return year + '\n' +month
						} else {
							return value
						}
					}
				},
			},

			yAxis: {
				type: 'log',
				name: yName
			},
			series: []
		};
		var logseries = []
		var lendData = [];
		_.forEach(data, function ( val,i) {
			var sData;
			if (val.data) {

				sData = {
					data: val.data,
					itemStyle: val.itemStyle,
					name: val.name,
					scale: true,
					type: val.type,
					// symbol:"none",
					// smooth: true,
					symbol: 'circle',
					symbolSize: 5,
					showSymbol: false,
				}
				logseries.push(sData)
			} else if (val.avg) {
				var dataA = val;

				_.forEach(dataA, function (vals,j) {

					var sname;
					if (j == 'avg') {
						var sData = {};
						sname = vals.name + '平均值';
						var seardatas = []
						var xAdata = vals.xAxis.data
						if(xAdata.length>0&&vals.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push([xAdata[m], vals.data[m], ''])
							}
							sData = {
								data: seardatas,
								itemStyle: vals.itemStyle,
								name: sname,
								scale: true,
								type: vals.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {
	
									normal: {
										// color:  map_ops.RandomColor(),
										width: 2
									}
								},
							};
							logseries.push(sData);
							lendData.push({ 'name': sname });
						}
					}
				})

			}

		})
		if (type != 'day') {
			option.xAxis.type = 'category'
			// option.xAxis.inverse=true;
			// option.xAxis.nameLocation='start';
		} else {
			option.xAxis.type = 'time'
		}
		option.series = logseries;
		option.legend.data = lendData;
		console.log(option)
		this.chart.setOption(option)
		this.chart.resize();
	}
	logChart(data, divName, xName, yName, titleText, type) {

		let ec = echarts as any;
		let container = document.getElementById(divName);
		this.chart = ec.init(container);
		this.chart.clear();
		if (data.unit) {
			yName = data.unit
		}

		var xAxisType;

		let option = {
			title: {
				text: titleText,
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c}'
			},
			legend: {
				orient: "horizontal",
				// x : 150,
				x: 'center',
				y: 20,
				data: []
			},
			grid: {
				bottom: 10,
				left:20,
				right:20,
				containLabel: true
			},
			xAxis: {
				type: xAxisType,
				name: xName,
				axisLabel: {
					formatter: function (value, index) {
						if (option.xAxis.type == 'time') {
							let year =  moment(value).format("YYYY")
							let month= moment(value).format("MM-DD")
							return year + '\n' +month
						} else {
							return value
						}
					}
				},
				splitLine: { show: false },

			},

			yAxis: {
				type: 'log',
				name: yName
			},
			series: []
		};
		var logseries = []
		var lendData = [];
		_.each(data, function ( val,i) {
			var sData;
			if (val.data) {

				sData = {
					data: val.data,
					itemStyle: val.itemStyle,
					name: val.name,
					scale: true,
					type: val.type,
					// symbol:"none",
					// smooth: true,
					symbol: 'circle',
					symbolSize: 5,
					showSymbol: false,
				}
				logseries.push(sData)
				lendData.push({ 'name': val.name });
			} else if (val.avg) {
				var dataA = val;
				var seardatas = [];
				_.forEach(dataA, function (vals,j) {
					var sData = {};
					var sname;
					if (j == 'avg') {
						sname = vals.name + '平均值';
						var seardatas = []
						var xAdata = vals.xAxis.data
						if(xAdata.length>0&&vals.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push([xAdata[m], vals.data[m], ''])
								
							}
							sData = {
								data: seardatas,
								itemStyle: vals.itemStyle,
								name: sname,
								scale: true,
								type: vals.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {
	
									normal: {
										// color:  map_ops.RandomColor(),
										width: 2
									}
								},
							};
							logseries.push(sData);
							lendData.push({ 'name': sname });
						}
						
						
					} else if (j == 'max') {
						sname = val.name + '最大值';
						var seardatas = []
						var xAdata = vals.xAxis.data
						if(xAdata.length>0&&vals.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push([xAdata[m], vals.data[m].value, vals.data[m].tm])
							}
							sData = {
								data: seardatas,
								itemStyle: vals.itemStyle,
								name: sname,
								scale: true,
								type: vals.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
								lineStyle: {
	
									normal: {
										// color:  map_ops.RandomColor(),
										width: 2
									}
								},
	
							};
							logseries.push(sData);
							lendData.push({ 'name': sname });
						}
						
					} else if (j == 'min') {
						sname = vals.name + '最小值'
						var seardatas = []
						var xAdata = vals.xAxis.data
						if(xAdata.length>0&&vals.data.length>0){
							for (var m = 0; m < xAdata.length; m++) {
								seardatas.push([xAdata[m], vals.data[m].value, vals.data[m].tm])
							}
							sData = {
								data: seardatas,
								itemStyle: vals.itemStyle,
								name: sname,
								scale: true,
								type: vals.type,
								// symbol:"none",
								// smooth: true,
								symbol: 'circle',
								symbolSize: 5,
								showSymbol: false,
							};
							logseries.push(sData);
							lendData.push({ 'name': sname });
						}
						
					}

					
				})

			}

		})
		if (type != 'day') {
			option.xAxis.type = 'category'
			// option.xAxis.inverse=true;
			// option.xAxis.nameLocation='start';
		} else {
			option.xAxis.type = 'time'
		}
		option.series = logseries;
		option.legend.data = lendData;
		console.log(option)
		this.chart.setOption(option)
		this.chart.resize();
	}

	doProcessLine() {
		let type = this.dateType

		this.stcds = _.map(this.station,'stcd')
		
		let stationNames = this.stationName
		var objMax = {
			z: {
				avg: 'avz',
				htg: 'htz',
				htgdt: 'htzdt',
				mng: 'mnz',
				mngdt: 'mnzdt',
				unit: '(m)'
			},
			q: {
				avg: 'avq',
				htg: 'mxq',
				htgdt: 'mxqdt',
				mng: 'mnq',
				mngdt: 'mnqdt',
				unit: '(m³/s)'
			},
			cs: {
				avg: 'avcs',
				htg: 'mxs',
				htgdt: 'mxsdt',
				mng: 'mns',
				mngdt: 'mnsdt',
				unit: '(kg/m³)'
			},
			qs: {
				avg: 'avqs',
				htg: 'mxdyqs',
				htgdt: 'mxdyqsodt',
				mng: 'mnqs',
				mngdt: 'mnqsdt',
				unit: '(kg/s)'
			},
			wtmp: {
				avg: 'avwtmp',
				htg: 'mxwtmp',
				htgdt: 'mxwtmpdt',
				mng: 'mnwtmp',
				mngdt: 'mnwtmpdt',
				unit: '(℃)'
			}
		}
		if (this.types.length == 1) {
			
			let url = `/swns/stsc/${this.types[0].toLowerCase()}/lineChart.gaeaway`;
			this.httpService.getLineData(url, this.stcds, this.startDay, this.endDay, stationNames, type)
				.then(res => {
					let datas = JSON.parse(res)
					if (type == 'day') {
						var maxLine = []
						if (datas.minAndmax) {
						
							for (let n = 0; n < datas.minAndmax.length; n++) {
								var objs = objMax[this.types[0].toLowerCase()]
								maxLine.push({
									stnm: datas.minAndmax[n].stnm,
									avz: _.get(datas.minAndmax[n], [objs.avg]) + objs.unit,
									htz: _.get(datas.minAndmax[n], [objs.htg]) + objs.unit,
									htzdt: moment(_.get(datas.minAndmax[n], [objs.htgdt])).format("YYYY-MM-DD hh:mm:ss"),
									mnz: _.get(datas.minAndmax[n], [objs.mng]) + objs.unit,
									mnzdt: moment(_.get(datas.minAndmax[n], [objs.htgdt])).format("YYYY-MM-DD hh:mm:ss"),
									yr: datas.minAndmax[n].yr
								})
							}



						// 	//最大数据显示
							this.maxAndMinList=maxLine
						}
					}else{
						this.maxAndMinList=[]
					}
					let xs = '时间';
					let xType = 'category'
					let titleText, typet;
					
					if (this.stcds.length == 1 && type != "day") {
						if (this.types[0].toLowerCase() == 'cs') {

							this.logChart(datas, 'processLinechart', '时间', this.stationName[0], this.stationName[0], type)
						} else {
							this.charSantLine(datas, 'processLinechart', xType, xs, this.stationName[0], '', '')
						}

					} else if (this.station.length > 1 && type != "day") {
						if (this.types[0].toLowerCase() == 'cs') {

							this.logAvgChart(datas, 'processLinechart', xs, this.typeObj[this.types[0]], this.typeObj[this.types[0]], type)
						} else {
							this.charAvgtLine(datas, 'processLinechart', xType, xs, this.typeObj[this.types[0]], '', '')
						}
					} else if (this.station.length > 1 && type == "day") {

						if (this.types[0].toLowerCase() == 'cs') {

							this.logChart(datas, 'processLinechart', xs, this.typeObj[this.types[0]], this.typeObj[this.types[0]], type)
						} else {
							this.unitService.chartLine(datas, 'processLinechart', 'time', xs, this.typeObj[this.types[0]], titleText, typet)
						}
					} else {
						if (this.types[0].toLowerCase() == 'cs') {

							this.logChart(datas, 'processLinechart', xs, this.typeObj[this.types[0]], this.typeObj[this.types[0]], type)
						} else {
							this.unitService.chartLine(datas, 'processLinechart', 'time', xs, this.typeObj[this.types[0]], titleText, typet)
						}

					}
				})
		} else if (this.types.length == 2 && this.station.length == 1) {
			var obj;
			let xs='时间'
			let titleText, typet;
			let url = '/swns/stsc/'+this.types[0].toLowerCase()+'/lineChart.gaeaway';

			this.httpService.getLineData(url,this.stcds,this.startDay,this.endDay,stationNames,type).then(res=>{
				let data=JSON.parse(res)
				let url1 = '/swns/stsc/'+this.types[1].toLowerCase()+'/lineChart.gaeaway';
				this.httpService.getLineData(url1,this.stcds,this.startDay,this.endDay,stationNames,type).then(res1=>{
					let msg=JSON.parse(res1)
					var option;
				
			if(type!="day"){
			  if(this.types[0].toLowerCase()=='cs'){

				this.chart=this.logAvgChart(data,'processLinechart',xs,this.typeObj[this.types[0]], this.typeObj[this.types[0]],type)
			  }else{
				this.chart=this.charAvgtLine(data,'processLinechart','category',xs,this.typeObj[this.types[0]],'','')
			  }

			  option = this.chart.getOption();
			  obj=this.doNewLineData(msg)
		
			  if(this.types[1].toLowerCase()[1]=='cs'){
			    option.yAxis[1]={
			      name:this.typeObj[this.types[0]],
			      type:'log'
			      }
			  }else{
			    option.yAxis[1]={
			      name:this.typeObj[this.types[0]],
			      type:'value',
			      // smooth: true,
			      symbol: 'circle',
			      symbolSize: 5,
			      showSymbol: false,
			      lineStyle: {

			        normal: {
			          // color:  map_ops.RandomColor(),
			          width: 2
			        }
			      },

			      }
			  }
			}else{

			    let maxLine=[]
			    if(data.minAndmax){

			      for(let n=0;n<data.minAndmax.length;n++){
			        var objs=objMax[this.types[0].toLowerCase()]
			        maxLine.push({
			          stnm:data.minAndmax[n].stnm,
			          avz:_.get(data.minAndmax[n],[objs.avg])+objs.unit,
			          htz:_.get(data.minAndmax[n],[objs.htg])+objs.unit,
			          htzdt:moment(_.get(data.minAndmax[n],[objs.htgdt])).format("YYYY-MM-DD hh:mm:ss"),
			          mnz:_.get(data.minAndmax[n],[objs.mng])+objs.unit,
			          mnzdt:moment(_.get(data.minAndmax[n],[objs.htgdt])).format("YYYY-MM-DD hh:mm:ss"),
			          yr:data.minAndmax[n].yr
			        })
			      }
			    }
			    if(msg.minAndmax){

			      for(let n=0;n<msg.minAndmax.length;n++){
			        var objs=objMax[this.types[1].toLowerCase()]
			        maxLine.push({
			          stnm:msg.minAndmax[n].stnm,
			          avz:_.get(msg.minAndmax[n],[objs.avg])+objs.unit,
			          htz:_.get(msg.minAndmax[n],[objs.htg])+objs.unit,
			          htzdt:moment(_.get(msg.minAndmax[n],[objs.htgdt])).format("YYYY-MM-DD hh:mm:ss"),
			          mnz:_.get(msg.minAndmax[n],[objs.mng])+objs.unit,
			          mnzdt:moment(_.get(msg.minAndmax[n],[objs.htgdt])).format("YYYY-MM-DD hh:mm:ss"),
			          yr:msg.minAndmax[n].yr
			        })
			      }
				}
				
				if(type=='day'){
					this.maxAndMinList=maxLine
				}else{
						this.maxAndMinList=[]
					}
			  if(this.types[0].toLowerCase()=='cs'){

				this.chart=this.logChart(data,'processLinechart',xs,this.typeObj[this.types[0]], this.typeObj[this.types[0]],type)
			  }else{
			    this.chart=this.unitService.chartLine(data,'processLinechart','time',xs,this.typeObj[this.types[0]],titleText,typet)
			  }

			  option = this.chart.getOption();
			  obj=this.unitService.doLineData(msg,'time')
			  if(this.types[1].toLowerCase()=='cs'){
			    option.yAxis[1]={
			      name:this.typeObj[this.types[1]],
			      type:'log'
			      }
			  }else{
			    option.yAxis[1]={
			      name:this.typeObj[this.types[1]],
			      type:'value',
			      // smooth: true,
			      symbol: 'circle',
			      symbolSize: 5,
			      showSymbol: false,
			      lineStyle: {

			        normal: {
			          // color:  map_ops.RandomColor(),
			          width: 2
			        }
			      },

			      }
			  }

			}
			if(obj.series.length>0){
			  obj.series[0].yAxisIndex=1
			  option.series.push(obj.series[0])
			  option.series[0].name=this.typeObj[this.types[0]]
			  option.series[1].name=this.typeObj[this.types[1]]
			}
			// console.log(this.typeObj[this.types[0]])
			
			option.legend[0].data[0]=this.typeObj[this.types[0]]
			option.legend[0].data[1]=this.typeObj[this.types[1]]
			console.log(option)
					this.chart.setOption(option)
				})
			})
		} else {
			// layer.msg('请核对查询条件,选择单个站点')
		}
	}
	dateTypeChange(e) {
		let lastYear=AppConfig.lastYear
		let year=parseInt(AppConfig.year)
		let nowYear=moment(new Date(Date.now())).format('YYYY')
		if (this.dateType == 'year') {
			let startyear=(parseInt(AppConfig.lastYear)-year).toString()
			this.startDay = moment().startOf('year').format(this.forYear).toString().replace(nowYear,startyear);
			this.endDay = moment(new Date(Date.now())).format(this.forYear).replace(nowYear,lastYear);
			this.startDisTime = this.forYear
			this.endDisTime = this.forYear
			this.startPicTime = this.forYear
			this.endPicTime = this.forYear
			this.maxAndMinList=[]
		} else if (this.dateType == 'month') {
			this.startDay = moment().startOf('year').format(this.disMonth).toString().replace(nowYear,lastYear);;
			this.endDay = moment(new Date(Date.now())).format(this.disMonth).replace(nowYear,lastYear);
			this.startDisTime = this.disMonth
			this.endDisTime = this.disMonth
			this.startPicTime = this.picMonth
			this.endPicTime = this.picMonth
			this.maxAndMinList=[]
		} else {
			this.startDay = moment().startOf('year').format(this.disMonth).toString().replace(nowYear,lastYear);
			this.endDay = moment(new Date(Date.now())).format(this.disDay).replace(nowYear,lastYear);
			this.startDisTime = this.disDay
			this.endDisTime = this.disDay
			this.startPicTime = this.picDay
			this.endPicTime = this.picDay

		}
		
	}
	startTimeChange(e) {
		
		this.startDay=moment(e.detail.value).format(this.startDisTime)
	}
	endTimeChange(e) {
		this.endDay=moment(e.detail.value).format(this.startDisTime)
	}
	async changeSelect(selectedType) {
		if (selectedType.flag) {
			this.seleceList.forEach(function (item) {
				if (item.id == selectedType.id) {
					item.flag = !item.flag
				}
			})

			this.types = _.pull(this.types, selectedType.value)
		} else {
			if (this.types.length > 1 && !(selectedType.flag)) {
				const toast = await this.toastController.create({
					message: '类型选择不能超过两个',
					duration: 2000
				})
				toast.present()
				return false
			} else {
				this.seleceList.forEach(function (item) {
					if (item.id == selectedType.id) {
						item.flag = !item.flag
					}
				})
			}
			this.types.push(selectedType.value)


		}


	}
	
	

}
