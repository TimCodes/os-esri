(function(){
    'use strict';

    angular
        .module('os-esri-components')
        .service('OsMapService', Service)

    function Service($rootScope){
        var serviceThis = this;
        this.fn = fn;
        this.map;
        
        var thisMap; 

        function fn(){
            

        }
        require(["esri/map",  "dojo/domReady!"], function(Map) {
              thisMap = Map
        });   
        this.createMap = function (mapDefination) {
             this.map =  new thisMap("map",mapDefination)
             
             this.map.on('layers-removed', function (evt) {
                 console.log('layer removed')
                 console.log(evt);
             })
             return this.map;
        }; 
        
        this.getMap = function (argument) {
            console.log('get map ')
            return this.map;
        }
    }

}());