(function (){
    'use strict',
    
    
    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array
    
    angular
    .module("os-esri-components")
    .component("osLocateButton",  buildComponent())
    
    function buildComponent (){
       
        return {
            
       
            controller: osLocateButtonController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            require: { 
                
                "mapCtrl" : "^osMap"
                
            },
            template: '<div id="LocateButton" class = "{{vm.osClass}}"> </div>'
            
            
        }
        
        function osLocateButtonController() {
            var vm = this;
            console.log('controller')
            
            
            vm.$onInit = function(){
                console.log("layer loaded")
                
                   require([
                    "esri/dijit/LocateButton"
                  ],
                  function(
                    LocateButton
                  ) {
                   
                 var geoLocate = new LocateButton({
                     map: vm.mapCtrl.map
                  }, "LocateButton");
                  geoLocate.startup();      
                 
            
                  });
                
                
                   
            }


     
        }
    }
    
}())


/*



*/