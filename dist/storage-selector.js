/* global CONFIG: true */
/* exported CONFIG */
if (typeof CONFIG === "undefined") {
  var CONFIG = {
    // variables go here
  };
}

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