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

                "mapCtrl": "^osMap"

            },
            templateUrl: 'layerlist.html'


        }

        function osLayerListController($rootScope, $scope) {
            var vm = this;
            vm.layers = [];
            console.log('controller')
            vm.barConfig = {
                group: 'foobar',
                animation: 150,
                disabled: false,
               // filter:'.mdl-slider',
                onSort: function( /** ngSortEvent */ evt) {
                    // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
                    
                    console.log(evt)
                    vm.layers.forEach(function (el, idx, arr) {
                       var layer =vm.mapCtrl.map.getLayer(el.id);
                      vm.mapCtrl.map.reorderLayer(layer, idx);
                    }) 
                    
                    
                }
            }
            
            vm.stop = function (evt) {
                // body...
               
                vm.barConfig.disabled = true;
               
            };
            vm.$onInit = function(){console.log("what the ehll man")}
            
            vm.start = function () {
                vm.barConfig.disabled = false;
            };
            
            vm.setopacity = function (id, evt) {
            console.log(id)   
            console.log(evt.target)
            console.log('fuck');
              var layer =vm.mapCtrl.map.getLayer(id);
              layer.setOpacity(evt.target.value)
            }
            
           vm.setViz = function (id, evt) {
               console.log(evt.target.checked)
                var layer =vm.mapCtrl.map.getLayer(id);
                layer.setVisibility(evt.target.checked)
               
           }

            vm.finished = function() {
                setTimeout( function (argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)
               
               
            };
            
             $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                 addLayertoList()
                 
             })

            $rootScope.$on('os-map-layeradd', function(evt, mapEvt) {
              addLayertoList();
              

            }); 

           

            function addLayertoList(){
                
                     console.log('layer types')
                var layer = vm.mapCtrl.map.getLayer(vm.mapCtrl.map.graphicsLayerIds[0]);
                console.log(layer.type)
                console.log(layer.fields)
                console.log(layer)
                console.log('------------------------ layer name -------------------------');
                console.log(layer._attrs.name)
                console.log(layer.name)
                vm.layers = [];
                vm.mapCtrl.map.graphicsLayerIds.forEach(function(el, idx, arr) {
                    var layer = vm.mapCtrl.map.getLayer(el);
                     
                    console.log('----------------- layer list check --------------------');
                    console.log(  vm.layers.map(function(x) {return x.id; }).indexOf(layer.id))
                    if (  vm.layers.map(function(x) {return x.id; }).indexOf(layer.id) === -1) {
                        $scope.$apply(function(argument) {
                        vm.layers.push({
                            name: layer._attrs.name || "null" || layer.name,
                            id: layer.id,
                            opacity: layer.opacity,
                            visible: layer.visible
                        });
                        
                        
                    })
                    } else {
                        console.log('layer already present')
                    }
                    
                    console.log(vm.layers)
                    console.log(layer)

                })
                
                setTimeout( function (argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)
                console.log(vm.layers)
            }

        }
    }

}())


/*



*/