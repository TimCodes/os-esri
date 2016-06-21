(function (){
    'use strict',
    
    
    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array
    
    angular
    .module("os-esri-components")
    .component("componentName",  buildComponent())
    
    function buildComponent (){
        
        return {
            
            template: '<h1> Hello from angualr </h1>',
            controller: controller,
            controllerAs: 'vm',
            bindings: {},
            
        }
        
        function controller() {
            var vm = this;
            
            vm.$onInit = function(){
                
            }
        }
    }
    
}())