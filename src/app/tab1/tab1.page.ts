import * as $ from '../../../node_modules/jquery/dist/jquery.js';
import { Component } from '@angular/core';


import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {getBottomLeft, getTopRight} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import {toLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';

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
  constructor() {
  	
  }
  ionViewDidEnter(){
  	this.initmap()
  }
  ionViewDidLeave(){
  	$('#map').html('')
  }
  initmap(){
  
  		this.map = new Map({
		  target: 'map',
		  layers: [
		    new TileLayer({
		    	source:new OSM()
		    })
		  ],
		  view: new View({
		    center: [114.31, 30.51],
		    zoom: 2
		  })
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
