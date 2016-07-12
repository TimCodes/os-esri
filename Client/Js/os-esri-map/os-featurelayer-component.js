(function (){
    'use strict',
    
    
    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array
    
    angular
    .module("os-esri-components")
    .component("osFeatureLayer",  buildComponent())
    
    function buildComponent (){
       
        return {
            
       
            controller: osFeatureLayercontroller,
            controllerAs: 'vm',
            bindings: {
                furl: '@',
                fname: '@',
                osInfoTemplateTitle: '@',
                osInfoTemplateBody: '@',
                fclick: '&'
            },
            require: { 
                
                "mapCtrl" : "^osMap"
                
            },
            
            
        }
        
        function osFeatureLayercontroller($rootScope, OsMapService) {
            var vm = this;
          
            console.log(vm.furl)
            vm.$postLink = function(){
             $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                   require([
                    "esri/layers/FeatureLayer",
                    "esri/InfoTemplate",
                    "dojo/domReady!"
                    
                  ],
                  function(
                    FeatureLayer,
                    InfoTemplate
                  ) {
                   
                 console.log(vm.osInfoTemplateTitle)
                    window.myfeatureLayer = FeatureLayer;
                     var featureLayer = OsMapService.addFeatureLayer(vm.furl);
                     /*new FeatureLayer(vm.furl,
                     
                       {
                         
                             mode: FeatureLayer.MODE_ONDEMAND,
                             outFields: ["*"],
                             infoTemplate: vm.osInfoTemplateTitle ? new InfoTemplate(vm.osInfoTemplateTitle, vm.osInfoTemplateBody) : null
                           
                       }
                     
                     );*/
                     
                     featureLayer.on('click', function(evt){
                         vm.fclick({evt:evt});
                     });
                     
                     if (vm.fname) {
                         console.log('-----------fname------------------------');
                         console.log(vm.fname)
                         featureLayer.attr('name', vm.fname)
                         featureLayer.name = vm.fname
                     };
                      //vm.mapCtrl.map.addLayer(featureLayer);
                     
                  });
                }) 
                
             }
     }
    }
    
}())


