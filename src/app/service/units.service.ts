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
	) {
		// this.areaData=this.initAreaData()
		// console.log(this.areaData)
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
