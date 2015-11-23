if (typeof angular !== "undefined") {
  angular.module("risevision.widget.common.storage-selector.config", [])
    .value("STORAGE_MODAL", "https://storage.risevision.com/files/");
}

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



angular.module("risevision.widget.common.storage-selector")
  .controller("StorageCtrl", ["$scope", "$modalInstance", "storageUrl", "$window", "$log", "STORAGE_MODAL",
    function($scope, $modalInstance, storageUrl, $window, $log, STORAGE_MODAL){

      $scope.storageUrl = storageUrl;

      $scope.isSameOrigin = function (origin) {
        var parser = document.createElement("a");
        parser.href = STORAGE_MODAL;

        return origin.indexOf(parser.host) !== -1;
      };

      $scope.messageHandler = function (event) {
        if (!$scope.isSameOrigin(event.origin)) {
          return;
        }

        if (Array.isArray(event.data)) {
          $modalInstance.close(event.data);
        } else if (typeof event.data === "string") {
          if (event.data === "close") {
            $modalInstance.dismiss("cancel");
          }
        }
      };

      $window.addEventListener("message", $scope.messageHandler);

  }]);

(function(module) {
try { module = angular.module("risevision.widget.common.storage-selector"); }
catch(err) { module = angular.module("risevision.widget.common.storage-selector", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("storage-selector.html",
    "<div class=\"row half-top add-bottom\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-fixed-width file\" ng-class=\"{active: isFile}\"\n" +
    "      ng-click=\"showFileSelector()\">\n" +
    "      {{ fileLabel }}<img src=\"http://s3.amazonaws.com/Rise-Images/Icons/storage.png\" class=\"storage-selector-icon icon-right\">\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-fixed-width folder\" ng-class=\"{active: isFolder}\"\n" +
    "      ng-click=\"showFolderSelector()\">\n" +
    "      {{ folderLabel }}<img src=\"http://s3.amazonaws.com/Rise-Images/Icons/storage.png\" class=\"storage-selector-icon icon-right\">\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-fixed-width custom\" ng-class=\"{active: isCustom}\"\n" +
    "      ng-click=\"onCustomSelected()\">\n" +
    "      {{ customLabel }}<i class=\"fa fa-link fa-large\"></i>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div><!-- .row -->\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"storage.html\">\n" +
    "  <iframe class=\"modal-dialog\" scrolling=\"no\" marginwidth=\"0\" src=\"{{ storageUrl.url }}\"></iframe>\n" +
    "</script>\n" +
    "");
}]);
})();
