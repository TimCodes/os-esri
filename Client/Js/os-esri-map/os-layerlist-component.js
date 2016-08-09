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
            }
            
            $scope.$watch("vm.test", function (newVal, oldVal) {
                for (var prop in newVal) {
                    if(newVal[prop] !== oldVal[prop]){
                         var layer = OsMapService.getMap().getLayer(prop);
                         layer.setOpacity(newVal[prop])
                        
                    }
                }
                console.log('vm.test')
                console.log(newVal)
            }, true)

            vm.stop = function(evt) {
                vm.barConfig.disabled = true;

            };
            

            vm.start = function() {
                vm.barConfig.disabled = false;
            };

            vm.setopacity = function(id, evt) {
            
              // var layer = OsMapService.getMap().getLayer(id);
               // layer.setOpacity(evt.target.value)
            }

            vm.setViz = function(id, evt) {

                var layer = OsMapService.getMap().getLayer(id);
                layer.setVisibility(evt.target.checked)

            }

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
               
               vm.layers = []
                
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
                    }
                  setTimeout(function(argument) {
                          componentHandler.upgradeAllRegistered()
                     }, 200)

               });



            }
            
            function isLayerinList(layer){
              var ids =  vm.layers.map(function(x) { return x.id;})
              return ids.indexOf(layer.id) === -1
            }
        }
    }

}())

