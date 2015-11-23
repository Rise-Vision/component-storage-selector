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
          fileLabel: "@",
          folderLabel: "@",
          customLabel: "@",
        },
        template: $templateCache.get("storage-selector.html"),
        link: function (scope) {

          scope.isFile = false;
          scope.isFolder = false;
          scope.isCustom = false;

          scope.showFileSelector = function() {
            scope.isFile = true;
            scope.isFolder = scope.isCustom = false;

            showStorageSelector(true);
            scope.$emit("fileSelected");
          };

          scope.showFolderSelector = function() {
            scope.isFolder = true;
            scope.isFile = scope.isCustom = false;

            showStorageSelector(false);
            scope.$emit("folderSelected");
          };

          scope.onCustomSelected = function() {
            scope.isCustom = true;
            scope.isFile = scope.isFolder = false;

            scope.$emit("customSelected");
          };

          function getStorageUrl(isFile) {
            var baseUrl = STORAGE_MODAL + scope.companyId;

            if (isFile) {
              return baseUrl + "?selector-type=single-file";
            }
            else {
              return baseUrl + "?selector-type=single-folder";
            }
          }

          function showStorageSelector(isFile) {
            var storageUrl = getStorageUrl(isFile);

            scope.modalInstance = $modal.open({
              templateUrl: "storage.html",
              controller: "StorageCtrl",
              size: "lg",
              backdrop: true,
              resolve: {
                storageUrl: function () {
                  return {url: $sce.trustAsResourceUrl(storageUrl)};
                }
              }
            });

            scope.modalInstance.result.then(function (files) {
              // for unit test purposes
              scope.files = files;

              // emit an event with name "files", passing the array of files selected from storage
              scope.$emit("picked", files);

            }, function () {
              // for unit test purposes
              scope.canceled = true;

              $log.info("Modal dismissed at: " + new Date());

            });

          }
        }
      };
   }
  ]);
})();


