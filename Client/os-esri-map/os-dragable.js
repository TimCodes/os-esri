angular.module('os-esri-components').directive('ngDraggable', function($document, $window) {
    function makeDraggable(scope, element, attr) {
        var startX = 0;
        var startY = 0;

        // Start with a random pos
        var x =0
        var y = 0

       

        element.on('mousedown', function(event) {
            //event.preventDefault();

            startX = event.pageX - x
            startY = event.pageY - y

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
            y = event.pageY - startY;
            x = event.pageX - startX;

            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    }
    return {
        link: makeDraggable
    };
});