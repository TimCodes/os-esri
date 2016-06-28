(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osBasemapToggle", buildComponent())

    function buildComponent() {
       
        return {

            templateUrl: 'basemaps.html',
            controller: osSearchController,
            controllerAs: 'vm',
            bindings: {
                
               // osClass: '@'
                
            },
        

        }

        function osSearchController($rootScope, $scope, OsMapService) {
            var vm = this;
            vm.maps = ["streets" , "satellite" , "hybrid" , "topo" , "gray", "terrain" ]
            vm.$postLink = function() {
               
            }
            
            vm.changeBaseMap = function(map){
                OsMapService.getMap().setBasemap(map)
            }
        }
    }

}())