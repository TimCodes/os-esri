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
                osInfoTemplateTitle: '@',
                osInfoTemplateBody: '@',
                fclick: '&'
            },
            require: {

                "mapCtrl": "^osMap"

            },


        }

        function osFeatureLayercontroller($rootScope, OsMapService) {
            var vm = this;

            console.log(vm.furl)
            vm.$postLink = function() {

                 OsMapService.addFeatureLayer(vm.furl, vm.fname)
                 .then(function (fLayer) {
                     var featureLayer = fLayer;
                      console.log(' ------------  feature layer --------')
                 console.log(featureLayer)
                featureLayer.on('click', function(evt) {
                    vm.fclick({
                        evt: evt
                    });
                });
                 })

                



            }
        }
    }

}())
