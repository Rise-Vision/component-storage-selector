if (typeof angular !== "undefined") {
  angular.module("risevision.widget.common.storage-selector.config", [])
    // ** NOTE **
    // Due to the build infrastructure and how Widgets import the compiled dist/storage-selector.js version,
    // the value here will not be used. It is for reference so that it can be used to override the value
    // in the Widgets config/test.js file
    .value("STORAGE_MODAL", "https://apps-stage-0.risevision.com/storage-selector.html#/?cid=");
}
