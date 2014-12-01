/* jshint expr: true */

(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  //var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("Storage Selector Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/storage-selector-scenarios.html");
    });

    xit("Should do something", function () {
      // expect something
    });

  });

})();
