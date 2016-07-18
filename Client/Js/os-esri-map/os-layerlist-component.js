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
            vm.layers = [];
            vm.map = OsMapService.getMap();

            vm.barConfig = {
                group: 'foobar',
                animation: 150,
                disabled: false,
                // filter:'.mdl-slider',
                onSort: function( /** ngSortEvent */ evt) {
                    vm.layers.forEach(function(el, idx, arr) {
                        var layer = OsMapService.getMap().getLayer(el.id);
                        OsMapService.getMap().reorderLayer(layer, idx);
                    })


                }
            }

            vm.stop = function(evt) {
                // body...
                vm.barConfig.disabled = true;

            };
            

            vm.start = function() {
                vm.barConfig.disabled = false;
            };

            vm.setopacity = function(id, evt) {

                var layer = getMap().getLayer(id);
                layer.setOpacity(evt.target.value)
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


                vm.layers = [];
                // map.getLayersVisibleAtScale()
               OsMapService.getLayers().forEach(function(el, idx, arr) {
                   console.log('------name------');
                   console.log(el)
                    var layer = OsMapService.getLayer(el.name);
                    console.log(layer)
                    if (vm.layers.map(function(x) {
                            return x.id;
                        }).indexOf(layer.id) === -1) {
                        $scope.$apply(function(argument) {

                            vm.layers.push({
                                name:  el.name || layer._attrs.name || layer.layerInfos[0].name || layer.id || layer.layerInfos[0].name,
                                id: layer.id,
                                opacity: layer.opacity,
                                visible: layer.visible
                            });
                        })
                    }



                });


                setTimeout(function(argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)

            }

        }
    }

}())

