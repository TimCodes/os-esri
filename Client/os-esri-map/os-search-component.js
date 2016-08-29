(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osSearch", buildComponent())

    function buildComponent() {
       
        return {

            template: '<div id="search"></div>',
            controller: osSearchController,
            controllerAs: 'vm',
            bindings: {
                
               // osClass: '@'
                
            },
            require: {
             "mapCtrl": "^osMap"
            },

        };

        function osSearchController() {
            var vm = this;

            vm.$postLink = function() {

                require([ "esri/dijit/Search", "dojo/domReady!" ], 
                function(Search) {

                    var search = new Search({
                     enableButtonMode: true, //this enables the search widget to display as a single button
                     enableLabel: false,
                     enableInfoWindow: true,
                     showInfoWindowOnSelect: false,
                        map: vm.mapCtrl.map
                    }, "search");
                    
                    vm.search = search;
                    search.startup();

                });
            };
            
            vm.$onDestroy = function () {
                vm.search.destroy();
            };
        };
    };

}());