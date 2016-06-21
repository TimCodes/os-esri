(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

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
            require: {

                "mapCtrl": "^osMap"

            },
            template: '<div id="HomeButton" class = "{{vm.osClass}}"> </div>'


        }

        function osHomeButtonController($rootScope) {
            var vm = this;
            console.log('controller')


            vm.$onInit = function() {

            }

            vm.$postLink = function() {

                /*
                   this is the best way to ensure the map is loaded,
                   before trying to add anythinng, its easy to run into
                   asynchronous race conditions when seperating map
                   components
                */
                $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                    require([
                            "esri/dijit/HomeButton",
                            "dojo/domReady!"
                        ],
                        function(
                            HomeButton
                        ) {
                            var home = new HomeButton({
                                map: mapEvt.map
                            }, "HomeButton");
                            home.startup();
                        });
                })
            }



        }
    }

}())


/*



*/