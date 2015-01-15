/* global CONFIG: true */
/* exported CONFIG */
if (typeof CONFIG === "undefined") {
  var CONFIG = {
    // variables go here
  };

  if (typeof angular !== "undefined") {
    angular.module("risevision.widget.common.storage-selector.config", [])
      .constant("STORAGE_MODAL", "http://storage.risevision.com/~rvi/storage-client-rva-test/storage-modal.html#/files/");
  }
}
