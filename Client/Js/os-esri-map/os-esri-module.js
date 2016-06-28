// start with wrappign in an IIFE
//  then declare you angular code
(function(){
    'use strict';
    
    // define module here
    // module takes two arugments
    // first is the name of your module
    // second is an array of dependencies
    // good idea to prepent names with something
    // to avoid naming collesiosn with other libraries
    // hence the os
    angular.module('os-esri-components', [
      'ng-sortable',
      'ngTouchstart'
     
    ])
}())
