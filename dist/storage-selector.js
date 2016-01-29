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
    "<html>\n" +
    "\n" +
    "  <body marginwidth=\"0\">\n" +
    "    <div ng-controller=\"ModalWindowController\" class=\"ng-scope\">\n" +
    "      <!-- ngIf: !FULLSCREEN --><div id=\"storage-content\" class=\"storage-modal ng-scope\" ng-if=\"!FULLSCREEN\">\n" +
    "        <div ng-controller=\"modalContainerController\" ng-click=\"closeThrottleNotice()\" class=\"ng-scope\">\n" +
    "          <div ng-controller=\"TopButtonsController\" class=\"ng-scope\">\n" +
    "            <div>\n" +
    "              <button type=\"button\" class=\"close\" data-dismiss=\"modal\" ng-click=\"closeButtonClick()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "              </button>\n" +
    "              <div style=\"clear: both\" class=\"visible-xs\"></div>\n" +
    "              <div ng-controller=\"SubscriptionStatusController\" class=\"visible-xs ng-scope\">\n" +
    "                <div id=\"subscription-status\" subscription-status=\"\" product-id=\"24\" product-code=\"b0cba08a4baa0c62b8cdc621b6f6a124f89a03db\" company-id=\"f114ad26-949d-44b4-87e9-8528afc76ce4\" ng-model=\"subscriptionStatus.result\" show-store-modal=\"showStoreModal\" expanded-format=\"true\" class=\"ng-untouched ng-valid ng-isolate-scope ng-dirty ng-valid-parse\"><div ng-show=\"!expandedFormat\" class=\"ng-hide\">\n" +
    "  <h3 ng-disable-right-click=\"\">\n" +
    "    <span ng-show=\"subscriptionStatus.statusCode !== 'not-subscribed'\" ng-bind-html=\"'subscription-status.' + subscriptionStatus.statusCode + subscriptionStatus.plural | translate:subscriptionStatus | to_trusted\" class=\"ng-binding\">Subscribed</span>\n" +
    "  </h3>\n" +
    "  \n" +
    "  <span ng-show=\"subscriptionStatus.statusCode === 'trial-available'\" class=\"ng-hide\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.start-trial\" class=\"ng-scope\">Start Trial</span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "  <span ng-show=\"['on-trial', 'trial-expired', 'cancelled', 'not-subscribed'].indexOf(subscriptionStatus.statusCode) >= 0\" class=\"ng-hide\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe\" class=\"ng-scope\">Subscribe</span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "  <span ng-show=\"['suspended'].indexOf(subscriptionStatus.statusCode) >= 0\" class=\"ng-hide\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreAccountModal = true;\">\n" +
    "      <span translate=\"subscription-status.view-account\" class=\"ng-scope\">View Account</span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"expandedFormat\">\n" +
    "  <div class=\"subscription-status trial ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'on-trial'\">\n" +
    "    <span ng-bind-html=\"'subscription-status.expanded-' + subscriptionStatus.statusCode + subscriptionStatus.plural | translate:subscriptionStatus | to_trusted\" class=\"ng-binding\">subscription-status.expanded-subscribed</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\" class=\"ng-scope\">Subscribe Now!</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status expired ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'trial-expired'\">\n" +
    "    <span translate=\"subscription-status.expanded-expired\" class=\"ng-scope\">Your trial has expired</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\" class=\"ng-scope\">Subscribe Now!</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status cancelled ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'cancelled'\">\n" +
    "   <span translate=\"subscription-status.expanded-cancelled\" class=\"ng-scope\">Your subscription was cancelled</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\" class=\"ng-scope\">Subscribe Now!</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status suspended ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'suspended'\">\n" +
    "    <span translate=\"subscription-status.expanded-suspended\" class=\"ng-scope\">Your account is suspended</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreAccountModal = true;\">\n" +
    "      <span translate=\"subscription-status.view-invoices\" class=\"ng-scope\">View Invoices</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "              </div>\n" +
    "              <h3 update-title=\"\" translate=\"storage-client.select-single-folder\" class=\"ng-scope\">Select a Folder</h3>\n" +
    "              <div class=\"selector-header\">\n" +
    "\n" +
    "                <div class=\"icon-nav pull-right\" ng-hide=\"activeSearch || trialAvailable\">\n" +
    "                  <button class=\"btn btn-link\" ng-hide=\"statusDetails.code!==200 || fileListStatus.code===404\" ng-click=\"newFolderButtonClick('md')\" ng-disabled=\"isTrashFolder()\">\n" +
    "                    <svg-icon p=\"iconNewFolder\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path d=\"M30.7 8c-0.8-0.8-1.9-1-3.1-1H15V5.9c0-1.2-0.5-2-1.4-2.8C12.8 2.2 11.7 2 10.5 2H4.3C3.1 2 2.1 2.2 1.3 3.1 0.4 3.9 0 4.7 0 5.9v18.5c0 1.2 0.4 2.3 1.3 3.2C2.1 28.5 3.1 29 4.3 29h23.3c1.2 0 2.2-0.5 3.1-1.4 0.9-0.9 1.3-2 1.3-3.2V10.8C32 9.6 31.6 8.9 30.7 8zM23 20h-5v5h-4v-5H9v-4h5v-5h4v5h5V20\"></path><path d=\"\"></path></svg></svg-icon>\n" +
    "                  </button>\n" +
    "                  <label for=\"upload-files\" class=\"btn btn-link ng-hide\" ng-hide=\"statusDetails.code!==200 || fileListStatus.code===404 || singleFolderSelector\" ng-disabled=\"!(filesDetails.localFiles === false &amp;&amp; !isTrashFolder())\">\n" +
    "                    <i class=\"fa fa-cloud-upload\"></i>\n" +
    "                  </label>\n" +
    "                  <button class=\"btn btn-link\" ng-click=\"showSelectorFileSearch()\">\n" +
    "                    <i class=\"fa fa-search\"></i>\n" +
    "                  </button>\n" +
    "                </div>\n" +
    "        \n" +
    "                <div class=\"description\" ng-hide=\"activeSearch\">\n" +
    "                  <p><strong class=\"ng-binding\">Rise Vision Inc.</strong></p>\n" +
    "                </div>\n" +
    "        \n" +
    "                <div class=\"icon-nav ng-hide\" ng-show=\"activeSearch &amp;&amp; !trialAvailable\">\n" +
    "                  <div class=\"input-group\">\n" +
    "                    <input id=\"selectorQuery\" ng-model=\"query\" type=\"text\" class=\"form-control ng-pristine ng-untouched ng-valid\" placeholder=\"Search files or folders\">\n" +
    "                    <span ng-click=\"hideSelectorFileSearch()\" class=\"input-group-addon clickable\"><i class=\"fa fa-times\"></i></span>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div ng-controller=\"SubscriptionStatusController\" class=\"hidden-xs ng-scope\">\n" +
    "                <div id=\"subscription-status\" subscription-status=\"\" product-id=\"24\" product-code=\"b0cba08a4baa0c62b8cdc621b6f6a124f89a03db\" company-id=\"f114ad26-949d-44b4-87e9-8528afc76ce4\" ng-model=\"subscriptionStatus.result\" show-store-modal=\"showStoreModal\" expanded-format=\"true\" class=\"ng-untouched ng-valid ng-isolate-scope ng-dirty ng-valid-parse\"><div ng-show=\"!expandedFormat\" class=\"ng-hide\">\n" +
    "  <h3 ng-disable-right-click=\"\">\n" +
    "    <span ng-show=\"subscriptionStatus.statusCode !== 'not-subscribed'\" ng-bind-html=\"'subscription-status.' + subscriptionStatus.statusCode + subscriptionStatus.plural | translate:subscriptionStatus | to_trusted\" class=\"ng-binding\">Subscribed</span>\n" +
    "  </h3>\n" +
    "  \n" +
    "  <span ng-show=\"subscriptionStatus.statusCode === 'trial-available'\" class=\"ng-hide\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.start-trial\" class=\"ng-scope\">Start Trial</span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "  <span ng-show=\"['on-trial', 'trial-expired', 'cancelled', 'not-subscribed'].indexOf(subscriptionStatus.statusCode) >= 0\" class=\"ng-hide\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe\" class=\"ng-scope\">Subscribe</span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "  <span ng-show=\"['suspended'].indexOf(subscriptionStatus.statusCode) >= 0\" class=\"ng-hide\">\n" +
    "    <button class=\"btn btn-primary btn-xs\" ng-click=\"showStoreAccountModal = true;\">\n" +
    "      <span translate=\"subscription-status.view-account\" class=\"ng-scope\">View Account</span>\n" +
    "    </button>\n" +
    "  </span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"expandedFormat\">\n" +
    "  <div class=\"subscription-status trial ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'on-trial'\">\n" +
    "    <span ng-bind-html=\"'subscription-status.expanded-' + subscriptionStatus.statusCode + subscriptionStatus.plural | translate:subscriptionStatus | to_trusted\" class=\"ng-binding\">subscription-status.expanded-subscribed</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\" class=\"ng-scope\">Subscribe Now!</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status expired ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'trial-expired'\">\n" +
    "    <span translate=\"subscription-status.expanded-expired\" class=\"ng-scope\">Your trial has expired</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\" class=\"ng-scope\">Subscribe Now!</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status cancelled ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'cancelled'\">\n" +
    "   <span translate=\"subscription-status.expanded-cancelled\" class=\"ng-scope\">Your subscription was cancelled</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreModal = true;\">\n" +
    "      <span translate=\"subscription-status.subscribe-now\" class=\"ng-scope\">Subscribe Now!</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"subscription-status suspended ng-hide\" ng-show=\"subscriptionStatus.statusCode === 'suspended'\">\n" +
    "    <span translate=\"subscription-status.expanded-suspended\" class=\"ng-scope\">Your account is suspended</span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary add-left\" ng-click=\"showStoreAccountModal = true;\">\n" +
    "      <span translate=\"subscription-status.view-invoices\" class=\"ng-scope\">View Invoices</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <!--Body content-->\n" +
    "            <!-- uiView:  --><div ui-view=\"\" ng-show=\"!trialAvailable\" class=\"ng-scope\"><div ng-controller=\"UploadController\" class=\"ng-scope\">\n" +
    "  <div class=\"content-box animated fadeInDown upload-panel ng-hide\" ng-show=\"uploader.queue.length > 0\">\n" +
    "    \n" +
    "      <div ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "        <div class=\"content-box-header\">\n" +
    "          <span class=\"collapse-control\">\n" +
    "            <i class=\"fa fa-chevron-down\" ng-class=\"{false: 'fa-chevron-up', true:'fa-chevron-down'}[!isCollapsed]\"></i>\n" +
    "          </span>\n" +
    "          <p>\n" +
    "            <strong translate=\"storage-client.upload-status\" class=\"ng-scope\">Upload Status</strong>:\n" +
    "            <span ng-show=\"activeUploadCount() === 1\" translate=\"storage-client.uploading-one-file\" class=\"ng-scope ng-hide\">Uploading 1 file</span>\n" +
    "            <span ng-show=\"activeUploadCount() !== 1\" translate=\"storage-client.uploading-count-files\" translate-values=\"{ count: activeUploadCount() }\" class=\"ng-scope\">Uploading 0 files</span>\n" +
    "          </p>\n" +
    "\n" +
    "          <div class=\"actions-block\">\n" +
    "            <button class=\"btn btn-default btn-sm\" type=\"button\" ng-click=\"cancelAllUploads()\" title=\"Cancel All\">\n" +
    "              <span translate=\"storage-client.cancel-uploads\" class=\"ng-scope\">Cancel All</span>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-default btn-sm ng-hide\" type=\"button\" ng-click=\"retryFailedUploads()\" ng-show=\"getErrorCount() > 0 &amp;&amp; getNotErrorCount() === 0\" title=\"Retry failed uploads\">\n" +
    "            <span translate=\"storage-client.retry-failed-uploads\" class=\"ng-scope\">Retry failed uploads</span>\n" +
    "            </button>\n" +
    "          </div>\n" +
    "          \n" +
    "        </div><!--content-box-header-->\n" +
    "\n" +
    "      </div>\n" +
    "      <div ng-show=\"!isCollapsed\">\n" +
    "      <div class=\"content-box-body\">\n" +
    "        <!-- ngRepeat: item in uploader.queue -->\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal fade\" tabindex=\"-1\">\n" +
    "    <form id=\"uploadform\" class=\"ng-pristine ng-valid\">\n" +
    "      <input type=\"file\" id=\"upload-files\" storage-file-select=\"\" uploader=\"uploader\" multiple=\"\">\n" +
    "      <input type=\"file\" id=\"upload-folders\" storage-file-select=\"\" uploader=\"uploader\" webkitdirectory=\"\">\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- uiView:  --><div ui-view=\"\" class=\"ng-scope\"><div ng-controller=\"FileListCtrl\" id=\"list\" class=\"ng-scope\">\n" +
    "\n" +
    "<div class=\"container ng-scope ng-hide\" id=\"fileinspector_noFiles\" ng-show=\"statusDetails.code!==202 &amp;&amp; !filesDetails.bucketExists\">\n" +
    "<div class=\"file-empty-state\">\n" +
    "  <div class=\"product-graphic\">\n" +
    "    <svg-icon p=\"riseStorage\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path d=\"M8 32h20.2c2.1 0 3.8-1.7 3.8-3.8V9L8 32zM19 29v-4h4.3L19 29zM25 23v-4h4.3L25 23zM24 31v-7h7.3L24 31z\"></path><path d=\"M1.8 9.1c1.2 0.7 2.9 1.3 5 1.7 2.1 0.4 4.4 0.6 6.9 0.6 2.5 0 4.8-0.2 6.9-0.6 2.1-0.4 3.5-1 4.8-1.7C26.6 8.4 27 7.7 27 6.9V4.6c0-0.8-0.4-1.6-1.6-2.3 -1.2-0.7-2.8-1.3-4.9-1.7C18.4 0.2 16.1 0 13.7 0c-2.5 0-4.7 0.2-6.8 0.6C4.7 1 3 1.6 1.8 2.3 0.6 3 0 3.7 0 4.6v2.3C0 7.7 0.6 8.4 1.8 9.1zM1.8 16c1.2 0.7 2.9 1.3 5 1.7 2.1 0.4 4.4 0.6 6.9 0.6 2 0 3.9-0.1 5.7-0.4l6.6-6.4c-1.2 0.6-2.7 1.1-4.5 1.5 -2.5 0.5-5.1 0.8-7.9 0.8 -2.8 0-5.5-0.3-7.9-0.8C3.3 12.4 1 11.7 0 10.7v3C0 14.5 0.6 15.3 1.8 16zM1.8 22.9c1.2 0.7 2.9 1.3 5 1.7 1.6 0.3 3.3 0.5 5.1 0.6l4.8-4.6c-1 0.1-2 0.1-3 0.1 -2.8 0-5.5-0.3-7.9-0.8C3.3 19.3 1 18.5 0 17.5v3C0 21.4 0.6 22.2 1.8 22.9zM5.8 26.7C3.3 26.1 1 25.4 0 24.4v3c0 0.8 0.6 1.6 1.9 2.3 1 0.6 2.3 1 3.8 1.4l4-3.9C8.3 27.1 7 26.9 5.8 26.7z\"></path></svg></svg-icon>\n" +
    "  </div>\n" +
    "  <p>You haven't added files yet! </p>\n" +
    "  <br>\n" +
    "  <span> Select \n" +
    "    <button type=\"button\" class=\"btn btn-link\" title=\"Upload\" disabled=\"disabled\">\n" +
    "      <i class=\"fa fa-cloud-upload fa-2x\"></i>\n" +
    "    </button>\n" +
    "    above to upload a file,<br>\n" +
    "    or \n" +
    "    <button type=\"button\" class=\"btn btn-link\" title=\"Add Folder\" disabled=\"disabled\">\n" +
    "      <svg-icon p=\"iconNewFolder\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path d=\"M30.7 8c-0.8-0.8-1.9-1-3.1-1H15V5.9c0-1.2-0.5-2-1.4-2.8C12.8 2.2 11.7 2 10.5 2H4.3C3.1 2 2.1 2.2 1.3 3.1 0.4 3.9 0 4.7 0 5.9v18.5c0 1.2 0.4 2.3 1.3 3.2C2.1 28.5 3.1 29 4.3 29h23.3c1.2 0 2.2-0.5 3.1-1.4 0.9-0.9 1.3-2 1.3-3.2V10.8C32 9.6 31.6 8.9 30.7 8zM23 20h-5v5h-4v-5H9v-4h5v-5h4v5h5V20\"></path><path d=\"\"></path></svg></svg-icon>\n" +
    "    </button>\n" +
    "    to create a folder.\n" +
    "  </span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"alert alert-danger ng-hide\" ng-show=\"statusDetails.code===403\">\n" +
    "  <span translate=\"storage-client.not-authorized\" class=\"ng-scope\">Your account  doesn't have access to this company.  Please login with a different account and try again.</span>\n" +
    "</div>\n" +
    "<div id=\"cookieTester\" ng-controller=\"cookieTesterController as cookieController\" class=\"ng-scope\">\n" +
    "  <div class=\"alert alert-danger ng-binding ng-hide\" ng-hide=\"true\">\n" +
    "      Cookie enablement verified\n" +
    "  </div>\n" +
    "  <div ng-hide=\"!cookieController.status.passed\" class=\"\">\n" +
    "    <div id=\"oauthNotice\" class=\"alert alert-danger ng-hide\" ng-hide=\"statusDetails.code !== 401 &amp;&amp; statusDetails.code !== 400 &amp;&amp; isAuthed === true\">\n" +
    "      <span translate=\"common.required-credentials\" class=\"ng-scope\">Rise Vision needs access to your Google account to verify who you are</span>\n" +
    "      <button class=\"btn btn-primary btn-sm\" type=\"button\" ng-click=\"login()\">\n" +
    "        <span title=\"storage-client.permission-request\" class=\"fa fa-check\"> <span translate=\"common.ok\" class=\"ng-scope\">Okay</span></span>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"content-box ng-hide\" ng-show=\"activeFolderDownloads.length > 0\">\n" +
    "  <div class=\"content-box-body\">\n" +
    "    <!-- ngRepeat: folder in activeFolderDownloads -->\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"content-box\" ng-show=\"filesDetails.bucketExists\">\n" +
    "<div class=\"scrollable-list\">\n" +
    "<div class=\"content-box-body ng-hide\" ng-show=\"statusDetails.code!==202 &amp;&amp; !isFileListVisible()\">\n" +
    "  <p class=\"text-center text-muted\">No Files</p>\n" +
    "</div>\n" +
    "<table class=\"table-2 table-hover table-selector single-selector\" ng-class=\"storageFull || multipleFileSelector ? 'multiple-selector' : 'single-selector'\" ng-show=\"statusDetails.code!==202 &amp;&amp; statusDetails.code!==404 &amp;&amp; isFileListVisible()\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th class=\"col-sm-6\">\n" +
    "        <input type=\"checkbox\" class=\"add-right ng-pristine ng-untouched ng-valid\" ng-model=\"selectAll\">\n" +
    "        <label ng-click=\"selectAllCheckboxes(query)\" ng-show=\"storageFull || multipleFileSelector\" class=\"ng-hide\"></label>\n" +
    "        <a href=\"\" ng-click=\"orderByAttribute = fileNameOrderFunction; reverseSort = !reverseSort\">\n" +
    "          <span translate=\"common.file-name\" class=\"ng-scope\">Name</span>\n" +
    "          <span ng-show=\"orderByAttribute==fileNameOrderFunction\">\n" +
    "            <span ng-show=\"reverseSort\" class=\"ng-hide\">\n" +
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
    "          <span ng-show=\"orderByAttribute==fileExtOrderFunction\" class=\"ng-hide\">\n" +
    "            <span ng-show=\"reverseSort\" class=\"ng-hide\">\n" +
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
    "          <span ng-show=\"orderByAttribute==fileSizeOrderFunction\" class=\"ng-hide\">\n" +
    "            <span ng-show=\"reverseSort\" class=\"ng-hide\">\n" +
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
    "          <span ng-show=\"orderByAttribute==dateModifiedOrderFunction\" class=\"ng-hide\">\n" +
    "            <span ng-show=\"reverseSort\" class=\"ng-hide\">\n" +
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
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "            <div ng-show=\"trialAvailable\" class=\"ng-hide\">\n" +
    "              <!-- ngInclude: undefined --><ng-include src=\"'partials/start-trial.html'\" ng-show=\"trialAvailable\" class=\"ng-scope ng-hide\"><div class=\"container ng-scope\" id=\"pitchdeck\">\n" +
    "  <div>&nbsp;</div>\n" +
    "  <div class=\"add-bottom blank-state\">\n" +
    "    <div class=\"product-graphic\">\n" +
    "      <img itemprop=\"image\" class=\"img-responsive\" src=\"https://s3.amazonaws.com/Store-Products/Rise-Vision/storage_image.png\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"content-box-body ng-scope\">\n" +
    "      <div class=\"product-intro\">\n" +
    "        <h1>Storage</h1>\n" +
    "        <p class=\"lead\"><strong>Manage and deliver media to your digital signage displays, anywhere, anytime.</strong></p>\n" +
    "        <p class=\"lead\">Free 30 days trial. No credit card required.</p>\n" +
    "        <p class=\"lead\">$10 per Company per Month.</p>\n" +
    "        <button type=\"button\" class=\"btn btn-hg btn-primary\" ng-click=\"startTrial()\">Start Your Free Trial</button>\n" +
    "      </div>\n" +
    "    </div>    \n" +
    "  </div>\n" +
    "</div>\n" +
    "</ng-include>\n" +
    "            </div>\n" +
    "      \n" +
    "            <div ng-controller=\"FilesButtonsController\" ng-show=\"multipleFileSelector &amp;&amp; !trialAvailable\" class=\"ng-scope ng-hide\">\n" +
    "              <button type=\"button\" title=\"select\" class=\"btn btn-primary\" ng-click=\"selectButtonClick()\" ng-disabled=\"filesDetails.checkedCount < 1 &amp;&amp; filesDetails.folderCheckedCount < 1\" disabled=\"disabled\">\n" +
    "                <span translate=\"common.select\" class=\"ng-scope\">Select</span> <span class=\"fa fa-check icon-right\"></span>\n" +
    "              </button>\n" +
    "              <button class=\"btn btn-default ng-scope\" ng-controller=\"ModalWindowController\" ng-click=\"closeButtonClick()\">\n" +
    "                <span translate=\"common.cancel\" class=\"ng-scope\">Cancel</span> <span class=\"fa fa-times icon-right\"></span>\n" +
    "              </button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div>\n" +
    "          <span us-spinner=\"{ radius: 24, width: 8, length: 16 }\" spinner-key=\"spn-storage-main\" class=\"ng-scope\"></span>\n" +
    "        </div>\n" +
    "        <iframe name=\"logoutFrame\" id=\"logoutFrame\" style=\"display:none\"></iframe>\n" +
    "      </div><!-- end ngIf: !FULLSCREEN -->\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-controller=\"FullScreenController\" class=\"ng-scope\">\n" +
    "      <!-- ngIf: FULLSCREEN===true -->\n" +
    "    </div>\n" +
    "  \n" +
    "    \n" +
    "</body>\n" +
    "</html>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</script>\n" +
    "");
}]);
})();
