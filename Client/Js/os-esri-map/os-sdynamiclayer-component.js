(function (){
    'use strict',
    
    
    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array
    
    angular
    .module("os-esri-components")
    .component("osDynamicLayer",  buildComponent())
    
    function buildComponent (){
       
        return {
            
       
            controller: osFeatureLayercontroller,
            controllerAs: 'vm',
            bindings: {
                durl: '@',
                dname: '@',
                osInfoTemplateTitle: '@',
                osInfoTemplateBody: '@'
            },
            require: { 
                
                "mapCtrl" : "^osMap"
                
            },
            
            
        }
        
        function osFeatureLayercontroller($rootScope) {
            var vm = this;
          
            console.log(vm.furl)
            vm.$postLink = function(){
             $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                   require([
                   "esri/layers/ArcGISDynamicMapServiceLayer",
                    "esri/InfoTemplate",
                    "dojo/domReady!"
                    
                  ],
                  function(
                    DynamicMapServiceLayer,
                    InfoTemplate
                  ) {
                   
                 console.log(vm.osInfoTemplateTitle)
                   
                     var dynamicLayer = new  DynamicMapServiceLayer(vm.durl);
                     
                     if (vm.dname) {
                         console.log('-----------fname------------------------');
                         console.log(vm.fname)
                          dynamicLayer.attr('name', vm.dname)
                    
                     };
                      vm.mapCtrl.map.addLayer(dynamicLayer);
                     
                  });
                }) 
                
              
                
                
                   
            }


     
        }
    }
    
}())


