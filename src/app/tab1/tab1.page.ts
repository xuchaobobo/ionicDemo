import * as $ from '../../../node_modules/jquery/dist/jquery.js';
import { Component,ChangeDetectorRef} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'ol/ol.css';
import {Map,View} from 'ol'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import MousePosition from 'ol/control/MousePosition';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Attribution from 'ol/control/Attribution';
// import WMTS from 'ol/source/WMTS.js';
// import {getWidth, getTopLeft} from 'ol/extent.js';
// import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import {click, pointerMove, altKeyOnly} from 'ol/events/condition';
import {toLonLat,get as getProjection,Projection} from 'ol/proj';
import {LineString, Point, Polygon} from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Select from 'ol/interaction/Select';
import ImageLayer from 'ol/layer/Image';
import { createStringXY } from 'ol/coordinate'
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import { ProviderService } from './../service/provider.service'
import ImageWMS from 'ol/source/ImageWMS';
import { environment } from '../../environments/environment'
import { AppConfig } from './../api.config';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	selectStation:any={
		stationName:'三峡',
		waterLev:'12m',
		rflow:'300m³/s',
		cflow:'300m³/s'
	};
	isShow=false;
	searchList=[]
	map:any;
	view:any;
	 minZoom=5;
	 maxZoom=16;
	 displaystatus='none';
	 BLayerSwitch =new Array(34);
	vectorsource = new VectorSource();
	LayerVectorLocation = new VectorLayer({
		source: this.vectorsource,
		visible:false
	});
	getloc;
	LayerMngName
	locationStyle =new Style({
		image: new CircleStyle({//圆
		radius: 10,//半径
		fill: new Fill({//圆填充色
			color: 'rgba(0,0,255,0.5)'
		}),
		stroke: new Stroke({//圆边线样式
			color: 'rgba(0,255,0,0.5)',
			width: 1
		})
		})
	});
	LayerZoom =[
		[this.minZoom,this.maxZoom],//var 00BLayerHeliuR;
		[this.minZoom,8],//01BLayerHuanghechangjiangL;
		[13,this.maxZoom],//02BLayerDuanmianNewL;
		[13,this.maxZoom],//03BLayerDuanmianOldL;
		[this.minZoom,6],//04BLayerShengP;
		[6,10],//05BLayerShenghuiP;
		[8,11],//06BLayerDijishiP;
		[9,12],//07BLayerXianP;
		[11,this.maxZoom],//08BLayerXiangP;
		[13,this.maxZoom],//09BLayerCunP;
		[6,8],//10BLayerShishishuiwenzhan1P;
		[6,8],//11BLayerShishishuikuzhan1P;
		[9,this.maxZoom],//12BLayerShishishuiwenzhanP;
		[11,this.maxZoom],//13BLayerShishishuiweizhanP;
		[9,this.maxZoom],//14BLayerShishishuikuzhanP;
		[6,8],//15BLayerShuiwenzhan1;
		[9,this.maxZoom],//16BLayerShuiwenzhan;
		[11,this.maxZoom],//17BLayerShuiweizhan;
		[10,this.maxZoom],//18LayerHeliu;
		[this.minZoom,this.maxZoom],//19BLayerLiuyubianjie2;
		[this.minZoom,this.maxZoom],//20BLayerGuoL;
		[11,this.maxZoom],//21LayerELVZhoutan
		[11,this.maxZoom],//22LayerELV1
		[11,this.maxZoom],//23LayerELV2
		[11,this.maxZoom],//24LayerELV3
		[11,this.maxZoom],//25LayerELV4
		[11,this.maxZoom],//26LayerELV5
		[11,this.maxZoom],//27LayerELV6
		[this.minZoom,7],//28BLayerShengR;
		[8,9],//29BLayerShiR;
		[10,this.maxZoom],//30BLayerXianR;
		[12,this.maxZoom],//31LayerDifangL
		[this.minZoom,this.maxZoom],//32BLayerVectorLocation;
		[this.minZoom,this.maxZoom],//33BLayerOSM;
		];
		LayAll;
  constructor(
	  public httpService: ProviderService,
	   private geolocation: Geolocation,
	   private cd: ChangeDetectorRef,
	   public router: Router
	   ) {
	
  }
  ngOnInit() {
    // this.getDep()
  //  this.getGps()
	this.getStationInfo()
	this.loadLayersControl(this.map, "layerTree");
	document.all["down"].style.display='none'
	document.all["layerTree"].style.display='none'
	const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput.bind(this),false);
  }
  handleInput(event) {
    // this.items = Array.from(document.querySelector('ion-radio-group').children);
	const query = event.target.value;
	let that=this
	
	if(query==''){
		that.isShow=false
	}else{
		that.isShow=true
	}
	that.httpService.getSearchKey(query).then(res=>{
		if(JSON.parse(res).data&&JSON.parse(res).data.length>0){
			let json=JSON.parse(res).data[0]
			that.searchList=json.children
		}else{
			that.searchList=[]
		}
	})
  }
  selectLable(str){
	let position=str.split(',')
	this.view.animate({
		center:position,
		duration: 2000,
		zoom: 13
	})
	// this.view.setZoom(13);;
	// this.SetLayerVisable()
	this.isShow=false
  }
  getStationInfo(){
	let pama = {
		stcd: '60106980',
		startDate: moment(new Date(Date.now()- 3 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
		endDate: moment(new Date(Date.now() - 24 * 0 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
	  }
	  console.log(pama.endDate)
	  let url ='swns/real/realStRsvrR.gaeaway'
	  let that =this
      this.httpService.getRealWaterData(url,pama).then(res => {
		  let json=JSON.parse(res)
		  if(json.list.length>0){
			let nowJson=json.list[json.list.length-1]
			that.selectStation.waterLev=nowJson.rz
			if(nowJson.inq!=null){
			  that.selectStation.rflow=nowJson.inq
			}else{
			  that.selectStation.rflow='-'
			}
			if(nowJson.otq!=null){
			  that.selectStation.cflow=nowJson.otq
			}else{
			  that.selectStation.cflow='-'
			}
		  }
		  
	  })
  }
  ionViewDidEnter(){
	  this.initmap()

	  
	//   this.getGps()
	//   setInterval(this.getGps, 5000);
  }
  getGps(){
	if(AppConfig.platform=='browser'){
    	window.navigator.geolocation.getCurrentPosition(function(position)
		{
			
			console.log(position)
		  this.LayerVectorLocation.getSource().clear();
		  var locationFeature = new Feature({
			  geometry: new Point([position.coords.longitude,position.coords.latitude]),
		  });
		  locationFeature.setStyle(this.locationStyle);
		  this.LayerVectorLocation.getSource().addFeature(locationFeature);
		  this.map.getView().setCenter([position.coords.longitude,position.coords.latitude]);
		  this.map.getView().setZoom(11);

		});
    }else{
		this.geolocation.getCurrentPosition().then((resp) => {
		
			alert(resp.coords.latitude+'-'+resp.coords.longitude)
			  this.LayerVectorLocation.getSource().clear();
		  var locationFeature = new Feature({
			  geometry: new Point([resp.coords.longitude,resp.coords.latitude]),
		  });
		  locationFeature.setStyle(this.locationStyle);
		  this.LayerVectorLocation.getSource().addFeature(locationFeature);
		
		  this.view.animate({
			center:[resp.coords.longitude,resp.coords.latitude],
			duration: 2000,
			zoom: 10
		})
			// resp.coords.latitude
			// resp.coords.longitude
		   }).catch((error) => {
			 console.log('Error getting location', error);
		   });
		   
		   let watch = this.geolocation.watchPosition();
		   watch.subscribe((data) => {
			  this.map.getView().setCenter([data.coords.longitude,data.coords.latitude]);
			  this.map.getView().setZoom(11);
		  //   alert(data.coords.latitude+'-'+data.coords.longitude)
			// data can be a set of coordinates, or an error (if an error occurred).
			// data.coords.latitude
			// data.coords.longitude
		   });
	}
	
   
  }
  ionViewDidLeave(){
  	$('#map').html('')
  }
  loadLayersControl(map, id) {
	//图层目录容器
	// var treeContent = document.getElementById(id);
	// treeContent.innerHTML=''
	this.LayerMngName=[
		{'title':"行政区划",'checked':true},
		{'title':"水系",'checked':true},
		{'title':"测站",'checked':false},
		{'title':"实时测站",'checked':true},
		{'title':"在测断面",'checked':true},
		{'title':"弃测断面",'checked':false},
		{'title':"我的位置",'checked':false},
		{'title':"第三方地图",'checked':false}];
}
displaymaplist(){
		if(this.displaystatus=='block'){
			this.displaystatus='none';
			document.all["layerTree"].style.display='none';
			document.all["down"].style.display='none';
			document.all["up"].style.display='inline';
		}else{
			this.displaystatus='block';
			document.all["layerTree"].style.display='block';
			document.all["down"].style.display='inline';
			document.all["up"].style.display='none';
		}
	}
SetBLayerSwitchAccLayerMng(element,layermngname){
	
	let chekcedFlag=element.currentTarget.checked
	
	switch(layermngname)
	{
		case "行政区划":
			this.BLayerSwitch[4]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[5]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[6]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[7]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[8]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[9]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[20]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[28]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[29]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[30]=chekcedFlag//.setVisible(chekcedFlag);
			this.SetLayerVisable();
			break;
		case "水系":
			this.BLayerSwitch[0]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[1]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[18]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[19]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[21]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[22]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[23]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[24]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[25]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[26]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[27]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[31]=chekcedFlag//.setVisible(chekcedFlag);
			this.SetLayerVisable();
			break;
		case "测站":
			debugger
			this.BLayerSwitch[15]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[16]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[17]=chekcedFlag//.setVisible(chekcedFlag);
			if(chekcedFlag){
				this.BLayerSwitch[10]=false//.setVisible(element.checked);
				this.BLayerSwitch[11]=false//.setVisible(element.checked);
				this.BLayerSwitch[12]=false//.setVisible(element.checked);
				this.BLayerSwitch[13]=false//.setVisible(element.checked);
				this.BLayerSwitch[14]=false//.setVisible(element.checked);
				this.LayerMngName[3].checked=false;
				this.cd.detectChanges();
			}

			this.SetLayerVisable();
			break;
		case "实时测站":
			this.BLayerSwitch[10]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[11]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[12]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[13]=chekcedFlag//.setVisible(chekcedFlag);
			this.BLayerSwitch[14]=chekcedFlag//.setVisible(chekcedFlag);
			if(chekcedFlag){
				this.BLayerSwitch[15]=false//.setVisible(element.checked);
				this.BLayerSwitch[16]=false//.setVisible(element.checked);
				this.BLayerSwitch[17]=false//.setVisible(element.checked);
				this.LayerMngName[2].checked=false;
				this.cd.detectChanges();
			}
			
			this.SetLayerVisable();
			break;
		case "在测断面":
			this.BLayerSwitch[2]=chekcedFlag//.setVisible(chekcedFlag);
			this.SetLayerVisable();
			break;
		case "弃测断面":
			this.BLayerSwitch[3]=chekcedFlag//.setVisible(chekcedFlag);
			this.SetLayerVisable();
			break;
		case "我的位置":
			this.BLayerSwitch[32]=chekcedFlag//.setVisible(chekcedFlag);
			this.SetLayerVisable();
			if(chekcedFlag){
				
				this.getloc=setInterval(this.getGps, 5000);
				this.LayerVectorLocation.setVisible(true);
			}else{
				clearInterval(this.getloc);
				this.LayerVectorLocation.setVisible(false);
			}
			break;
		case "第三方地图":
			this.BLayerSwitch[33]=chekcedFlag//.setVisible(chekcedFlag);
			this.SetLayerVisable();
			break;
		default:alert("图层错误");
	}
	
}
  SetLayerVisable(){
	  
	var mapZoom=this.map.getView().getZoom();
	for(var i=0;i<34;i++){
		if ( mapZoom>= this.LayerZoom[i][0] && mapZoom <= this.LayerZoom[i][1] && this.BLayerSwitch[i]==true ){
			this.LayAll[i].setVisible(true);
		}else{
			this.LayAll[i].setVisible(false);
		}
	}      
}

//定位功能
//  getLocation()
//   {
//   if (navigator.geolocation)
//     {
//     navigator.geolocation.getCurrentPosition(showPosition);
//     }
//   //else{x.innerHTML="Geolocation is not supported by this browser.";}
//   }
// showPosition(position)
//   {
// 	LayerVectorLocation.getSource().clear();
// 	var locationFeature = new ol.Feature({
//         geometry: new ol.geom.Point([position.coords.longitude, position.coords.latitude]),
//     });
//     locationFeature.setStyle(locationStyle);
//     LayerVectorLocation.getSource().addFeature(locationFeature);
// 	document.getElementById('scale').innerHTML = '经度:'+position.coords.longitude+' 纬度:'+position.coords.latitude;
// 	map.getView().setCenter([position.coords.longitude,position.coords.latitude]);
// 	map.getView().setZoom(11);
//   }
  initmap(){
	var BLayerSwitch =new Array(34);
	
	for(var i=0;i<34;i++){
		if(i==3||i==15||i==16||i==17||i==32||i==33){
			BLayerSwitch[i] =false;
		}else{
			BLayerSwitch[i] =true;
		}
	}
	this.vectorsource = new VectorSource();
	this.LayerVectorLocation = new VectorLayer({
		source: this.vectorsource,
		visible:false
	});
	
  //创建一个定位图标的风格


 //创建定位图标的数据源、图层，加入MAP 


//定位功能,5000ms定位一次


////////////////////////////////


      var pureCoverage = false;
      // if this is just a coverage or a group of them, disable a few items,
      // and default to jpeg format
      var format = 'image/png';
      var bounds = [87.604065, 20.033791,
                    126.645485, 45.742336];
      if (pureCoverage) {
        // document.getElementById('filterType').disabled = true;
        // document.getElementById('filter').disabled = true;
        // document.getElementById('antialiasSelector').disabled = true;
        // document.getElementById('updateFilterButton').disabled = true;
        // document.getElementById('resetFilterButton').disabled = true;
        // document.getElementById('jpeg').selected = true;
        format = "image/jpeg";
      }

      var mousePositionControl = new MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        coordinateFormat: createStringXY(5),
        undefinedHTML: '&nbsp;'
	  });
	  var mnts='geoserver/gwc/service/wmts'
	  var paths='geoserver/DiTu/wms'
	  let url
    if(environment.production){
		url=environment.geoServer+'/'+paths
    }else{
		url=paths
	}
	var projection = getProjection('EPSG:4326');
	// var projectionExtent = projection.getExtent();

	// //切片名
	// var matrixIds = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10',
	// 	'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

	// //切片大小
	// var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5,
	// 	4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];

	// var ditu_cache =  new TileLayer({
	// 	source: new WMTS({
	// 		url: mnts,
	// 		layer: 'DiTu:ditu_cache',
	// 		matrixSet: 'EPSG:4326',
	// 		format: 'image/png',
	// 		projection: projection,
	// 		tileGrid: new WMTSTileGrid({
	// 			origin: getTopLeft(projectionExtent),
	// 			resolutions: resolutions,
	// 			matrixIds: matrixIds
	// 		}),
	// 		wrapX: true
	// 	}),
	// 	visible:true	
	// })
	
	var LayerShenghuiP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShenghuiP', //全国省会城市P
			}
		}),
		visible:false
	});
	LayerShenghuiP.setZIndex(9);
var LayerHuanghechangjiangL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:HuanghechangjiangL', //黄河长江干流L
			}
		}),
		visible:true
	});
	LayerHuanghechangjiangL.setZIndex(9);
var LayerShengP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShengP', //全国省P
			}
		}),
		visible:true
	});
	LayerShengP.setZIndex(9);
var LayerDijishiP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShiP',//全国地级城市P
			}
		}),
		visible:false
	});
	LayerDijishiP.setZIndex(9);
var LayerXianP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:XianP',//全国县P
			}
		}),
		visible:false
	});
	LayerXianP.setZIndex(9);
var LayerXiangP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:XiangP',//长江流域25万乡镇P
			}
		}),
		visible:false
	});
	LayerXiangP.setZIndex(9);
var LayerCunP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:CunP',//长江流域25万村P
			}
		}),
		visible:false
	});
	LayerCunP.setZIndex(9);
var LayerLiuyubianjie2L = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:Liuyubianjie2L',//长江流域边界2L
			}
		}),
		visible:true
	});
	LayerLiuyubianjie2L.setZIndex(9);
var LayerHeliuL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:HeliuL',//长江流域河流L
			}
		}),
		visible:false
	});
	LayerHeliuL.setZIndex(9);
var LayerShuiwenzhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShuiwenzhanP',//水文站全
			}
		}),
		visible:false
	});
	LayerShuiwenzhanP.setZIndex(9);
var LayerShuiwenzhan1P = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:Shuiwenzhan1P',//水文站优先
			}
		}),
		visible:false
	});
	LayerShuiwenzhan1P.setZIndex(10);
var LayerShuiweizhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShuiweizhanP',//水位站全
			}
		}),
		visible:false
	});
	LayerShuiweizhanP.setZIndex(99);
	var LayerShishishuikuzhan1P = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:Shishishuikuzhan1P',//实时水库站优先
			}
		}),
		visible:false
	});
	LayerShishishuikuzhan1P.setZIndex(10);

var LayerShishishuiwenzhan1P = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:Shishishuiwenzhan1P',//实时水文站优先
			}
		}),
		visible:false
	});
	LayerShishishuiwenzhan1P.setZIndex(10);
var LayerShishishuikuzhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShishishuikuzhanP',//实时水库站
			}
		}),
		visible:false
	});
	LayerShishishuikuzhanP.setZIndex(10);
var LayerShishishuiwenzhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShishishuiwenzhanP',//实时水文站
			}
		}),
		visible:false
	});
	LayerShishishuiwenzhanP.setZIndex(10);
var LayerShishishuiweizhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShishishuiweizhanP',//实时水位站
			}
		}),
		visible:false
	});	
	LayerShishishuiweizhanP.setZIndex(10);
var LayerGuoL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:GuoL',//国界L
			}
		}),
		visible:true
	});
	LayerGuoL.setZIndex(99);
var LayerShengR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShengR',//省级行政区划R
			}
		}),
		visible:true
	});
	LayerShengR.setZIndex(9);
var LayerShiR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ShiR',//地级行政区划R
			}
		}),
		visible:false
	});
	LayerShiR.setZIndex(99);
var LayerXianR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:XianR',//县级行政区划R
			}
		}),
		visible:false
	});
	LayerXianR.setZIndex(99);
var LayerHeliuR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:HeliuR',//长江流域河流R
			}
		}),
		visible:false
	});
	LayerHeliuR.setZIndex(9);
var LayerDuanmianNewL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:DuanmianNewL',//断面线NewL
			}
		}),
		visible:false
	});
	LayerDuanmianNewL.setZIndex(99);
var LayerDuanmianOldL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:DuanmianOldL',//断面线OldL
			}
		}),
		visible:false
	});
	LayerDuanmianOldL.setZIndex(99);
	var LayerELV1R = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ELV1R',//高程级1R
			}
		}),
		visible:false
	});
	LayerELV1R.setZIndex(9);
	var LayerELV2R = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ELV2R',//高程级2R
			}
		}),
		visible:false
	});
	LayerELV2R.setZIndex(9);
	var LayerELV3R = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ELV3R',//高程级3R
			}
		}),
		visible:false
	});
	LayerELV3R.setZIndex(9);
	var LayerELV4R = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS:  'DiTu:ELV4R',//高程级4R
			}
		}),
		visible:false
	});
	LayerELV4R.setZIndex(9);
	var LayerELV5R = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ELV5R',//高程级5R
			}
		}),
		visible:false
	});
	LayerELV5R.setZIndex(9);
	var LayerELV6R = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ELV6R',//高程级6R
			}
		}),
		visible:false
	});
	LayerELV6R.setZIndex(9);
	var LayerELVZhoutanR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:ELVZhoutanR',//高程级洲滩R
			}
		}),
		visible:false
	});
	LayerELVZhoutanR.setZIndex(9);
	var LayerDifangL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS:  'DiTu:DifangL',//堤线L
			}
		}),
		visible:false
	});
	LayerDifangL.setZIndex(9);
	this.LayerVectorLocation.setZIndex(0);
      var projection = new Projection({
          code: 'EPSG:4326',
          units: 'degrees',
          axisOrientation: 'neu'
      });
	  var LayerOSM=new TileLayer({
			source: new OSM({
				// projection: projection
				
			   }),
			visible:false
		  })
		  LayerOSM.setZIndex(0);
	  //数组LayAll存储各层///////////////////////////////
		this.LayAll = [
			LayerHeliuR,
			LayerHuanghechangjiangL,
			LayerDuanmianNewL,
			LayerDuanmianOldL,
			LayerShengP,
			LayerShenghuiP,
			LayerDijishiP,
			LayerXianP,
			LayerXiangP,
			LayerCunP,
			LayerShishishuiwenzhan1P,
			LayerShishishuikuzhan1P,
			LayerShishishuiwenzhanP,
			LayerShishishuiweizhanP,
			LayerShishishuikuzhanP,
			LayerShuiwenzhan1P,
			LayerShuiwenzhanP,
			LayerShuiweizhanP,
			LayerHeliuL,
			LayerLiuyubianjie2L,
			LayerGuoL,
			LayerELVZhoutanR,
			LayerELV6R,
			LayerELV5R,
			LayerELV4R,
			LayerELV3R,
			LayerELV2R,
			LayerELV1R,
			LayerShengR,
			LayerShiR,
			LayerXianR,
			LayerDifangL,
			this.LayerVectorLocation,
			LayerOSM
		];
for(var i=0;i<34;i++){
	if(i==3||i==15||i==16||i==17||i==32||i==33){
		this.BLayerSwitch[i] =false;
	}else{
		this.BLayerSwitch[i] =true;
	}
}
var control = new ScaleLine({
	units: 'metric'
	});
	this.view = new View({
		projection:projection,
		minZoom: this.minZoom,
		maxZoom:this.maxZoom
	  });
	  let that=this
  		this.map = new Map({
			controls: defaultControls({
				attribution: false,
				rotate:true,
				zoom:false,
				logo:false,
			}).extend([control,mousePositionControl]),
		  target: 'map',
		  layers: [		
			LayerOSM,
			LayerShengR,
			LayerShiR,
			LayerXianR,
			LayerGuoL,
			LayerHeliuR,
			LayerELV6R,
			LayerELV5R,
			LayerELV4R,
			LayerELV3R,
			LayerELV2R,
			LayerELV1R,
			LayerELVZhoutanR,
			LayerHuanghechangjiangL,
			LayerLiuyubianjie2L,
			LayerHeliuL,
			LayerDifangL,
			LayerDuanmianNewL,
			LayerDuanmianOldL,
			LayerShengP,
			LayerShenghuiP,
			LayerDijishiP,
			LayerXianP,
			LayerXiangP,
			LayerCunP,
			LayerShishishuiwenzhan1P,
			LayerShishishuikuzhan1P,
			LayerShishishuiweizhanP,
			LayerShishishuiwenzhanP,
			LayerShishishuikuzhanP,
			LayerShuiwenzhan1P,
			LayerShuiwenzhanP,
			LayerShuiweizhanP,
			this.LayerVectorLocation,
		  ],
		  view: this.view
		});
		
		// this.map.addControl(control)
		
		  this.map.getView().fit(bounds, this.map.getSize());
	
	this.map.on('singleclick', function(evt) {
		console.log(evt)

		var viewResolution = /** @type {number} */ (that.view.getResolution());
		var url = LayerDuanmianNewL.getSource().getFeatureInfoUrl(
		  evt.coordinate, viewResolution, 'EPSG:4326',
		  {'INFO_FORMAT': 'application/json'});
		  console.log(url)
		if (url) {
		  fetch(url)
			.then(function (response) { return response.json(); })
			.then(function (json) {
				if(json.features.length>0){
					let dmInfo=json.features[0].properties
					that.router.navigate(['/tabs/tab3/guding-dm'], {
						queryParams: {
						  object: JSON.stringify(dmInfo)
						}
					})
				}
			//   document.getElementById('info').innerHTML = html;
			});
		}
			var urlShishishuiku1p = LayerShishishuikuzhan1P.getSource().getFeatureInfoUrl(
				evt.coordinate, viewResolution, 'EPSG:4326',
				{'INFO_FORMAT': 'application/json'});
			if (urlShishishuiku1p) {
				fetch(urlShishishuiku1p)
				.then(function (response) { return response.json(); })
				.then(function (json) {
					if(json.features.length>0){
						let shishiInfo=json.features[0].properties
						that.router.navigate(['/tabs/tab2/river-info'], {
							queryParams: {
								object: JSON.stringify(shishiInfo)
							}
						})
					}
				//   document.getElementById('info').innerHTML = html;
				});
			}
			var urlShishishuiku = LayerShishishuikuzhanP.getSource().getFeatureInfoUrl(
				evt.coordinate, viewResolution, 'EPSG:4326',
				{'INFO_FORMAT': 'application/json'});
			if (urlShishishuiku) {
				fetch(urlShishishuiku)
				.then(function (response) { return response.json(); })
				.then(function (json) {
					if(json.features.length>0){
						let shishiInfo=json.features[0].properties
						that.router.navigate(['/tabs/tab2/river-info'], {
							queryParams: {
								object: JSON.stringify(shishiInfo)
							}
						})
					}
				//   document.getElementById('info').innerHTML = html;
				});
			}
			var urlShishishuiwenzhanP = LayerShishishuiwenzhanP.getSource().getFeatureInfoUrl(
				evt.coordinate, viewResolution, 'EPSG:4326',
				{'INFO_FORMAT': 'application/json'});
			if (urlShishishuiwenzhanP) {
				fetch(urlShishishuiwenzhanP)
				.then(function (response) { return response.json(); })
				.then(function (json) {
					if(json.features.length>0){
						let shishiInfo=json.features[0].properties
						that.router.navigate(['/tabs/tab2/hyd-info'], {
							queryParams: {
								object: JSON.stringify(shishiInfo)
							}
						})
					}
				//   document.getElementById('info').innerHTML = html;
				});
			}
		var url1 = LayerShishishuiwenzhan1P.getSource().getFeatureInfoUrl(
				  evt.coordinate, viewResolution, 'EPSG:4326',
				  {'INFO_FORMAT': 'application/json'});
		if (url1) {
			fetch(url1)
			.then(function (response) { return response.json(); })
			.then(function (json) {
				if(json.features.length>0){
					let shishiInfo=json.features[0].properties
					that.router.navigate(['/tabs/tab2/hyd-info'], {
						queryParams: {
							object: JSON.stringify(shishiInfo)
						}
					})
				}
			//   document.getElementById('info').innerHTML = html;
			});
		}
		var url2 = LayerShishishuiweizhanP.getSource().getFeatureInfoUrl(
					evt.coordinate, viewResolution, 'EPSG:4326',
					{'INFO_FORMAT': 'application/json'});
		if (url2) {
			fetch(url2)
			.then(function (response) { return response.json(); })
			.then(function (json) {
				if(json.features.length>0){
					let shishiInfo=json.features[0].properties
					console.log(shishiInfo)
					that.router.navigate(['/tabs/tab2/hyd-info'], {
						queryParams: {
							object: JSON.stringify(shishiInfo)
						}
					})
				}
			//   document.getElementById('info').innerHTML = html;
			});
		}
						
		var urlswq = LayerShuiwenzhan1P.getSource().getFeatureInfoUrl(
			evt.coordinate, viewResolution, 'EPSG:4326',
			{'INFO_FORMAT': 'application/json'});
		if (urlswq) {
		fetch(urlswq)
			.then(function (response) { return response.json(); })
			.then(function (json) {
				if(json.features.length>0){
					let csInfo=json.features[0].properties
					console.log(csInfo)
					that.router.navigate(['/tabs/tab2/process-line'], {
						queryParams: {
						object: JSON.stringify(csInfo)
						}
					})
				}
			//   document.getElementById('info').innerHTML = html;
			});
		}
		var urlsw = LayerShuiwenzhanP.getSource().getFeatureInfoUrl(
		evt.coordinate, viewResolution, 'EPSG:4326',
		{'INFO_FORMAT': 'application/json'});
		if (urlsw) {
		fetch(urlsw)
			.then(function (response) { return response.json(); })
			.then(function (json) {
				if(json.features.length>0){
					let csInfo=json.features[0].properties
					console.log(csInfo)
					that.router.navigate(['/tabs/tab2/process-line'], {
						queryParams: {
						object: JSON.stringify(csInfo)
						}
					})
				}
			//   document.getElementById('info').innerHTML = html;
			});
		}
		var urlswei = LayerShuiweizhanP.getSource().getFeatureInfoUrl(
		evt.coordinate, viewResolution, 'EPSG:4326',
		{'INFO_FORMAT': 'application/json'});
		if (urlswei) {
		fetch(urlswei)
			.then(function (response) { return response.json(); })
			.then(function (json) {
				if(json.features.length>0){
					let csInfo=json.features[0].properties
					console.log(csInfo)
					that.router.navigate(['/tabs/tab2/process-line'], {
						queryParams: {
						object: JSON.stringify(csInfo)
						}
					})
				}
			//   document.getElementById('info').innerHTML = html;
			});
		}
	  });
	
	
	this.map.on('moveend', function (evt) {
		that.SetLayerVisable();
	});
	$('.ol-attribution').hide()
	
	
  }
  
 
}
