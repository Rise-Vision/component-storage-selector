/*jshint expr:true */
"use strict";

describe("Storage URL Tests", function () {

  var element, scope, $compile, baseURL;

  beforeEach(module("risevision.widget.common.storage-selector"));

  beforeEach(inject(function(_$compile_, $rootScope, _STORAGE_MODAL_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    baseURL = _STORAGE_MODAL_;
  }));

  it("should define storageUrl without 'selector-type' param", function () {
    element = angular.element('<storage-selector company-id="abc123"></storage-selector>');
    $compile(element)(scope);
    scope.$digest(); // Update the HTML

    // Get the isolate scope for the directive
    var isoScope = element.isolateScope();

    expect(isoScope.storageUrl).to.equal(baseURL + "abc123");
  });

  it("should define storageUrl to include 'selector-type' param", function () {
    element = angular.element('<storage-selector company-id="abc123" type="single-folder"></storage-selector>');
    $compile(element)(scope);
    scope.$digest(); // Update the HTML

    // Get the isolate scope for the directive
    var isoScope = element.isolateScope();

    expect(isoScope.storageUrl).to.equal(baseURL + "abc123?selector-type=single-folder");
  });

});
