import * as $ from '../../../node_modules/jquery/dist/jquery.js';
import { Component } from '@angular/core';


import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';
import {Map,View} from 'ol'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import MousePosition from 'ol/control/MousePosition';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {getBottomLeft, getTopRight} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import {toLonLat,Projection} from 'ol/proj';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import { createStringXY } from 'ol/coordinate'
import ImageWMS from 'ol/source/ImageWMS';
import { importExpr } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	selectStation:any={
		stationName:'三峡',
		waterLev:'12m',
		flow:'300m³/s'
	};
	map:any;
	 minZoom=5;
	 maxZoom=16;
	 BLayerSwitch =new Array(21);

	LayerZoom =[
		[this.minZoom,this.maxZoom],//var 00BLayerHeliuR;
		[this.minZoom,8],//01BLayerHuanghechangjiangL;
		[12,this.maxZoom],//02BLayerDuanmianNewL;
		[12,this.maxZoom],//03BLayerDuanmianOldL;
		[this.minZoom,6],//04BLayerShengP;
		[6,10],//05BLayerShenghuiP;
		[8,11],//06BLayerDijishiP;
		[9,this.maxZoom],//07BLayerXianP;
		[11,this.maxZoom],//08BLayerXiangP;
		[13,this.maxZoom],//09BLayerCunP;
		[6,10],//10BLayerShishizhan1L;
		[11,this.maxZoom],//11BLayerShishizhanL;
		[6,8],//12BLayerShuiwenzhan1;
		[9,this.maxZoom],//13BLayerShuiwenzhan;
		[11,this.maxZoom],//14BLayerShuiweizhan;
		[10,this.maxZoom],//15LayerHeliu;
		[this.minZoom,this.maxZoom],//16BLayerLiuyubianjie2;
		[this.minZoom,this.maxZoom],//17BLayerGuoL;
		[this.minZoom,7],//18BLayerShengR;
		[8,9],//19BLayerShiR;
		[10,this.maxZoom]//20BLayerXianR;
		];
		LayAll;
  constructor() {
  	
  }
  ionViewDidEnter(){
	  this.initmap()
	//   setInterval("getLocation()", 5000);
  }
  ionViewDidLeave(){
  	$('#map').html('')
  }
  SetLayerVisable(){
	var mapZoom=this.map.getView().getZoom();
	for(var i=0;i<21;i++){
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
	var BLayerSwitch =new Array(21);
	for(var i=0;i<21;i++){
		if(i==3||i==12||i==13||i==14){
			BLayerSwitch[i] =false;
		}else{
			BLayerSwitch[i] =true;
		}
	}
	
  //创建一个定位图标的风格
// var locationStyle = Style({
// 	image: new CircleStyle({//圆
//     radius: 10,//半径
//     fill: new Fill({//圆填充色
// 		color: 'rgba(0,0,255,0.5)'
//     }),
//     stroke: new Stroke({//圆边线样式
//         color: 'rgba(0,255,0,0.5)',
//         width: 1
//     })
//     })
// });

 //创建定位图标的数据源、图层，加入MAP 
var vectorsource = new VectorSource();
var LayerVectorLocation = new VectorLayer({
    source: vectorsource
});

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
	var mousePositionControl = new MousePosition({
			className: 'custom-mouse-position',
			target: document.getElementById('location'),
			coordinateFormat: createStringXY(5),
			undefinedHTML: '&nbsp;'
		});
		var url='http://10.6.13.247:8500/geoserver/DiTu/wms'
	var LayerShenghuiP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:全国省会城市P',
			}
		}),
		visible:false
	});
var LayerHuanghechangjiangL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:黄河长江干流L',
			}
		}),
		visible:true
	});
var LayerShengP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:全国省P',
			}
		}),
		visible:true
	});
var LayerDijishiP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:全国地级城市P',
			}
		}),
		visible:false
	});
var LayerXianP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:全国县P',
			}
		}),
		visible:false
	});
var LayerXiangP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:长江流域25万乡镇P',
			}
		}),
		visible:false
	});
var LayerCunP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:长江流域25万村P',
			}
		}),
		visible:false
	});
var LayerLiuyubianjie2L = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:长江流域边界2L',
			}
		}),
		visible:true
	});
var LayerHeliuL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:长江流域河流L',
			}
		}),
		visible:false
	});
var LayerShuiwenzhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:水文站全',
			}
		}),
		visible:false
	});
var LayerShuiwenzhan1P = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:水文站优先',
			}
		}),
		visible:false
	});
var LayerShuiweizhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:水位站全',
			}
		}),
		visible:false
	});
var LayerShishizhan1P = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:实时站优先',
			}
		}),
		visible:false
	});
var LayerShishizhanP = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:实时站全',
			}
		}),
		visible:false
	});
var LayerGuoL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:国界L',
			}
		}),
		visible:true
	});
var LayerShengR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:省级行政区划R',
			}
		}),
		visible:true
	});
var LayerShiR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:地级行政区划R',
			}
		}),
		visible:false
	});
var LayerXianR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:县级行政区划R',
			}
		}),
		visible:false
	});
var LayerHeliuR = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:长江流域河流R',
			}
		}),
		visible:false
	});
var LayerDuanmianNewL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:断面线NewL',
			}
		}),
		visible:false
	});
	
var LayerDuanmianOldL = new ImageLayer({
		source: new ImageWMS({
			ratio: 1,
			url: url,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				STYLES: '',
				LAYERS: 'DiTu:断面线OldL',
			}
		}),
		visible:false
	});
      var projection = new Projection({
          code: 'EPSG:4326',
          units: 'degrees',
          axisOrientation: 'neu'
      });
	  
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
	LayerShishizhan1P,
	LayerShishizhanP,
	LayerShuiwenzhan1P,
	LayerShuiwenzhanP,
	LayerShuiweizhanP,
	LayerHeliuL,
	LayerLiuyubianjie2L,
	LayerGuoL,
	LayerShengR,
	LayerShiR,
	LayerXianR
];
for(var i=0;i<21;i++){
	if(i==3||i==12||i==13||i==14){
		this.BLayerSwitch[i] =false;
	}else{
		this.BLayerSwitch[i] =true;
	}
}
  		this.map = new Map({
		  target: 'map',
		  layers: [
		    LayerVectorLocation,
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
			LayerShishizhan1P,
			LayerShishizhanP,
			LayerShuiwenzhan1P,
			LayerShuiwenzhanP,
			LayerShuiweizhanP,
			LayerHeliuL,			
			LayerLiuyubianjie2L,
			LayerGuoL,
			LayerShengR,
			LayerShiR,
			LayerXianR,
		  ],
		  view: new View({
			projection:projection,
			minZoom: this.minZoom,
			maxZoom:this.maxZoom
		  })
		});
		
		this.map.getView().on('change:resolution', function(evt) {
			var resolution = evt.target.get('resolution');
			// var units = this.map.getView().getProjection().getUnits();
			// var dpi = 25.4 / 0.28;
			// var mpu = Projection.METERS_PER_UNIT[units];
			// let scale = resolution * mpu * 39.37 * dpi;
			// if (scale >= 9500 && scale <= 950000) {
			// //   scale = Math.round(scale / 1000) + "K";
			// } else if (scale >= 950000) {
			// //   scale = Math.round(scale / 1000000) + "M";
			// } else {
			//   scale = Math.round(scale);
			// }
			//document.getElementById('scale').innerHTML = "Scale = 1 : " + scale;
		  });
		  this.map.getView().fit(bounds, this.map.getSize());
		  this.map.on('singleclick', function(evt) {
			
		  });
	
	
	//设定各层显示范围//////////////////////////////
	
	var that=this
	//var LayerZoom =[[minZoom,maxZoom],[minZoom,8],[12,maxZoom],[12,maxZoom],[minZoom,6],[6,10],[8,11],[9,maxZoom],[11,maxZoom],[13,maxZoom],[6,10],[11,maxZoom],[6,8],[9,maxZoom],[11,maxZoom],[10,maxZoom],[minZoom,maxZoom],[minZoom,maxZoom],[minZoom,7],[8,9],[10,maxZoom]];
	this.map.on('moveend', function (evt) {
		that.SetLayerVisable();
	});
		 $('.ol-attribution').hide()

		function wrapLon(value) {
		  var worlds = Math.floor((value + 180) / 360);
		  return value - (worlds * 360);
		}

		function onMoveEnd(evt) {
			
		  var map = evt.map;
		  var extent = map.getView().calculateExtent(map.getSize());
		  var bottomLeft = toLonLat(getBottomLeft(extent));
		  var topRight = toLonLat(getTopRight(extent));
		  
		}

		this.map.on('moveend', onMoveEnd);
  }

}
