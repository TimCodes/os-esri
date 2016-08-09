(function () {
    'use strict';
      console.log('activate mdl declared')
    angular
        .module ('os-esri-components')
        .directive ('mdlLoader', mdlLoader);


    function mdlLoader() {
        console.log('activate mdl directive')

        function directiveController(){
            var vm = this;
            
          
        }

        function link(scope, el, attr){
            console.log('hello mdl directive')
            console.log(attr)
            
            var watchValue = attr.mdlLoader;
            console.log(watchValue)
            console.log(scope.layers)
            
            if(Array.isArray(watchValue)){
               
                scope.$watchCollection(watchValue, function () {
                   
                    componentHandler.upgradeAllRegistered()
                })
            }else{
               
                scope.$watch(watchValue, function () {
                 
                   componentHandler.upgradeAllRegistered()
                })
            }
            
            setTimeout(function () {
                 componentHandler.upgradeAllRegistered()
            }, 0)
            
        }

        return {
            bindToController: true,
            controller: directiveController,
            controllerAs: 'Ctrl',
            link: link,
            restrict: 'A',
            scope: true
           
                   
            
        }
    }

} ());