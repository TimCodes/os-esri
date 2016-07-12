(function(){
    'use strict';

    angular
        .module('os-esri-components')
        .service('OsMapService', Service)

    function Service($rootScope){
        
        var serviceThis = this;
        
        this.fn = fn;
        this.map;
        this.isMapLoaded; 
        
        this.newFeatureLayer;
        this.newDynamicLayer;
        
        this.featureLayers = [];
        this.dynamicLayers = [];
        
        var thisMap; 

        function fn(){
            

        }
        require(["esri/map", "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer", 
         "esri/InfoTemplate","dojo/domReady!"],
        function(Map, FeatureLayer, DynamicLayer, infoTemplate) {
              thisMap = Map;
              serviceThis.newFeatureLayer = FeatureLayer;
              serviceThis.newDynamicLayer = DynamicLayer;
        }); 
        
        
        this.createMap = function (mapDefination) {
             this.map =  new thisMap("map",mapDefination)
             
             this.map.on('layers-removed', function (evt) {
                 console.log('layer removed')
                 console.log(evt);
             })
             
             this.map.on('load', function (evt) {
                 $rootScope.$emit('os-map-loaded', {evt: evt, map:map} )
             });
              
             return this.map;
        }; 
        
        this.getMap = function (argument) {
            console.log('get map ')
            return this.map;
        };
        
        this.addFeatureLayer = function (layer) {
            var aLayer = this.newFeatureLayer(layer);
            this.featureLayers.push(aLayer);
            this.map.addLayer(aLayer);
            
            return aLayer
        };
        
        this.getFeatureLayer = function(){
            
        };
        
        this.getFeatureLayers = function(){
            
        };
        
        this.addDynamicLayer = function (layer) {
            // body...
        };
        
        this.getDynamicLayer = function(){
            
        };
        
        this.getFeatureLayers = function(){
            
        }
    }

}());