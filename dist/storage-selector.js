if (typeof angular !== "undefined") {
  angular.module("risevision.widget.common.storage-selector.config", [])
    // ** NOTE **
    // Due to the build infrastructure and how Widgets import the compiled dist/storage-selector.js version,
    // the value here will not be used. It is for reference so that it can be used to override the value
    // in the Widgets config/dev.js file
    .value("STORAGE_MODAL", "https://storage-stage-rva-test.risevision.com/files/");
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
          type: "@"
        },
        template: $templateCache.get("storage-selector.html"),
        link: function (scope) {

          function updateStorageUrl() {
            if (typeof scope.type !== "undefined" && scope.type !== "") {
              scope.storageUrl = STORAGE_MODAL + scope.companyId + "?selector-type=" + scope.type;
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
              size: "lg",
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

              // emit an event with name "files", passing the array of files selected from storage
              scope.$emit("picked", files);

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
try { app = angular.module("risevision.widget.common.storage-selector"); }
catch(err) { app = angular.module("risevision.widget.common.storage-selector", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("storage-selector.html",
    "<button class=\"btn btn-widget-icon-storage\" ng-click=\"open()\" type=\"button\" />\n" +
    "<script type=\"text/ng-template\" id=\"storage.html\">\n" +
    "        <iframe class=\"modal-dialog\" scrolling=\"no\" marginwidth=\"0\" src=\"{{ storageUrl.url }}\"></iframe>\n" +
    "</script>\n" +
    "");
}]);
})();
