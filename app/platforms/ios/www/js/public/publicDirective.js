angular.module('starter.publicDirective', [])
.directive('textImages', function() {
  var html = '\
      <div >\
        <div class="button-bar">\
          <a class="button">First</a>\
          <button class="button" ng-click="pickPicture()">\
            <i class="icon ion-images"></i>\
          </button>\
        </div>\
        <div class="row">\
          <textarea cols="100%" rows="10"></textarea>\
        </div>\
        <div class="row">\
          <div class="noeImage" ng-repeat="image in dataImages" ng-click="removeFn(image)" name="{{image.name}}">\
            <p class="imageBox"><img src="{{image.src}}"></p>\
            <i class="ion-android-close close"></i>\
            </div>\
          </div>\
      </div>\
    ';
  return {
    restrict: 'E',
    scope: {},
    //replace: true,
    link: function(scope, elem, attrs) {
/*      scope.pickPicture = function(){
        alert('hello')
      }*/
    },
    controller:function(pickPic,$scope, $element, $attrs, $transclude, $ionicPopup, $rootScope, $ionicActionSheet){
      $scope.dataImages=[];
      $scope.pickPicture =function(){
        pickPic.getPic(function(imageURL){
          if(imageURL){
            $scope.$apply(function(){
              $scope.dataImages = $rootScope.Takeimages;
            })
          }
        });
      }
    },
    template: html
  };
})

  .directive('fortest', function () {
    var data;
    var htmlNoeImage = '<div class="noeImage" ng-repeat="image in data.images" ng-click="removeFn(image)" name="{{image.name}}">' +
      '<p class="imageBox"><img src="{{image.src}}"></p>' +
      '<i class="ion-android-close close"></i>' +
      '</div>';
    var html = '<div class="upload-photo-control">' +
      htmlNoeImage +
      '<div class="noeImage">' +
      '<p class="imageBox" ><img src="./img/othere/addIcon.jpg"></p>' +
      '<input type="file" class="init" id="addImage">' +
      '</div>' +
      '</div>';

    function previewImage(file, callBack) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (evt) {
        callBack(evt.target.result);
      }
    }

    return {
      restrict: "AE",
      template: html,
      replace: true,
      scope: true,
      controller: function ($scope, $element, $attrs, $transclude, $ionicPopup, $rootScope, $ionicActionSheet) {
        data = $scope.data || {};
        data.maxlength=data.maxlength||3;
        data.images = [];
        var addImageDom = document.getElementById('addImage');
        console.log(addImageDom)
        var addImage = angular.element(addImageDom);
        $scope.removeFn = function (image) {
          var src = image.src;
          var confirmPopup = $ionicPopup.confirm({
            title: '确认删除这张图片吗？',
            template: '<p class="center">你将删除这张图片!</p><br><p class="center"><img src="' + src + '"  style="width:64px"></p>'
          });
          confirmPopup.then(function (res) {
            if (res) {
              var name = image.name;
              var index = -1;
              data.images.map(function (noe, i) {
                if (noe.name == name) {
                  index = i;
                }
              });
              if (index != -1) {
                data.images.splice(index, 1);
              }
            }
          });
        };
        $scope.addImageFn = function (file, $element) {
          var noe = {
            name: file.name,
            //file:file
          };
          previewImage(file, function (src) {

            noe.src = src;
            $scope.$apply(function () {
              if(data.images.length>=data.maxlength){
                $ionicPopup.alert({
                  "title":"已经超过图片上传张数",
                  okText:"确认"
                })
                return false;
              }
              data.images.push(noe);
            });
            console.log('更新了')
          });
        }
        $scope.change = function () {
          var that = this;
          if (!(that.files && that.files.length)) {
            return false;
          }
          var file = that.files[0];
          if (!(/(\.jpg$|\.png$|\.jpeg|\.gif$)/ig).test(file.name)) {
            $ionicPopup.alert({
              title: '您选择的不是图片！',
              template: '<p class="center">请重新选择！</p>'
            });
            addImage.val('');
            return false;
          }
          that.files = [];
          addImage.val('');
          $scope.addImageFn(file);
        };
        addImage.on('change', $scope.change);
        $scope.success=function(imageData){
          var noe = {
            name: file.name,
            //file:file
            src:imageData
          };
          $scope.$apply(function () {
            alert('成功');
            alert(imageData)
            data.images.push(noe);
          });
        }
        $scope.error=function(){
          alert('选择失败!')
        }

        if(!device.platform||(device.platform&&device.platform=="browser")){
          $scope.selectImage = pickImageinMobile;

        }else{

          $scope.selectImage = pickImageinBrowser;
        }

        var pickImageinBrowser = function (){

        };

        var pickImageinMobile =function () {
          $ionicActionSheet.show({
            buttons: [
              {text: '拍照'},
              {text: '图库'},
            ],
            titleText: '请选择您的照片',
            cancelText: '取消',
            buttonClicked: function (index) {
              console.log(index)
              switch (index) {
                case 0:
                  //拍照
                  navigator.camera.getPicture($scope.success,$scope.error, {
                    quality:15,
                    destinationType:0,
                    sourceType:1,
                    allowEdit:true,
                    encodingType:0,
                    mediaType:0,
                    saveToPhotoAlbum:true
                  });
                  break;
                case 1:
                  //图库
//拍照
                  navigator.camera.getPicture($scope.success,$scope.error,{
                    quality:15,
                    destinationType:0,
                    sourceType:0,
                    allowEdit:true,
                    encodingType:0,
                    mediaType:0,
                    saveToPhotoAlbum:true
                  });
                  break;
              }
            }
          });
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

