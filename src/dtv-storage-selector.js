(function () {

  "use strict";

  angular.module("risevision.widget.common.storage-selector", ["ui.bootstrap"])
  .directive("storageSelector", ["$window", "$templateCache", "$modal",
    function($window, $templateCache, $modal){
      return {
        restrict: "EA",
        scope : {
           local: "@",
           useCtrl: "@",
           companyid : "="
        },
        template: $templateCache.get("storage-selector.html"),
        link: function (scope, attrs) {
            if (scope.local){
                scope.storageUrl = "http://storage.risevision.com/storage-modal.html#/files/local";
            }
            else{
                scope.storageUrl = "http://storage.risevision.com/storage-modal.html#/files/" + attrs.companyId;
            }
            scope.open = function() {
                var modalInstance = $modal.open({
                    templateUrl: attrs.instanceTemplate || "storage-selector.html",
                    controller: scope.useCtrl || "StorageCtrl",
                    size: "lg",
                    backdrop: true,
                    resolve: {
                        storageUrl: function () {
                            return {url: scope.storageUrl};
                        }
                    }

                });

                $window.addEventListener("message",
                    function (event) {
                        if (event.origin !== "http://storage.risevision.com") { return; }
                        if (event.data === "close") {
                            modalInstance.dismiss();
                        }
                        console.log(event.data);
                    }, false);

                modalInstance.result.then(function(){
                    console.log("Finished");
                }, function(){
                    console.log("Modal dismissed at : " + new Date());
                });
            };
        }
      };
   }
  ])
  .controller("StorageCtrl", function($scope, $modalInstance, storageUrl){
          //add the scop
          $scope.storageUrl = storageUrl;

          $scope.ok = function(){
              $modalInstance.close();
          };

          $scope.cancel = function () {
              $modalInstance.dismiss("cancel");
          };
  });
})();

