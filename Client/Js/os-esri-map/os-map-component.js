(function(){
    'use strict';
    
    angular
    .module("os-esri-components")
    // think hyou cant name with dashes
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
        }

        function osMapComponentController($rootScope,OsMapService){
            var vm = this;
            
            var panels = [];
            
      
           vm.$onInit = function () {
               // body...
                  
             require(["esri/map",  "dojo/domReady!"], function(Map) {
              console.log(vm.mapDefination)
              var map = OsMapService.createMap(vm.mapDefination);
              
             // new Map("map",vm.mapDefination);
              
              $rootScope.$emit('os-map-init', map )
              
              map.on('load', function (evt) {
                 $rootScope.$emit('os-map-loaded', {evt: evt, map:map} )
              });
              
              
            window.myMap = map;
             
              map.on('layer-add-result', function (evt) {
                console.log("layer added")
                console.log(evt)
                console.log(map.layerIds)
                console.log(map.basemapLayerIds)
                console.log('----------------------- base map --------------------')
                console.log(map.getBasemap());
                console.log("-----------------visible laysers------------------");
                console.log(map.getLayersVisibleAtScale())
                $rootScope.$emit('os-map-layeradd', {evt:evt, map: map})
            
              })
              // binds map to 'this' as a propty called map
              vm.map = map;
              
              
            });   
            
          }
          
        }
    }   
}())



/*


*/