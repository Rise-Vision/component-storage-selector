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
