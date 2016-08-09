(function() {
    'use strict',



    angular
    .module("os-esri-components")
    .component("osLocateButton", buildComponent())

    function buildComponent() {

        return {


            controller: osLocateButtonController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            template: '<div id="LocateButton" class = "{{vm.osClass}}"> </div>'


        }

        function osLocateButtonController($rootScope, OsMapService) {
            var vm = this;
          
            vm.$onInit = function() {
                $rootScope.$on('os-map-loaded', function(evt, mapEvt) {

                    require([
                            "esri/dijit/LocateButton"
                        ],
                        function(LocateButton) {

                            var geoLocate = new LocateButton({
                                map: OsMapService.getMap()
                            }, "LocateButton");
                            geoLocate.startup();

                        }
                    );
                })
            }
        }
    }

}())


