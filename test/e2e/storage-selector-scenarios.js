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
    beforeEach(function () {
      browser.get("/test/e2e/storage-selector-scenarios.html");
    });

    it("should display file button", function () {
      expect(element(by.css(".file")).isPresent()).to.eventually.be.true;
    });

    it("Should display folder button", function () {
      expect(element(by.css(".folder")).isPresent()).to.eventually.be.true;
    });

    it("Should display custom button", function () {
      expect(element(by.css(".custom")).isPresent()).to.eventually.be.true;
    });

    it("Should have the correct label on the file button", function () {
      expect(element(by.css(".file")).getAttribute("innerText")).to.eventually.equal("Single Video");
    });

    it("Should have the correct label on the folder button", function () {
      expect(element(by.css(".folder")).getAttribute("innerText")).to.eventually.equal("Folder of Video(s)");
    });

    it("Should have the correct label on the custom button", function () {
      expect(element(by.css(".custom")).getAttribute("innerText")).to.eventually.equal("Custom URL");
    });

    it("should set 'active' class on file button when clicked", function () {
      element(by.css(".file")).click();

      expect(element(by.css(".file.active")).isPresent()).to.eventually.be.true;
      expect(element(by.css(".folder.active")).isPresent()).to.eventually.be.false;
      expect(element(by.css(".custom.active")).isPresent()).to.eventually.be.false;
    });

    it("should set 'active' class on folder button when clicked", function () {
      element(by.css(".folder")).click();

      expect(element(by.css(".folder.active")).isPresent()).to.eventually.be.true;
      expect(element(by.css(".file.active")).isPresent()).to.eventually.be.false;
      expect(element(by.css(".custom.active")).isPresent()).to.eventually.be.false;
    });

    it("should set 'active' class on custom button when clicked", function () {
      element(by.css(".custom")).click();

      expect(element(by.css(".custom.active")).isPresent()).to.eventually.be.true;
      expect(element(by.css(".file.active")).isPresent()).to.eventually.be.false;
      expect(element(by.css(".folder.active")).isPresent()).to.eventually.be.false;
    });

    it("Should launch the Storage file selector modal when clicking the file button", function () {
      element(by.css(".file")).click();

      expect(element(by.css(".modal-content .modal-dialog")).getAttribute("src"))
        .to.eventually.equal("https://storage.risevision.com/files/abc123?selector-type=single-file");
    });

    it("Should launch the Storage folder selector modal when clicking the folder button", function () {
      element(by.css(".folder")).click();

      expect(element(by.css(".modal-content")).isPresent()).to.eventually.be.true;
    });

    it("Should not launch the Storage selector modal when clicking the custom button", function () {
      element(by.css(".custom")).click();

      expect(element(by.css(".modal-content")).isPresent()).to.eventually.be.false;
    });

  });

})();
