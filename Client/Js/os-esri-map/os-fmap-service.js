(function() {
    'use strict';

    angular
        .module('os-esri-components')
        .service('OsMapService', Service)

    function Service($rootScope, $q, $timeout) {

        var serviceThis = this;

        this.fn = fn;
        this.map;
        this.isMapLoaded = false;
        
        this.layers = [];

        var thisMap;

        function fn() {


        }
        require(["esri/map", "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/InfoTemplate", "dojo/domReady!"
            ],
            function(Map, FeatureLayer, DynamicLayer, infoTemplate) {
                thisMap = Map;
                serviceThis.newFeatureLayer = FeatureLayer;
                serviceThis.newDynamicLayer = DynamicLayer;
            });


        this.createMap = function(mapDefination) {

            if (thisMap) {

                this.map = new thisMap("map", mapDefination)

                this.map.on('layers-removed', function(evt) {
                    console.log('layer removed')
                    console.log(evt);
                })

                this.map.on('load', function(evt) {
                    console.log('******************loaded**************')
                    serviceThis.isMapLoaded = true;
                    console.log(serviceThis.isMapLoaded)
                    $rootScope.$emit('os-map-loaded', {
                        evt: evt,
                        map: map
                    })
                });
                
                this.map.on('layer-add', function(evt) {
                    console.log('layer added -----------------')
                    console.log(serviceThis.layers)
                   $rootScope.$emit( 'os-map-layeradd', {
                       map: this.map
                   })
                })

                return this.map;

            }
            else {
                setTimeout(function() {
                    serviceThis.createMap(mapDefination)
                }, 200)
            }



        };

        this.getMap = function(argument) {
            console.log('get map ')
            return this.map;
        };

        this.addFeatureLayer = function(layerUrl, name) {

            return __checkMapStatus()
                .then(function() {
                    var fLayer = serviceThis.newFeatureLayer(layerUrl);
                    serviceThis.map.addLayer(fLayer);
                    serviceThis.layers.push( {id : fLayer.id, name: name || " ", type: 'FeatureLayer'});
                    
                    return fLayer
                })

        };



        this.addDynamicLayer = function(layer, name) {
            return __checkMapStatus()
                .then(function() {
                    var dLayer = serviceThis.newDynamicLayer(layer);
                    serviceThis.map.addLayer(dLayer);
                    serviceThis.layers.push({id : dLayer.id, name: name || " ", type: 'DynamicLayer'});

                    return dLayer
                })
        };

        
        this.getLayer = function(layerName) {
            
          var layer = this.layers.filter(function(el, idx, arr){
                
                return el.name === layerName;
          });
          
          
          return this.map.getLayer(layer[0].id);
            
        };

        this.getLayers = function() {
            return this.layers;
        };
        
        setTimeout(function() {
            console.log(serviceThis.getLayer('test'))
        }, 5000)
      

        function __checkMapStatus() {
            var defer = $q.defer()
            var retryLimit = 10;
            var retryCounter = 0;

            function checkMapStatus() {
                console.log('ceck load status')
                console.log(serviceThis.map.loaded)
                if (retryCounter >= retryLimit) {
                    defer.reject('max retry count reached')
                }

                if (serviceThis.map.loaded) {
                    defer.resolve('map loaded')
                }
                else {
                    setTimeout(function() {
                        checkMapStatus()
                    }, 100)
                }

                retryCounter++
            }

            checkMapStatus();
            return defer.promise
        }


    }
    

}());