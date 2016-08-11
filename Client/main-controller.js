(function() {
    'use strict';

    angular
        .module('app')
        .controller('main', ControllerController);

    ControllerController.$inject = ['$scope', '$rootScope', 'OsMapService'];

    function ControllerController($scop, $rootScope, OsMapService) {
        var vm = this;
        vm.showLayers = false;
        vm.showBasemaps = false;

        activate();

        ////////////////

        function activate() {


        }
        
        vm.maps =   ["streets" , "satellite" ]

        vm.wellsInfo = {
            title: "Wells",
            content: "Current Owner: ${CURR_OWNER}</br>" +
                "Original Owner: ${ORIG_OWNER}</br>ID : ${well_id} </br>USE: ${USE_ }</br>"
        }
        
         vm.togleLayers = function(argument) {
            vm.showLayers = !vm.showLayers;
        };
        vm.togleLayers = function(argument) {
            vm.showLayers = !vm.showLayers;
        };

        vm.toggleBaseMaps = function() {
            vm.showBasemaps = !vm.showBasemaps;
        };


        vm.bMapShow = function(isVisible) {
            vm.showBasemaps = isVisible
        };

        vm.layersShow = function(isVisible) {
            vm.showLayers = isVisible
        };

        vm.testClick = function(e) {
            console.log('test click');
            console.log(e);

            alert(JSON.stringify(e.graphic.geometry))
            alert(JSON.stringify(e.graphic.attributes))
        };



    }
})();