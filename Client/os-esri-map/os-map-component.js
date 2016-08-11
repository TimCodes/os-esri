(function(){
    'use strict';
    
    angular
    .module("os-esri-components")
    .component("osMap", mapComponent())

    function mapComponent(){
      
       return {
            bindings: {
              mapDefination: '<'
            },
            controller: osMapComponentController,
            controllerAs: 'vm',
            transclude: true,
            template: "<div id= 'map' ><ng-transclude> </ng-transclude> </div>"
        };

        function osMapComponentController($rootScope,OsMapService){
            var vm = this;
            var map;
            
            var panels = [];
            map = OsMapService.createMap(vm.mapDefination);
          
        };
     };   
}());
