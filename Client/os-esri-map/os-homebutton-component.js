(function() {
    'use strict',

    angular
    .module("os-esri-components")
    .component("osHomeButton", buildComponent())

    function buildComponent() {
        return {


            controller: osHomeButtonController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            template: '<div id="HomeButton" class = "{{vm.osClass}}"> </div>'


        }

        function osHomeButtonController($rootScope, OsMapService) {
            var vm = this;

            vm.$postLink = function() {

                /*
                   this is the best way to ensure the map is loaded,
                   before trying to add anythinng, its easy to run into
                   asynchronous race conditions when seperating map
                   components
                */
                $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                    require([ "esri/dijit/HomeButton", "dojo/domReady!"],
                    function( HomeButton) {
                            var home = new HomeButton({ map: OsMapService.getMap() }, "HomeButton");
                            vm.home = home
                            home.startup();
                    });
                });
            };
            
            vm.$onDestroy = function () {
                vm.home.destroy();
            }; 
            
        };
    };

}());
