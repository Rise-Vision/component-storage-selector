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
