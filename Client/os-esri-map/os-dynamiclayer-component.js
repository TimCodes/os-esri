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
