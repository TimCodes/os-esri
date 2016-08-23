(function() {
    'use strict',

    angular
    .module("os-esri-components")
    .component("osLayerList", buildComponent())

    function buildComponent() {

        return {


            controller: osLayerListController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@',
                isSortable: '<',
                layers: '<'
            },
            template: '<ul class="mdl-list" ng-sortable="vm.barConfig" ng-if = "vm.isSortable" > ' +
              '<li class="mdl-list__item" ng-repeat="layer in vm.layers " ng-init="$last && vm.finished()"> ' +
                 '<span class="mdl-list__item-primary-content">' +
                    '   {{layer.name}} ' +
                    ' </span> ' +
                    '<span class="mdl-list__item-text-body">'+
                       '<input ' +
                          'ng-mouseup ="vm.setopacity(layer.id, $event)" '+
                          'ng-mouseover ="vm.stop($event)"'+
                          'ng-touchstart="vm.stop($event)"'+
                          'ng-mouseleave="vm.start()"'+
                          'class="mdl-slider mdl-js-slider" type="range" id="s1" min="0" max="1" value="{{layer.opacity}}" step=".1">'+
                           
                     '</span>'+
                    '<br>'+
                    '<span class="mdl-list__item-secondary-content">'+
                       '<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="list-switch-{{$index}}">'+
                         '<input type="checkbox" id="list-switch-{{$index}}" class="mdl-switch__input" ng-checked="{{layer.visible}}" ng-click = "vm.setViz(layer.id,$event)"/>' +
                       '</label>'+
                    '</span>'+
                '</li>'+
            '</ul>' +
            '<ul class="mdl-list"  ng-if = "!vm.isSortable" >' +
                '<li class="mdl-list__item" ng-repeat="layer in vm.layers " ng-init="$last && vm.finished()">'+
                    '<span class="mdl-list__item-primary-content">'+
                       '{{layer.name}}'+
                     '</span>'+
                    '<span class="mdl-list__item-text-body">'+
                       '<input'+
                           'ng-model = "vm.test[layer.id]"'+
                           'ng-mouseover ="vm.stop($event)"'+
                           'ng-touchstart="vm.stop($event)"'+
                           'ng-mouseleave="vm.start()"'+
                           'class="mdl-slider mdl-js-slider" type="range" id="s1" min="0" max="1" step=".1">'+
                   '</span>'+
                    '<br>' +
                    '<span class="mdl-list__item-secondary-content">'+
                       '<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="list-switch-{{$index}}">'+
                         '<input type="checkbox" id="list-switch-{{$index}}" class="mdl-switch__input" ng-checked="{{layer.visible}}" ng-click = "vm.setViz(layer.id,$event)"/>'+
                       '</label>'+
                    '</span>'+
                '</li>'+
            '</ul>'

        }

        function osLayerListController($rootScope, $scope, OsMapService) {
           
          
            var vm = this;
            vm.test = {};
            vm.layers = [];
            vm.map = OsMapService.getMap();

            vm.barConfig = {
                group: 'foobar',
                animation: 150,
                disabled: false,
                // filter:'.mdl-slider',
                onSort: function( /** ngSortEvent */ evt) {vm.layers.forEach(function(el, idx, arr) {
                        var layer = OsMapService.getMap().getLayer(el.id);
                        OsMapService.getMap().reorderLayer(layer, idx);
                    })


                }
            };
            
            $scope.$watch("vm.test", function (newVal, oldVal) {
                for (var prop in newVal) {
                    if(newVal[prop] !== oldVal[prop]){
                         var layer = OsMapService.getMap().getLayer(prop);
                         layer.setOpacity(newVal[prop]);
                    }
                    
                }
             
            }, true);

            vm.stop = function(evt) {
                vm.barConfig.disabled = true;

            };
            

            vm.start = function() {
                vm.barConfig.disabled = false;
            };

            vm.setopacity = function(id, evt) {
            
              // var layer = OsMapService.getMap().getLayer(id);
               // layer.setOpacity(evt.target.value)
            };

            vm.setViz = function(id, evt) {

                var layer = OsMapService.getMap().getLayer(id);
                layer.setVisibility(evt.target.checked)

            };

            vm.finished = function() {
                setTimeout(function(argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)


            };



            $rootScope.$on('os-map-loaded', function(evt, event) {
               addLayertoList(OsMapService.getMap());
             })

            $rootScope.$on('os-map-layeradd', function() {
                addLayertoList(OsMapService.getMap());
            });
            


            function addLayertoList(map) {

               // reset layer list
               // reset ;
               
               vm.layers = [];
                
               OsMapService.getLayers().forEach(function(el, idx, arr) {
        
                    var layer = OsMapService.getLayer(el.name);
                            
                    if ( isLayerinList(layer)) {
                        console.log(layer.visible)
                       vm.layers.push({
                                name:  el.name || layer._attrs.name || layer.id ,
                                id: layer.id,
                                opacity: layer.opacity,
                                visible: layer.visible
                        });
                        
                        vm.test[layer.id] = layer.opacity
                    };
                    setTimeout(function(argument) {
                          componentHandler.upgradeAllRegistered()
                     }, 200);

               });



            };
            
            function isLayerinList(layer){;
              var ids =  vm.layers.map(function(x) { return x.id;})
              return ids.indexOf(layer.id) === -1;
            };
        };
    };

}());

