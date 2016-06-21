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

        function osMapComponentController($rootScope){
            var vm = this;
            
            var panels = [];
            
      
           vm.$postLink = function () {
               // body...
                  
             require(["esri/map",  "dojo/domReady!"], function(Map) {
               console.log(vm.mapDefination)
              var map = new Map("map",vm.mapDefination);
              
              map.on('load', function (evt) {
                 $rootScope.$emit('os-map-loaded', evt)
              });
              
              
            window.myMap = map;
             
              map.on('layer-add', function (evt) {
                $rootScope.$emit('os-map-layeradd', evt)
                // testing some stuff here 
           /*     console.log('layer added')
                console.log(evt)
                
                console.log('graphci layer ids')
                console.log(map.graphicsLayerIds)
                
                 console.log( 'layer ids')
                 console.log(map.layerIds)
                 
                 console.log(' first grpahics layer')
                 console.log(map.getLayer(map.graphicsLayerIds[0]))
                 
                 var layer = map.getLayer(map.graphicsLayerIds[0]);
                 console.log(layer.type)
                 console.log(layer.fields)
                 for(var prop in layer){
                  // console.log(prop)
                 }*/
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