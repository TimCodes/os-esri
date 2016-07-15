this.addFeatureLayer = function(layer) {
        var serviceThis = {}
            return __checkMapStatus()
                .then(function() {
                    var fLayer = serviceThis.newFeatureLayer(layer);
                    serviceThis.featureLayers.push(fLayer);
                    serviceThis.map.addLayer(fLayer);

                    return fLayer;
                })


        };
        
        
        function __checkMapStatus() {

            var defer = $q.defer()
            var retryLimit = 10;
            var retryCounter = 0;

            function checkMapStatus() {

                if (retryCounter >= retryLimit) {
                    defer.reject('max retry count reached')
                }

                if (isMapLoaded) {
                    defer.resolve('map loaded')
                }
                else {
                    setTimeout(function() {
                        checkMapStatus()
                    }, 1)
                }

                retryCounter++
            }

            checkMapStatus();
            return defer.promise
        }