(function () {
    'use strict';

    angular
        .module ('os-esri-components')
        .component ('accordion', accordionComponent());


    function accordionComponent() {

        // ^ more of an internal api
        // comunicate between parent child relationship
        // requrie

        return {
            bindings: {},
            controller: accordionComponentController,
            controllerAs: 'vm',
            transclude: true,
            template: "<div class = 'panel-group' ng-transclude> </div>"
        }

        function accordionComponentController(){
            var vm = this;
            
            var panels = [];

            vm.selectPanel = function (panel) {
                panels.forEach(function (el, idx, arr) {
                    if (el === panel) {
                        el.turnOn()
                    } else {
                        el.turnOff();
                    }
                })
            };

            vm.addPanel = function (panel) {
               panels.push(panel)
               if (panels.length > 0 ) {
                   panels[0].turnOn();
               } 
            }
          
        }
    }

} ());

(function () {
    'use strict';

    angular
        .module ('os-esri-components')
        .component ('accordionPanel', accordionPanel());


    function accordionPanel() {

      

        return {
            bindings: {
                // @ attribute binding, does not try and parse it as an expression   
                // bindings bind to the controolers this  
                heading: '@'
            },
            // require parent controlelr
            require: {
                "parent" : '^accordion'

            },
            controller: accordionPanelController,
            transclude: true,
            controllerAs: 'vm',
            template: "<div class = 'panel panel-default'>" +
                        "<div class = 'panel-heading' ng-click = 'vm.select()'> <h4 class ='panel-heading'>{{vm.heading}} </h4> </div>" +      
                        "<div ng-if = 'vm.selected' class = 'panel-body ng-transclude>' </div>" +
                      "</div>"  
        }

          function accordionPanelController(){
            var vm = this;

            console.log(vm.parent)

            vm.selected = false; 
            
           vm.turnOff = function (params) {
               vm.selected = false;
            };

           vm.turnOn = function (params) {
               vm.selected = true;
           };

           vm.$onInit = function () {
               vm.parent.addPanel(this)
           };

           vm.select = function () {
               vm.parent.selectPanel(this)
           }
        }
    }

} ());