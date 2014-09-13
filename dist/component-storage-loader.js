(function (angular) {

  'use strict';

  angular
  .module('risevision.widget.common.storage-client-loader', [])
  .directive('storageClientLoader', ['$window','$templateCache',
    function($window, $templateCache){
      return {
        restrict: 'E',
        scope : {
           companyid : '='
        },
        template: $templateCache.get('loader.html'),
        link: function (scope) {
          scope.show = false;
          scope.storageUrl = 'http://storage.risevision.com/storage-modal.html#/files/'+scope.companyId;

          $window.addEventListener('message',
            function (event) {
              if (event.origin !== 'http://storage.risevision.com') { return; }
              if (event.data === "close") {
                  document.getElementsByClassName('storage-selector-backdrop')[0].click();
              }
              console.log(event.data);
            }, false);

          scope.showSelector = function(){
            scope.show = true;
          };
          scope.hideSelector = function(){
            scope.show = false;
          };
        }//link
      };//return
   }//function
  ]);//directive
})(angular);



(function(module) {
try { app = angular.module("risevision.widget.common.storage-client-loader"); }
catch(err) { app = angular.module("risevision.widget.common.storage-client-loader", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("loader.html",
    "<button class=\"btn btn-widget-icon-storage\" ng-click=\"showSelector()\" type=\"button\" />\n" +
    "<div ng-if=\"show\">\n" +
    "   <div class=\"storage-selector-backdrop\" ng-click=\"hideSelector()\"></div>\n" +
    "  <iframe class=\"storage-selector-iframe\" src=\"{{storageUrl}}\"></iframe>\n" +
    "</div>");
}]);
})();
