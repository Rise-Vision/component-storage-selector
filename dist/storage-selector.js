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
          type: "@",
          label: "@",
          selected: "="
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
    "\n" +
    "<script type=\"text/ng-template\" id=\"storage.html\">  //prototype modal\n" +
    "        \n" +
    "<div style=\"padding:22px\">\n" +
    "\n" +
    "\n" +
    "              <button type=\"button\" class=\"close\" data-dismiss=\"modal\" ng-click=\"closeButtonClick()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "              </button>\n" +
    "             \n" +
    "              <h3 update-title=\"\" translate=\"storage-client.select-single-folder\" class=\"ng-scope\">Select a Folder</h3>\n" +
    "              \n" +
    "              <div class=\"selector-header\">\n" +
    "\n" +
    "                <div class=\"icon-nav pull-right\">\n" +
    "                  <button class=\"btn btn-link\" ng-click=\"newFolderButtonClick('md')\" ng-disabled=\"isTrashFolder()\">\n" +
    "                    <svg-icon p=\"iconNewFolder\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path d=\"M30.7 8c-0.8-0.8-1.9-1-3.1-1H15V5.9c0-1.2-0.5-2-1.4-2.8C12.8 2.2 11.7 2 10.5 2H4.3C3.1 2 2.1 2.2 1.3 3.1 0.4 3.9 0 4.7 0 5.9v18.5c0 1.2 0.4 2.3 1.3 3.2C2.1 28.5 3.1 29 4.3 29h23.3c1.2 0 2.2-0.5 3.1-1.4 0.9-0.9 1.3-2 1.3-3.2V10.8C32 9.6 31.6 8.9 30.7 8zM23 20h-5v5h-4v-5H9v-4h5v-5h4v5h5V20\"></path><path d=\"\"></path></svg></svg-icon>\n" +
    "                  </button>\n" +
    "                  <label for=\"upload-files\" class=\"btn btn-link\" ng-disabled=\"!(filesDetails.localFiles === false &amp;&amp; !isTrashFolder())\">\n" +
    "                    <i class=\"fa fa-cloud-upload\"></i>\n" +
    "                  </label>\n" +
    "                  <button class=\"btn btn-link\" ng-click=\"showSelectorFileSearch()\">\n" +
    "                    <i class=\"fa fa-search\"></i>\n" +
    "                  </button>\n" +
    "                </div>\n" +
    "        \n" +
    "                <div class=\"description\">\n" +
    "                  <p><strong class=\"ng-binding\">Rise Vision Inc.</strong></p>\n" +
    "                </div>\n" +
    "        \n" +
    "                <div class=\"icon-nav\">\n" +
    "                  \n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<table class=\"table-2 table-hover table-selector single-selector\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th class=\"col-sm-6\">\n" +
    "        <input type=\"checkbox\" class=\"add-right\" ng-model=\"selectAll\">\n" +
    "        <label ng-click=\"selectAllCheckboxes(query)\"></label>\n" +
    "        <a href=\"\" ng-click=\"orderByAttribute = fileNameOrderFunction; reverseSort = !reverseSort\">\n" +
    "          <span translate=\"common.file-name\" class=\"ng-scope\">Name</span>\n" +
    "          <span>\n" +
    "            <span ng-show=\"reverseSort\" >\n" +
    "              <i class=\"fa fa-long-arrow-up\"></i>\n" +
    "            </span>\n" +
    "            <span ng-show=\"!reverseSort\">\n" +
    "              <i class=\"fa fa-long-arrow-down\"></i>\n" +
    "            </span>\n" +
    "          </span>\n" +
    "        </a>\n" +
    "      </th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"clickable-row no-select-row\">\n" +
    "      <td colspan=\"4\">\n" +
    "        <span class=\"folder\">000folder/</span>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "     <tr class=\"clickable-row no-select-row\">\n" +
    "      <td colspan=\"4\">\n" +
    "        <span class=\"folder\">000folder/</span>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "     <tr class=\"clickable-row no-select-row\">\n" +
    "      <td colspan=\"4\">\n" +
    "        <span class=\"folder\">000folder/</span>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "\n" +
    "          \n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</script>\n" +
    "");
}]);
})();
