(function () {

  "use strict";

  angular.module("risevision.widget.common.storage-selector", [
    "ui.bootstrap",
    "risevision.widget.common.storage-selector.config"
  ])
  .directive("storageSelector", ["$window", "$templateCache", "$modal", "$sce", "$log", "STORAGE_MODAL",
    function($window, $templateCache, $modal, $sce, $log, STORAGE_MODAL){
      return {
        restrict: "EA",
        scope : {
          local: "@",
          useCtrl: "@",
          instanceTemplate: "@",
          companyId : "@"
        },
        template: $templateCache.get("storage-selector.html"),
        link: function (scope) {

          scope.storageUrl = "";

          scope.open = function() {
            var modalInstance = $modal.open({
              templateUrl: scope.instanceTemplate || "storage.html",
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

          if (scope.local){
            scope.storageUrl = STORAGE_MODAL + "local";
          } else {
            scope.$watch("companyId", function (companyId) {
              if (companyId) {
                scope.storageUrl = STORAGE_MODAL + companyId;
              }
            });
          }
        }
      };
   }
  ]);
})();


