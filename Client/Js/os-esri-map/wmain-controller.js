(function() {
    'use strict';

    angular
        .module('os-esri-components')
        .controller('main', ControllerController);

    ControllerController.$inject = ['$scope'];

    function ControllerController($scope) {
        var vm = this;
        vm.showLayers = false;
        vm.showBasemaps = false;

        activate();

        ////////////////

        function activate() {}

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
        
        
    }
})();