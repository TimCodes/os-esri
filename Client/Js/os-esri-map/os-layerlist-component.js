(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osLayerList", buildComponent())

    function buildComponent() {

        return {


            controller: osLayerListController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            require: {


            },
            templateUrl: 'layerlist.html'


        }

        function osLayerListController($rootScope, $scope, OsMapService) {
            var vm = this;
            vm.layers = [];
            vm.map= OsMapService.getMap();
           
            vm.barConfig = {
                group: 'foobar',
                animation: 150,
                disabled: false,
               // filter:'.mdl-slider',
                onSort: function( /** ngSortEvent */ evt) {
                    vm.layers.forEach(function (el, idx, arr) {
                       var layer =getMap().getLayer(el.id);
                       getMap().reorderLayer(layer, idx);
                    }) 
                    
                    
                }
            }
            
            vm.stop = function (evt) {
                // body...
                vm.barConfig.disabled = true;
               
            };
            vm.$postLink = function(){
                
                addLayertoList(getMap())
            }
            
            vm.start = function () {
                vm.barConfig.disabled = false;
            };
            
            vm.setopacity = function (id, evt) {
         
              var layer = getMap().getLayer(id);
              layer.setOpacity(evt.target.value)
            }
            
           vm.setViz = function (id, evt) {
              
                var layer =OsMapService.getMap().getLayer(id);
                layer.setVisibility(evt.target.checked)
               
           }

            vm.finished = function() {
                setTimeout( function (argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)
               
               
            };
            
           
            
             $rootScope.$on('os-map-loaded', function(evt, event) {
                
                 addLayertoList(event.map)
                 
             })

            $rootScope.$on('os-map-layeradd', function(evt, event) {
              addLayertoList(event.map);
              

            }); 
              
            function getMap(){
               return OsMapService.getMap();
            }
               

           

            function addLayertoList(map){
                

                vm.layers = [];
                map.getLayersVisibleAtScale().forEach(function(el, idx, arr) {
                    console.log(arr.length);
                    var layer = map.getLayer(el.id);
                   console.log("-------------------- idx ------------------")
                   console.log(idx);
                   console.log('--------------------------layer ----------------------')
                   console.log(layer)
                    if (  vm.layers.map(function(x) {return x.id; }).indexOf(layer.id) === -1) {
                        $scope.$apply(function(argument) {
                       
                             vm.layers.push({
                            name: layer._attrs.name || layer.name || layer.layerInfos[0].name  || layer.id || layer.layerInfos[0].name,
                            id: layer.id,
                            opacity: layer.opacity,
                            visible: layer.visible
                        });
                          
                      
                        console.log(layer)
                        console.log(layer.layerInfos)
                    })
                    } else {
                        console.log('layer already present')
                    }
                    
                  

                });
              /*
                map.graphicsLayerIds.forEach(function(el, idx, arr) {
                    var layer = map.getLayer(el);
                     
                 //   console.log('----------------- layer list check --------------------');
                    console.log(  vm.layers.map(function(x) {return x.id; }).indexOf(layer.id))
                    if (  vm.layers.map(function(x) {return x.id; }).indexOf(layer.id) === -1) {
                        $scope.$apply(function(argument) {
                        vm.layers.push({
                            name: layer._attrs.name  || layer.name,
                            id: layer.id,
                            opacity: layer.opacity,
                            visible: layer.visible
                        });
                        
                        
                    })
                    } else {
                        console.log('layer already present')
                    }
                    
                   

                })
                
                map.layerIds.forEach(function(el, idx, arr) {
                    var layer = map.getLayer(el);
                     
                  
                    if (  vm.layers.map(function(x) {return x.id; }).indexOf(layer.id) === -1) {
                        $scope.$apply(function(argument) {
                       if (layer.id !== 'layer0' && layer.id !== 'layer1') {
                             vm.layers.push({
                            name: layer._attrs.name || layer.layerInfos[0].name || layer.name || layer.id || layer.layerInfos[0].name,
                            id: layer.id,
                            opacity: layer.opacity,
                            visible: layer.visible
                        });
                       } else {
                           
                       }        
                      
                        console.log(layer)
                        console.log(layer.layerInfos)
                    })
                    } else {
                        console.log('layer already present')
                    }
                    
                  

                })*/
                console.log('layers ------------------------------------------')
                console.log(map.layerIds)
                setTimeout( function (argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)
              
            }

        }
    }

}())


/*



*/