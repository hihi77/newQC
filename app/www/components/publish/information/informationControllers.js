angular.module('starter.publishInformationControllers', [])//information
  .controller('information', function ($window,$state, $scope, $rootScope, publishInformationServices,$location, system, $stateParams, $ionicPopup) {
    $scope.scope.source = $stateParams.source;
    $scope.scope.id = $stateParams.id;
    publishInformationServices.$stateParams=$stateParams;
    publishInformationServices.indexUrl= '#'+$location.$$url;
    $scope.toolClick = function () {
      var promise = publishInformationServices.saveInfo(system.newObject($rootScope.informationEphemeralData), $stateParams.source, $stateParams.id);
      if (promise) {
        promise.success(function () {
          $ionicPopup.show({
            title: "信息保存成功",
            buttons: [
              {
                text: "确认",
                type: "button-positive"
              }
            ]
          });
        }).error(function () {
          $ionicPopup.show({
            title: "信息保存失败",
            buttons: [
              {
                text: "确认",
                type: "button-positive"
              }
            ]
          });
        });
      } else {
        $ionicPopup.show({
          title: "信息保存未保存",
          buttons: [
            {
              text: "确认",
              type: "button-positive"
            }
          ]
        });
      }
    }
  })
  .controller('informationSelectType', function ($scope, $rootScope, $ionicHistory, publishInformationServices, system) {
    $scope.title = '选择类型';
    $scope.selectTypeText = '选择类型';
    $scope.selectData = [];
    $scope.elementShow = {};
    $scope.maxSurplus=1;
    var name = '选择类型';
    $scope.selectData=$scope.scope.informationEphemeralData[name]||[];
    var promise = publishInformationServices.informationSelectType.getData();
    promise.success(function (data) {
      $scope.typeDatas = data;
    });
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $scope.scope.informationEphemeralData[name] = $scope.selectData;
        $rootScope.backClick();
      }
    },$scope);
  })


  .controller('informationPreview', function ($ionicHistory,$window,$state, $scope, $rootScope, publishInformationServices, system, $ionicPopup) {
    var $stateParams = publishInformationServices.$stateParams;

    $scope.publishEvent = function () {
      if(($scope.scope.informationEphemeralData['信息详情'].images||[]).length>6){
        alert('图片数量最多为6张!')
      }
      else{
      if ($scope.disabled)return;
      $scope.disabled = true;
      var template = '';
      var showLayer = false;
      if (!$scope.scope.informationEphemeralData['选择类型']) {
        template += "没有选择信息类型！<br>";
        showLayer = true;
      }
      if (!$scope.scope.informationEphemeralData['信息标题']) {
        template += "没有填写信息标题！<br>";
        showLayer = true;
      }
      if (!$scope.scope.informationEphemeralData['信息详情'].text) {
        template += "没有填写信息详情！<br>";
        showLayer = true;
      }

      if (showLayer) {
        $ionicPopup.show({
          title: "页面信息缺省",
          template: template,
          buttons: [
            {
              text: "确认",
              type: "button-positive"
            }
          ]
        });
        $scope.disabled = false;
        return;
      }
        $scope.scope.informationEphemeralData.createTime = new Date();
      var promise = publishInformationServices.publishInfo(system.newObject($scope.scope.informationEphemeralData), $stateParams.source, $stateParams.id);
      if (promise) {
        if (promise) {
          promise.success(function () {
            $ionicPopup.show({
              title: "信息发布成功",
              buttons: [
                {
                  text: "确认",
                  type: "button-positive"
                }
              ]
            });
            $scope.disabled = false;
            $scope.scope.submitInformation = false;
            system.delObj($scope.scope.informationEphemeralData);
            $rootScope.go('tab.discover-index','discover');
            //$state.go('tab.'+$rootScope.pageMarking+'-saveInfoOk', {title: "保存成功",url:publishInformationServices.indexUrl});
          }).error(function () {
            $ionicPopup.show({
              title: "信息发布失败",
              buttons: [
                {
                  text: "确认",
                  type: "button-positive"
                }
              ]
            });
          });
        } else {
          $ionicPopup.show({
            title: "信息发布失败",
            buttons: [
              {
                text: "确认",
                type: "button-positive"
              }
            ]
          });
        }
      }
      //console.log($scope.scope.informationEphemeralData);
    }
  }
  })
