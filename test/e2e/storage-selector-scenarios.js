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

    describe("** Standard functionality **", function () {

      it("Should correctly display icon button", function () {
        expect(element(by.css("#main button img")).isPresent()).to.eventually.be.true;

        expect(element(by.css("#main button img")).getAttribute("src")).
          to.eventually.equal("http://s3.amazonaws.com/Rise-Images/Icons/storage.png");

        expect(element(by.css("#main button img.storage-selector-icon")).isPresent()).
          to.eventually.be.true;
      });

      it("Should toggle selected state", function () {
        expect(element(by.css("#main button.active")).isPresent()).
          to.eventually.be.false;

        element(by.css("#toggleBtn")).click();

        expect(element(by.css("#main button.active")).isPresent()).
          to.eventually.be.true;

        element(by.css("#toggleBtn")).click();

        expect(element(by.css("#main button.active")).isPresent()).
          to.eventually.be.false;
      });

      it("Should launch the modal upon clicking the button", function () {
        element(by.css("#main button")).click();

        expect(element(by.css(".modal-content")).isPresent()).
          to.eventually.be.true;
      });
    });

    describe("** Applying a label **", function () {

      it("Should correctly position the icon", function () {
        expect(element(by.css("#main button img.icon-right")).isPresent()).
          to.eventually.be.false;

        expect(element(by.css("#label button img.icon-right")).isPresent()).
          to.eventually.be.true;
      });

      it("Should correctly apply the label", function () {
        expect(element(by.css("#main button")).getText()).
        to.eventually.equal("");

        expect(element(by.css("#label button")).getText()).
          to.eventually.equal("Single Video");
      });
    });

  });

})();
