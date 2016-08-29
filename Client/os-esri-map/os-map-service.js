(function() {
    'use strict';

    angular
        .module('os-esri-components')
        .service('OsMapService', OsMapService)

    function OsMapService($rootScope, $q, $timeout) {

        var serviceThis = this;

        this.map;
        this.isMapLoaded = false;

        this.layers = [];

        var thisMap;


        require(["esri/map", "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/InfoTemplate", "dojo/domReady!"
            ],
            function(Map, FeatureLayer, DynamicLayer, InfoTemplate) {
                thisMap = Map;
                serviceThis.newFeatureLayer = FeatureLayer;
                serviceThis.newDynamicLayer = DynamicLayer;
                serviceThis.newInfoTemplate = InfoTemplate;
            });


        this.createMap = function(mapDefination) {

            if (thisMap) {
                // need new instance everytime map is intiated
                this.map = undefined;
                this.layers = []

                this.map = new thisMap("map", mapDefination)

                this.map.on('layers-removed', function(evt) {
                   $rootScope.$emit('os-map-layerremove',{
                        map: this.map,
                        evt: evt
                    }) 
                });

                this.map.on('load', function(evt) {
                    $rootScope.$emit('os-map-loaded', {
                        evt: evt,
                        map: this.map
                    })
                });

                this.map.on('layer-add', function(evt) {
                    $rootScope.$emit('os-map-layeradd', {
                        map: this.map,
                        evt: evt
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
            return this.map;
        };

        this.addFeatureLayer = function(layerUrl, name, infoTemplate) {

            return __checkMapStatus()
                .then(function() {
                    var defination = {
                        mode: serviceThis.newFeatureLayer.MODE_SNAPSHOT,
                        outFields: ["*"],
                        infoTemplate: infoTemplate ? new serviceThis.newInfoTemplate(infoTemplate) : ""

                    }
                    var fLayer = serviceThis.newFeatureLayer(layerUrl, defination);
                    serviceThis.map.addLayer(fLayer);
                    serviceThis.layers.push({
                        id: fLayer.id,
                        name: name || " ",
                        type: 'FeatureLayer',
                        visible: fLayer.visible,
                        opacity: fLayer.opacity
                    });
                    console.log(serviceThis.layers)
                    return fLayer;
                })

        };



        this.addDynamicLayer = function(layer, name) {
            return __checkMapStatus()
                .then(function() {
                    var dLayer = serviceThis.newDynamicLayer(layer);
                    serviceThis.map.addLayer(dLayer);
                    serviceThis.layers.push({
                        id: dLayer.id,
                        name: name || " ",
                        type: 'DynamicLayer',
                        visible: dLayer.visible,
                        opacity: dLayer.opacity
                    });

                    return dLayer
                })
        };


        this.getLayer = function(layerName) {
            var layer = this.layers.filter(function(el, idx, arr) {
                return el.name === layerName;
            });
            return layer[0];

        };

        this.getLayers = function() {
            return this.layers;
        };


        function __checkMapStatus() {
            var defer = $q.defer()
            var retryLimit = 10;
            var retryCounter = 0;

            function checkMapStatus() {

                if (retryCounter >= retryLimit) {
                    defer.reject('max retry count reached')
                }

                if (serviceThis.map && serviceThis.map.loaded) {
                    defer.resolve('map loaded')
                }
                else {
                    setTimeout(function() {
                        checkMapStatus()
                    }, 300)
                }

                retryCounter++
            }

            checkMapStatus();
            return defer.promise
        }


    }


}());