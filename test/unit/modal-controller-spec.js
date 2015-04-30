/*jshint expr:true */
"use strict";

describe("Modal Controller Tests", function () {

  var scope, ctrl, baseUrl, closeSpy, dismissSpy;

  // mock the modal instance
  var modalInstance = {
    close: function( files ) {},
    dismiss: function( type ) {}
  };

  beforeEach(module("risevision.widget.common.storage-selector"));

  beforeEach(inject(function() {
    closeSpy = sinon.spy(modalInstance, "close");
    dismissSpy = sinon.spy(modalInstance, "dismiss");
  }));

  beforeEach(inject(function($rootScope, $controller, _STORAGE_MODAL_) {
    scope = $rootScope.$new();
    baseUrl = _STORAGE_MODAL_;
    ctrl = $controller('StorageCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      STORAGE_MODAL: baseUrl,
      storageUrl: baseUrl + "abc123?selector-type=single-folder"});
  }));

  afterEach(function () {
    modalInstance.close.restore();
    modalInstance.dismiss.restore();
  });

  it("should return false when origin value passed to isSameOrigin() not the same as STORAGE_MODAL", function () {
    var value = scope.isSameOrigin("http://www.test.com");

    expect(value).to.be.false;
  });

  it("should return true when origin value passed to isSameOrigin() is the same as STORAGE_MODAL", function () {
    var value = scope.isSameOrigin(baseUrl);

    expect(value).to.be.true;
  });

  it("should not call any functions on modalInstance if origin of window message not the same as modal", function () {
    var selected = ["http://test1.jpg", "test2.jpg"],
      messageEvent = {
        data: selected,
        origin: "http://www.test.com"
      };

    scope.messageHandler(messageEvent);

    expect(dismissSpy).to.have.callCount(0);
    expect(closeSpy).to.have.callCount(0);
  });

  it("should call dismiss on modalInstance when 'close' is the value of event.data in window message event", function () {
    var messageEvent = {
      data: "close",
      origin: baseUrl
    };

    scope.messageHandler(messageEvent);

    expect(dismissSpy).to.have.been.calledWith("cancel");
  });

  it("should call close on modalInstance when event.data is an Array of files in window message event", function () {
    var selected = ["http://test1.jpg", "test2.jpg"],
      messageEvent = {
        data: selected,
        origin: baseUrl
      };

    scope.messageHandler(messageEvent);

    expect(closeSpy).to.have.been.calledWith(selected);
  });


});
