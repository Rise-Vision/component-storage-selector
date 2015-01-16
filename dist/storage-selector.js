if (typeof angular !== "undefined") {
  angular.module("risevision.widget.common.storage-selector.config", [])
    .constant("STORAGE_MODAL", "http://storage.risevision.com/storage-modal.html#/files/");
}

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



angular.module("risevision.widget.common.storage-selector")
  .controller("StorageCtrl", ["$scope", "$modalInstance", "storageUrl", "$window", "$log",
    function($scope, $modalInstance, storageUrl, $window/*, $log*/){

    $scope.storageUrl = storageUrl;

    $window.addEventListener("message", function (event) {
      if (event.origin !== "http://storage.risevision.com") { return; }

      if (Array.isArray(event.data)) {
        $modalInstance.close(event.data);
      } else if (typeof event.data === "string") {
        if (event.data === "close") {
          $modalInstance.dismiss("cancel");
        }
      }
    });

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
