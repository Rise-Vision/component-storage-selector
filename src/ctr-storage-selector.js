angular.module("risevision.widget.common.storage-selector")
  .controller("StorageCtrl", ["$scope", "$modalInstance", "storageUrl", "$window", "$log",
    function($scope, $modalInstance, storageUrl, $window/*, $log*/){

    $scope.storageUrl = storageUrl;

    $window.addEventListener("message", function (event) {
      var storageTest = "storage-stage.risevision.com",
        storageProd = "storage.risevision.com";

      if (event.origin.indexOf(storageTest) === -1 && event.origin.indexOf(storageProd) === -1) {
        return;
      }

      if (Array.isArray(event.data)) {
        $modalInstance.close(event.data);
      } else if (typeof event.data === "string") {
        if (event.data === "close") {
          $modalInstance.dismiss("cancel");
        }
      }
    });

  }]);
