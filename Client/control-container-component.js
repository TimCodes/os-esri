(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("app")
    .component("controlContainer", buildComponent())

    function buildComponent() {
       
        return {

            templateUrl: 'controlcontiner.html',
            controller: controlContainerController,
            transclude: true,
            controllerAs: 'vm',
            bindings: {
                
               containerIsShown: '<',
               isDraggable: '<',
               containerTitle: '@',
               containerVisability: '&'    
            },
        

        }

        function controlContainerController($rootScope, $scope) {
            var vm = this;
            
            
            vm.showContainer = vm.containerIsShown;
            
            
            vm.turnOffCotinaer = function () {
               vm.showContainer = false
               vm.containerVisability({visible:vm.showContainer})
            };
            
            vm.$onChanges = function(changesObj){
                 vm.showContainer = vm.containerIsShown;
                 //changesObj.containerShowable.currentValue
            } 
            
        }
    }

}())