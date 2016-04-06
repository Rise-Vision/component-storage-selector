(function () {

  "use strict";

  angular.module("risevision.widget.common.storage-selector", [
    "ui.bootstrap",
    "risevision.widget.common.storage-selector.config"
  ])
  .directive("storageSelector", ["$templateCache", "$modal", "$sce", "$log", "STORAGE_MODAL",
    function($templateCache, $modal, $sce, $log, STORAGE_MODAL){
      return {
        restrict: "EA",
        scope : {
          companyId : "@",
          type: "@",
          label: "@",
          selected: "="
        },
        template: $templateCache.get("storage-selector.html"),
        link: function (scope) {

          function updateStorageUrl() {
            if (typeof scope.type !== "undefined" && scope.type !== "") {
              scope.storageUrl = STORAGE_MODAL + scope.companyId + "&selector-type=" + scope.type;
            } else {
              // If no "type" value then omit the selector-type param to allow In-App Storage to apply a default
              scope.storageUrl = STORAGE_MODAL + scope.companyId;
            }
          }

          scope.storageUrl = "";

          scope.open = function() {

            scope.modalInstance = $modal.open({
              templateUrl: "storage.html",
              controller: "StorageCtrl",
              size: "md",
              backdrop: true,
              resolve: {
                storageUrl: function () {
                  return {url: $sce.trustAsResourceUrl(scope.storageUrl)};
                }
              }
            });

            scope.modalInstance.result.then(function (files) {
              // for unit test purposes
              scope.files = files;

              $log.info("Picked: ", files);

              // emit an event with name "files", passing the array of files selected from storage and the selector type
              scope.$emit("picked", files, scope.type);

            }, function () {
              // for unit test purposes
              scope.canceled = true;

              $log.info("Modal dismissed at: " + new Date());

            });

          };

          scope.$watch("companyId", function (companyId) {
            if (companyId) {
              updateStorageUrl();
            }
          });

          scope.$watch("type", function (type) {
            if (type) {
              updateStorageUrl();
            }
          });
        }
      };
   }
  ]);
})();


