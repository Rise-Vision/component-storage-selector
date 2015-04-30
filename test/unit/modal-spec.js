/*jshint expr:true */
"use strict";

describe("Modal Tests", function () {

  var element, scope, $compile, $modal, stub;

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

  beforeEach(inject(function($modal) {
    stub = sinon.stub($modal, "open", function () {
      return modalInstance;
    });
  }));

  beforeEach(inject(function(_$compile_, $rootScope, _$modal_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    $modal = _$modal_;
  }));

  it("should close the dialog when close is called and receive array of selected files", function () {
    var selected = ["http://testfile1.jpg, http://testfile2.jpg"];

    element = angular.element('<storage-selector company-id="abc123" type="single-folder"></storage-selector>');
    $compile(element)(scope);
    scope.$digest(); // Update the HTML

    // Get the isolate scope for the directive
    var isoScope = element.isolateScope();

    isoScope.open();

    // simulating selection in the modal instance with an array of selected files
    isoScope.modalInstance.close( selected );

    expect(isoScope.files).to.be.an('array');
    expect(isoScope.files).to.eql(selected);
  });

  it("should cancel the dialog when dismiss is called", function () {
    element = angular.element('<storage-selector company-id="abc123" type="single-folder"></storage-selector>');
    $compile(element)(scope);
    scope.$digest(); // Update the HTML

    // Get the isolate scope for the directive
    var isoScope = element.isolateScope();

    isoScope.open();

    // simulating a cancel on the modal instance
    isoScope.modalInstance.dismiss( "cancel" );

    expect(isoScope.canceled).to.be.true;
  });


});
