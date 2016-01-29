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
    "<button class=\"btn btn-default\" ng-class=\"{active: selected}\" ng-click=\"open()\" type=\"button\" >\n" +
    "  {{ label }}<img src=\"http://s3.amazonaws.com/Rise-Images/Icons/storage.png\" class=\"storage-selector-icon\" ng-class=\"{'icon-right': label}\">\n" +
    "</button>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"storage.html\">  //prototype modal\n" +
    "        \n" +
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
    "                  <div class=\"input-group\">\n" +
    "                    <input id=\"selectorQuery\" ng-model=\"query\" type=\"text\" class=\"form-control ng-pristine ng-untouched ng-valid\" placeholder=\"Search files or folders\">\n" +
    "                    <span ng-click=\"hideSelectorFileSearch()\" class=\"input-group-addon clickable\"><i class=\"fa fa-times\"></i></span>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<table class=\"table-2 table-hover table-selector single-selector\" ng-class=\"storageFull || multipleFileSelector ? 'multiple-selector' : 'single-selector'\" ng-show=\"statusDetails.code!==202 &amp;&amp; statusDetails.code!==404 &amp;&amp; isFileListVisible()\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th class=\"col-sm-6\">\n" +
    "        <input type=\"checkbox\" class=\"add-right ng-pristine ng-untouched ng-valid\" ng-model=\"selectAll\">\n" +
    "        <label ng-click=\"selectAllCheckboxes(query)\" ng-show=\"storageFull || multipleFileSelector\"></label>\n" +
    "        <a href=\"\" ng-click=\"orderByAttribute = fileNameOrderFunction; reverseSort = !reverseSort\">\n" +
    "          <span translate=\"common.file-name\" class=\"ng-scope\">Name</span>\n" +
    "          <span ng-show=\"orderByAttribute==fileNameOrderFunction\">\n" +
    "            <span ng-show=\"reverseSort\" >\n" +
    "              <i class=\"fa fa-long-arrow-up\"></i>\n" +
    "            </span>\n" +
    "            <span ng-show=\"!reverseSort\">\n" +
    "              <i class=\"fa fa-long-arrow-down\"></i>\n" +
    "            </span>\n" +
    "          </span>\n" +
    "        </a>\n" +
    "      </th>\n" +
    "      <th class=\"col-sm-2 hidden-xs\" ng-click=\"orderByAttribute = fileExtOrderFunction; reverseSort = !reverseSort\">\n" +
    "        <a href=\"\"><span translate=\"common.file-type\" class=\"ng-scope\">Type</span>\n" +
    "          <span ng-show=\"orderByAttribute==fileExtOrderFunction\"  >\n" +
    "            <span ng-show=\"reverseSort\"  >\n" +
    "              <i class=\"fa fa-long-arrow-up\"></i>\n" +
    "            </span>\n" +
    "            <span ng-show=\"!reverseSort\">\n" +
    "              <i class=\"fa fa-long-arrow-down\"></i>\n" +
    "            </span>\n" +
    "          </span>\n" +
    "        </a>\n" +
    "      </th>\n" +
    "      <th class=\"col-sm-2 visible-lg\" ng-click=\"orderByAttribute = fileSizeOrderFunction; reverseSort = !reverseSort\">\n" +
    "        <a href=\"\"><span translate=\"common.file-size\" class=\"ng-scope\">Size</span>\n" +
    "          <span ng-show=\"orderByAttribute==fileSizeOrderFunction\"  >\n" +
    "            <span ng-show=\"reverseSort\"  >\n" +
    "              <i class=\"fa fa-long-arrow-up\"></i>\n" +
    "            </span>\n" +
    "            <span ng-show=\"!reverseSort\">\n" +
    "              <i class=\"fa fa-long-arrow-down\"></i>\n" +
    "            </span>\n" +
    "          </span>\n" +
    "        </a>\n" +
    "      </th>\n" +
    "      <th class=\"col-sm-2 visible-lg\" ng-click=\"orderByAttribute = dateModifiedOrderFunction; reverseSort = !reverseSort\">\n" +
    "        <a href=\"\"><span translate=\"common.file-date-mod\" class=\"ng-scope\">Modified</span>\n" +
    "          <span ng-show=\"orderByAttribute==dateModifiedOrderFunction\"  >\n" +
    "            <span ng-show=\"reverseSort\"  >\n" +
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
    "    <!-- ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">000folder/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">000test/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">001folder/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">002folder/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">00deleteme/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">01abcd/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">0alpha/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">0beta/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">alan/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Album CYLB5 - Imgur/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Alternate Logo/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">another folder/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Another of Shea's Folders/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Another Test of Shea's/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">asdasd/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">asdf/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">ashleigh is testing/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">blake test/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">brew-gallery/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Byron/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">community-slider/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">content-clatsop/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">content-resources/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">content-restaurant-promotion/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">content-template-jobs-board-master/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">coupon_campaign/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">delete me at will/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">delete me/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Display/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">DS_Images/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">education-k-12-calendar/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">events/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">FilterableProductGrid/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">fonts/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">halloweentemplate/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">hotel_landscape_template/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">html-pages-content/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">HTML5VIDEOTEMPLATE/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">imageslider/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">instagram-content/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Interactive_InfoBoard/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">jobs_board_template/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Justin/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Justin2/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">k-12 Premium Template/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">landing-restaurant/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Lato2OFLWeb/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">mat/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">matthew test/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">offline-presentation/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Open_Sans_Condensed/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">overlay article/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">peter/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">profile photo/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">RainEffect/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">rbc-community-videos/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Rise Training Mohonasen/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Rise Vision Themes/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">ryan/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">sailormoon/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">sample-education-k-12-premium/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">school-social-media/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">scroll/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">scrollingelementsarticle/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Shea - Sample/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Shea test/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">shea's folder/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Shea's Test Folder/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">SOH/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Storage_files/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Store-Templates/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">stu/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">template_images_Do-Not-Delete/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">test 0413/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Test 1/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">test-template/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">test/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">test02134/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">test09/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">test098/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">test3232/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">testFolder/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">testfolder222/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">testingaa/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">tests/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">touch-systems/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">touch/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">UPTIME WALL ASSETS/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">uptime wall image folder do not touch/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">uptime wall video folder do not touch/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Weather-template/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">Widgets/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">winona-test/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index --><tr class=\"clickable-row ng-scope no-select-row\" ng-click=\"fileClick(file);\" ng-class=\"{'active': file.isChecked, 'blocked-file': file.isThrottled, 'back-btn': file.currentFolder, 'no-select-row': file.currentFolder || fileIsTrash(file) || (fileIsFolder(file) &amp;&amp; !storageFull) }\" ng-repeat=\"file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index\">\n" +
    "      <!-- ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) --><td colspan=\"4\" ng-if=\"fileIsFolder(file) &amp;&amp; (!fileIsTrash(file) || storageFull)\" class=\"ng-scope\">\n" +
    "        <span class=\"folder ng-binding\">winter theme/</span>\n" +
    "      </td><!-- end ngIf: fileIsFolder(file) && (!fileIsTrash(file) || storageFull) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "      <!-- ngIf: !fileIsFolder(file) -->\n" +
    "    </tr><!-- end ngRepeat: file in filesDetails.files | filter:query | orderBy:orderByAttribute:reverseSort track by $index -->\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "\n" +
    "          \n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</script>\n" +
    "");
}]);
})();
