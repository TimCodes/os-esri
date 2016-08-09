(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

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
                var infoTemp = vm.infoTemplate ? vm.infoTemplate : undefined
                OsMapService.addFeatureLayer(vm.furl, vm.fname, infoTemp)
                .then(function(fLayer) {
                 var featureLayer = fLayer;
                  //broadcast layer click event to binding
                  featureLayer.on('click', function(evt) {
                        vm.fclick({evt: evt});
                    });
                 })
            }
        }
    }

}())
