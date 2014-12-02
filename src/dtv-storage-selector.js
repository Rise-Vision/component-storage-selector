(function () {

  "use strict";

  angular.module("risevision.widget.common.storage-selector", ["ui.bootstrap"])
  .directive("storageSelector", ["$window", "$templateCache", "$modal", "$sce", "$log",
    function($window, $templateCache, $modal, $sce, $log){
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
                    templateUrl: attrs.instanceTemplate || "storage.html",
                    controller: scope.useCtrl || "StorageCtrl",
                    size: "lg",
                    backdrop: true,
                    resolve: {
                        storageUrl: function () {
                            return {url: $sce.trustAsResourceUrl(scope.storageUrl)};
                        }
                    }

                });

              modalInstance.result.then(function (files) {
                // emit an event with name "files", passing the array of files selected from storage
                scope.$emit("picked", files);

              }, function () {
                $log.info("Modal dismissed at: " + new Date());
              });
            };
        }
      };
   }
  ]);
})();


