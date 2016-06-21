(function (){
    'use strict',
    
    
    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array
    
    angular
    .module("os-esri-components")
    .component("testComponent",  testComponent())
    
    function testComponent (){
        
        return {
            bindings: {},
             require: {
                parent : '^osMap'

           },
            template: '<h1> Hello from angualr </h1>',
            controller: function () {
                var vm = this;
                
                console.log(vm.parent)
                
            },
            controllerAs: 'vm',
        }
    }
    
}())