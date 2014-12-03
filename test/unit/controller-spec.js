/*jshint expr:true */
"use strict";

describe("Controller: StorageCtrl", function () {

  var storageCtrl, scope;

  // mock the modal instance
  var modalInstance = {
    result: {
      then: function(pickedCallback, cancelCallback) {
        this.pickedCallBack = pickedCallback;
        this.cancelCallback = cancelCallback;
      }
    },
    close: function( files ) {
      this.result.pickedCallBack( files );
    },
    dismiss: function( type ) {
      this.result.cancelCallback( type );
    }
  };


  beforeEach(module("risevision.widget.common.storage-selector"));

  beforeEach(inject(function ($controller, $rootScope, $window) {
    scope = $rootScope.$new();
    storageCtrl = $controller("StorageCtrl", {
      $scope: scope,
      $modalInstance: modalInstance,
      $window: $window,
      storageUrl: "http://storage.risevision.com/storage-modal.html#/files/local"
    });
  }));

  it("should define storageUrl", function () {

    expect(scope.storageUrl).be.defined;
    expect(scope.storageUrl).to.equal("http://storage.risevision.com/storage-modal.html#/files/local");

  });

  xit("should invoke modal instance to 'close()'", function () {
    // TODO: need a way to mock triggering $window "message" handler
  });

  xit("should invoke modal instance to 'dismiss'", function () {
    // TODO: need a way to mock triggering $window "message" handler
  });
});
