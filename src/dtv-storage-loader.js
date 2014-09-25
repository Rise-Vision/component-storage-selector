(function (angular) {

  'use strict';

  angular
  .module('risevision.widget.common.storage-client-loader', ['ui.bootstrap'])
  .directive('storageClientLoader', ['$window','$templateCache', '$modal',
    function($window, $templateCache, $modal){
      return {
        restrict: 'EA',
        scope : {
           useCtrl: "@",
           companyid : '='
        },
        template: $templateCache.get('loader.html'),
        link: function (scope, attrs) {
            scope.storageUrl = 'http://storage.risevision.com/storage-modal.html#/files/'+attrs.companyId;
            scope.open = function() {
                var modalInstance = $modal.open({
                    templateUrl: attrs.instanceTemplate || "storage.html",
                    controller: scope.useCtrl || "StorageCtrl",
                    size: 'lg',
                    backdrop: true,
                    resolve: {
                        storageUrl: function () {
                            return {url: scope.storageUrl};
                        }
                    }

                });

                $window.addEventListener('message',
                    function (event) {
                        if (event.origin !== 'http://storage.risevision.com') { return; }
                        if (event.data === "close") {
                            modalInstance.dismiss();
                        }
                        console.log(event.data);
                    }, false);

                modalInstance.result.then(function(){
                    console.log('Finished');
                }, function(){
                    console.log('Modal dismissed at : ' + new Date());
                });
            };
        }//link
      };//return
   }//function
  ])
  .controller('StorageCtrl', function($scope, $modalInstance, storageUrl){
          //add the scop
          $scope.storageUrl = storageUrl;

          $scope.ok = function(){
              $modalInstance.close();
          };

          $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
          };
  });//directive
})(angular);


