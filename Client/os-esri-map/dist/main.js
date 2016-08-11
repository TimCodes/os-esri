(function(){
    'use strict';
    
    // define module here
    // module takes two arugments
    // first is the name of your module
    // second is an array of dependencies
    // good idea to prepent names with something
    // to avoid naming collesiosn with other libraries
    // hence the os
    angular.module('os-esri-components', [
      'ng-sortable',
      'ngTouchstart'
     
    ]);
    // inlude ; at end of file or it will mess with concat and minimize
}());

(function() {
    'use strict';

    angular
        .module('os-esri-components')
        .service('OsMapService', Service)

    function Service($rootScope, $q, $timeout) {

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
                    }, 100)
                }

                retryCounter++
            }

            checkMapStatus();
            return defer.promise
        }


    }


}());
(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osBasemapToggle", buildComponent())

    function buildComponent() {
       
        return {

            templateUrl: 'basemaps.html',
            controller: osSearchController,
            controllerAs: 'vm',
            bindings: {
                
               baseMaps: '<'
                
            },

        };

        function osSearchController($rootScope, $scope, OsMapService) {
            var vm = this;
            vm.maps =  vm.baseMaps || ["streets" , "satellite" , "hybrid" , "topo" , "gray", "terrain" ];
            vm.changeBaseMap = function(map){
                OsMapService.getMap().setBasemap(map);
            }
        };
    };

}());
angular.module('os-esri-components').directive('ngDraggable', function($document, $window) {
    function makeDraggable(scope, element, attr) {
        var startX = 0;
        var startY = 0;

        // Start with a random pos
        var x =0
        var y = 0

       

        element.on('mousedown', function(event) {
            //event.preventDefault();

            startX = event.pageX - x
            startY = event.pageY - y

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
            y = event.pageY - startY;
            x = event.pageX - startX;

            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    }
    return {
        link: makeDraggable
    };
});
(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osDynamicLayer", buildComponent())

    function buildComponent() {

        return {


            controller: osFeatureLayercontroller,
            controllerAs: 'vm',
            bindings: {
                durl: '@',
                dname: '@',
                osInfoTemplateTitle: '@',
                osInfoTemplateBody: '@'
            },
            require: {
                "mapCtrl": "^osMap"
            },


        };

        function osFeatureLayercontroller($rootScope, OsMapService) {
            var vm = this;
            vm.$postLink = function() {
              OsMapService.addDynamicLayer(vm.durl, vm.dname);
            };
        };
    };

}());

(function() {
    'use strict';

    angular
    .module("os-esri-components")
    .component("osFeatureLayer", buildComponent())

    function buildComponent() {

        return {


            controller: osFeatureLayercontroller,
            controllerAs: 'vm',
            bindings: {
                furl: '@',
                fname: '@',
                infoTemplate: '<',
                fclick: '&'
            }


        }

        function osFeatureLayercontroller($rootScope, OsMapService) {
            var vm = this;
            vm.$postLink = function() {
                var infoTemp = vm.infoTemplate ? vm.infoTemplate : undefined;
                OsMapService.addFeatureLayer(vm.furl, vm.fname, infoTemp)
                .then(function(fLayer) {
                 var featureLayer = fLayer;
                  //broadcast layer click event to binding
                  featureLayer.on('click', function(evt) {
                        vm.fclick({evt: evt});
                    });
                 })
            }
        };
    };

}());

(function() {
    'use strict',

    angular
    .module("os-esri-components")
    .component("osHomeButton", buildComponent())

    function buildComponent() {
        return {


            controller: osHomeButtonController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            template: '<div id="HomeButton" class = "{{vm.osClass}}"> </div>'


        }

        function osHomeButtonController($rootScope, OsMapService) {
            var vm = this;

            vm.$postLink = function() {

                /*
                   this is the best way to ensure the map is loaded,
                   before trying to add anythinng, its easy to run into
                   asynchronous race conditions when seperating map
                   components
                */
                $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                    require([ "esri/dijit/HomeButton", "dojo/domReady!"],
                    function( HomeButton) {
                            var home = new HomeButton({ map: OsMapService.getMap() }, "HomeButton");
                            home.startup();
                    });
                });
            };
        };
    };

}());

(function() {
    'use strict',

    angular
    .module("os-esri-components")
    .component("osLayerList", buildComponent())

    function buildComponent() {

        return {


            controller: osLayerListController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@',
                isSortable: '<',
                layers: '<'
            },
            templateUrl: 'layerlist.html'


        }

        function osLayerListController($rootScope, $scope, OsMapService) {
           
          
            var vm = this;
            vm.test = {};
            vm.layers = [];
            vm.map = OsMapService.getMap();

            vm.barConfig = {
                group: 'foobar',
                animation: 150,
                disabled: false,
                // filter:'.mdl-slider',
                onSort: function( /** ngSortEvent */ evt) {vm.layers.forEach(function(el, idx, arr) {
                        var layer = OsMapService.getMap().getLayer(el.id);
                        OsMapService.getMap().reorderLayer(layer, idx);
                    })


                }
            };
            
            $scope.$watch("vm.test", function (newVal, oldVal) {
                for (var prop in newVal) {
                    if(newVal[prop] !== oldVal[prop]){
                         var layer = OsMapService.getMap().getLayer(prop);
                         layer.setOpacity(newVal[prop]);
                    }
                    
                }
             
            }, true);

            vm.stop = function(evt) {
                vm.barConfig.disabled = true;

            };
            

            vm.start = function() {
                vm.barConfig.disabled = false;
            };

            vm.setopacity = function(id, evt) {
            
              // var layer = OsMapService.getMap().getLayer(id);
               // layer.setOpacity(evt.target.value)
            };

            vm.setViz = function(id, evt) {

                var layer = OsMapService.getMap().getLayer(id);
                layer.setVisibility(evt.target.checked)

            };

            vm.finished = function() {
                setTimeout(function(argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)


            };



            $rootScope.$on('os-map-loaded', function(evt, event) {
               addLayertoList(OsMapService.getMap());
             })

            $rootScope.$on('os-map-layeradd', function() {
                addLayertoList(OsMapService.getMap());
            });
            


            function addLayertoList(map) {

               // reset layer list
               // reset ;
               
               vm.layers = [];
                
               OsMapService.getLayers().forEach(function(el, idx, arr) {
        
                    var layer = OsMapService.getLayer(el.name);
                            
                    if ( isLayerinList(layer)) {
                        console.log(layer.visible)
                       vm.layers.push({
                                name:  el.name || layer._attrs.name || layer.id ,
                                id: layer.id,
                                opacity: layer.opacity,
                                visible: layer.visible
                        });
                        
                        vm.test[layer.id] = layer.opacity
                    };
                    setTimeout(function(argument) {
                          componentHandler.upgradeAllRegistered()
                     }, 200);

               });



            };
            
            function isLayerinList(layer){;
              var ids =  vm.layers.map(function(x) { return x.id;})
              return ids.indexOf(layer.id) === -1;
            };
        };
    };

}());


(function() {
    'use strict',



    angular
    .module("os-esri-components")
    .component("osLocateButton", buildComponent())

    function buildComponent() {

        return {


            controller: osLocateButtonController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            template: '<div id="LocateButton" class = "{{vm.osClass}}"> </div>'

            
        }

        function osLocateButtonController($rootScope, OsMapService) {
            var vm = this;
          
            vm.$onInit = function() {
                $rootScope.$on('os-map-loaded', function(evt, mapEvt) {

                    require(["esri/dijit/LocateButton"],
                    function(LocateButton) {

                        var geoLocate = new LocateButton({
                                map: OsMapService.getMap()
                            }, "LocateButton");
                            geoLocate.startup();

                     });
                });
            };
        };
    };

}());



(function(){
    'use strict';
    
    angular
    .module("os-esri-components")
    .component("osMap", mapComponent())

    function mapComponent(){
      
       return {
            bindings: {
              mapDefination: '<'
            },
            controller: osMapComponentController,
            controllerAs: 'vm',
            transclude: true,
            template: "<div id= 'map' ><ng-transclude> </ng-transclude> </div>"
        };

        function osMapComponentController($rootScope,OsMapService){
            var vm = this;
            var map;
            
            var panels = [];
            map = OsMapService.createMap(vm.mapDefination);
          
        };
     };   
}());

(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osSearch", buildComponent())

    function buildComponent() {
       
        return {

            template: '<div id="search"></div>',
            controller: osSearchController,
            controllerAs: 'vm',
            bindings: {
                
               // osClass: '@'
                
            },
            require: {
             "mapCtrl": "^osMap"
            },

        };

        function osSearchController() {
            var vm = this;

            vm.$postLink = function() {

                require([ "esri/dijit/Search", "dojo/domReady!" ], 
                function(Search) {

                    var search = new Search({
                     enableButtonMode: true, //this enables the search widget to display as a single button
                     enableLabel: false,
                     enableInfoWindow: true,
                     showInfoWindowOnSelect: false,
                        map: vm.mapCtrl.map
                    }, "search");
                    search.startup();

                });
            };
        };
    };

}());
(function() {
    'use strict';

    angular
        .module('os-esri-components')
        .controller('main', ControllerController);

    ControllerController.$inject = ['$scope', '$rootScope', 'OsMapService'];

    function ControllerController($scop, $rootScope, OsMapService) {
        var vm = this;
        vm.showLayers = false;
        vm.showBasemaps = false;

        activate();

        ////////////////

        function activate() {


        }
        
        vm.maps =   ["streets" , "satellite" ]

        vm.wellsInfo = {
            title: "Wells",
            content: "Current Owner: ${CURR_OWNER}</br>" +
                "Original Owner: ${ORIG_OWNER}</br>ID : ${well_id} </br>USE: ${USE_ }</br>"
        }
        
         vm.togleLayers = function(argument) {
            vm.showLayers = !vm.showLayers;
        };
        vm.togleLayers = function(argument) {
            vm.showLayers = !vm.showLayers;
        };

        vm.toggleBaseMaps = function() {
            vm.showBasemaps = !vm.showBasemaps;
        };


        vm.bMapShow = function(isVisible) {
            vm.showBasemaps = isVisible
        };

        vm.layersShow = function(isVisible) {
            vm.showLayers = isVisible
        };

        vm.testClick = function(e) {
            console.log('test click');
            console.log(e);

            alert(JSON.stringify(e.graphic.geometry))
            alert(JSON.stringify(e.graphic.attributes))
        };



    }
})();