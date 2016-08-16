angular.module('starter.publishActivityDirective', [])
    .directive('formatDate', function(){
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ngModelCtrl) {
      ngModelCtrl.$formatters.push(function(modelValue){
        if(modelValue) {

          return new Date(modelValue);
        }
      });

      ngModelCtrl.$parsers.push(function(value){
        if(value) {
          return $filter('date')(value, 'yyyy-MM-dd');
        }
      });
    }
  };
})



.directive('uploadPhotoControl', function ($rootScope) {
    var data;
    var imageInputEle = '<p class="imageBox" ><img src="./img/othere/addIcon.jpg"></p>';
  if(!$rootScope.devicePlatform || ($rootScope.devicePlatform && $rootScope.devicePlatform === "browser")) {
    imageInputEle = //'<p class="imageBox" ><img src="./img/othere/addIcon.jpg"></p>'+
    '<p><input type="file" id="addBrowserImage" style="opacity:1"/></p>' ;

  }else{

    imageInputEle = '<p class="imageBox" ><img src="./img/othere/addIcon.jpg"></p>' ;
  }

  var htmlNoeImage = '<div class="noeImage" ng-repeat="image in data.images" ng-click="removeFn(image)" name="{{image.name}}">' +
      '<p class="imageBox"><img src="{{image.src}}" img-auto tsrc="{{image.tsrc}}" onerror="window.imageError(this)"></p>' +
      '<i class="ion-android-close close"></i>' +
      '</div>';
    var html = '<div class="upload-photo-control">' +
      htmlNoeImage +
      '<div class="noeImage" ng-click="selectPicture()">' +
        imageInputEle+
      //'<p class="imageBox" ><img src="./img/othere/addIcon.jpg"></p>' +
      //'<input type="file" class="init" id="addImage">' +
      '</div>' +
      '</div>';
    window.imageError=function(image){
      if(image.onerrorIndex>3)return;
      var src=image.src;
      if(!image.onerrorIndex)image.onerrorIndex=0;
      image.onerrorIndex++;
      var tsrc=image.getAttribute('tsrc');
      image.src=tsrc;
    }
    return {
      restrict: "A",
      template: html,
      replace: true,
      scope: true,
      controller: function (pickBrowserPic,pickPic,$scope, $element, $attrs, $transclude, $ionicPopup, $rootScope, $ionicActionSheet) {
        data = $scope.data || {};
        var addImageDom = document.getElementById('addImage');
        var addImage = angular.element(addImageDom);
        $scope.removeFn = function (image) {
          var src = image.tsrc||image.src;
          var confirmPopup = $ionicPopup.confirm({
            title: '确认删除这张图片吗？',
            template: '<p class="center">你将删除这张图片!</p><br><p class="center ng-hide"><img src="' + src + '"  style="width:64px"></p>'
          });
          confirmPopup.then(function (res) {
            if (res) {
              var name = image.name;
              var index = -1;
              $scope.data.images.map(function (noe, i) {
                if (noe.name == name) {
                  index = i;
                }
              });
              if (index != -1) {
                $scope.data.images.splice(index, 1);
              }
            }
            $scope.$apply();
          });
        };

        $scope.selectPicture = function(){
          $scope.data.images=$scope.data.images||[];

          if(!$rootScope.devicePlatform||($rootScope.devicePlatform&&$rootScope.devicePlatform=="browser")){
            //pickBrowserPic.getBrowserPic($scope.data.images);
            //$("#addBrowserImage").click();
          }else{

            pickPic.getPic($scope.data.images);
          }

        }
      }
    }
  })
  .directive('attachInfo', function () {
    return {
      restrict: "A",
      templateUrl: './templates/public/attachInfo-directive.html',
      replace: false,
      scope: true,
      controller: function ($scope) {
        $scope.noeType = {
          "icon": "ion-android-happy",
          "text": ""
        };
        $scope.removeFn = function (type) {
          if (type && type.remove) {
            type.removeDom = true;
          }
        };
        $scope.addFn = function () {
          $scope.lists.push({
            "icon": "ion-android-happy",
            "text": $scope.noeType.text,
            "remove": true,
            "checkBox": true
          });
          $scope.noeType.text = '';
          $scope.addItemShow = false;
        };
      }
    }
  })

