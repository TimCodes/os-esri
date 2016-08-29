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

            controller: osSearchController,
            controllerAs: 'vm',
            bindings: {
                
               baseMaps: '<'
                
            },
            template: '<ul class="mdl-list">'+
               ' <li class="mdl-list__item" ng-repeat="map in vm.maps" ng-init="$last && vm.finished()" ng-click = "vm.changeBaseMap(map)" > '+
                '   <div class="mdl-grid"> '+
                  '      <span class="mdl-list__item-primary-content mdl-cell mdl-cell--4-col" > '+
                    '     {{map}} ' +
                    ' </span> ' +
                ' </div>  ' +  
               ' </li> ' +
           ' </ul> '

        };

        function osSearchController($rootScope, $scope, OsMapService) {
            var vm = this;
            vm.maps =  vm.baseMaps || ["streets" , "satellite" , "hybrid" , "topo" , "gray", "terrain" ];
            vm.changeBaseMap = function(map){
                OsMapService.getMap().setBasemap(map);
            }
        };
    };

}());