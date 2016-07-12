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
             $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                 
                var l =   OsMapService.addFeatureLayer('http://sampleserver6.arcgisonline.com/arcgis/rest/services/Military/FeatureServer/2')
                
               l.on('click', function(evt){
                    console.log(evt)
               });
             })
          
        }

        vm.togleLayers = function(argument) {
            vm.showLayers = !vm.showLayers;
        };
        
        vm.toggleBaseMaps = function () {
          vm.showBasemaps = !vm.showBasemaps;
        };
        
        
        vm.bMapShow = function (isVisible) {
            vm.showBasemaps = isVisible
        };
        
        vm.layersShow =  function (isVisible) {
            vm.showLayers = isVisible
        };
        
        vm.testClick = function(e){
            console.log('test click');
            console.log(e);
            
            alert(JSON.stringify(e.graphic.geometry))
            alert(JSON.stringify(e.graphic.attributes))
        };
        
        
    }
})();