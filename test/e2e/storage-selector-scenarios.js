/* jshint expr: true */

(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("Storage Selector Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/storage-selector-scenarios.html");
    });

    it("Should correctly display icon button", function () {
      expect(element(by.css(".btn-widget-icon-storage")).isPresent()).
        to.eventually.be.true;
    });

    it("Should launch the modal upon clicking the button", function () {
      element(by.css("button.btn-widget-icon-storage")).click();

      expect(element(by.css(".modal-content")).isPresent()).
        to.eventually.be.true;
    });

  });

})();
