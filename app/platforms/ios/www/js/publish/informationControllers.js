angular.module('starter.publishInformationControllers', [])//information
  .controller('information', function ($window,$state, $scope, $rootScope, publishInformationServices,$location, system, $stateParams, $ionicPopup) {
    function initData(){
      if(!$rootScope.informationEphemeralData){
        $rootScope.informationEphemeralData = {};
        $rootScope.informationEphemeralData.userInfo=window.userInfo;

        $scope.data = {};
        $rootScope.informationEphemeralData['信息详情'] = $scope.data;
      }else {
        system.delObj($rootScope.informationEphemeralData);
      }

    }
    function getInfo() {
      var promise = publishInformationServices.getInfo($stateParams);
      if (promise) {
        promise
          .success(function (data) {
            system.correspondingKey(publishInformationServices.infoTransform, data, true);
            $rootScope.informationEphemeralData = JSON.parse(JSON.stringify(data instanceof Object ? data : {}));
            $rootScope.informationEphemeralData.creator={
              nickname:window.userInfo.nickname,
              headUrl:window.userInfo.headUrl
            }
            $scope.data = $rootScope.informationEphemeralData['信息详情'];
          })
          .error(function (data) {
            $ionicPopup.show({
              title: "数据获取错误",
              buttons: [
                {
                  text: "确认",
                  type: "button-default",
                },
                {
                  text: "重新获取",
                  type: "button-positive",
                  onTap: getInfo
                }
              ]
            });
            initData();
          });
      } else {
        initData();
      }
    }

    $scope.source = $stateParams.source;
    $scope.id = $stateParams.id;
    //$scope.data = $rootScope.informationEphemeralData = publishInformationServices.template;
    $rootScope.pageMarking=$stateParams.source=='circle'?'publish':$stateParams.source;
    if($rootScope.pageMarking=='user')getInfo();
    publishInformationServices.$stateParams=$stateParams;
    publishInformationServices.indexUrl= '#'+$location.$$url;
    initData();
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
/*    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        var promise = publishInformationServices.saveInfo(system.newObject($rootScope.informationEphemeralData),$stateParams.source);
        if (promise) {
          promise.success(function () {
            $ionicPopup.show({
              title: "保存成功",
              buttons: [
                {
                  text: "确认",
                  type: "button-positive"
                }
              ]
            });
          }).error(function () {
            $ionicPopup.show({
              title: "保存失败",
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
    },$scope);*/

  })
  .controller('informationSelectType', function ($scope, $rootScope, $ionicHistory, publishInformationServices, system) {
    $scope.title = '选择类型';
    $scope.selectTypeText = '选择类型';
    $scope.selectData = [];
    $scope.elementShow = {};
    $scope.maxSurplus=1;
    var name = '选择类型';
    $scope.selectData=$rootScope.informationEphemeralData[name]||[];
    var promise = publishInformationServices.informationSelectType.getData();

    promise.success(function (data) {
      $scope.typeDatas = data;
    });
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.informationEphemeralData[name] = $scope.selectData;
        $rootScope.backClick();
      }
    },$scope);
  })
  .controller('informationPreview', function ($ionicHistory,$window,$state, $scope, $rootScope, publishInformationServices, system, $ionicPopup) {
    var $stateParams = publishInformationServices.$stateParams;

    $scope.publishEvent = function () {
      if(($rootScope.informationEphemeralData['信息详情'].images||[]).length>6){
        alert('图片数量最多为6张!')
      }
      else{
      if ($scope.disabled)return;
      $scope.disabled = true;
      var template = '';
      var showLayer = false;
      if (!$rootScope.informationEphemeralData['选择类型']) {
        template += "没有选择信息类型！<br>";
        showLayer = true;
      }
      if (!$rootScope.informationEphemeralData['信息标题']) {
        template += "没有填写信息标题！<br>";
        showLayer = true;
      }
      if (!$rootScope.informationEphemeralData['信息详情'].text) {
        template += "没有填写信息详情！<br>";
        showLayer = true;
      }
      /*      if (!$rootScope.informationEphemeralData['信息联系人']) {
       template += "没有填写信息联系人！<br>";
       showLayer = true;
       }
       if (!$rootScope.informationEphemeralData['联系方式']) {
       template += "没有填写联系方式！<br>";
       showLayer = true;
       }
       if (!$rootScope.informationEphemeralData['信息截止时间']) {
       template += "没有选择信息截止时间！<br>";
       showLayer = true;
       }*/
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
      $rootScope.informationEphemeralData.createTime = new Date();
      var promise = publishInformationServices.publishInfo(system.newObject($rootScope.informationEphemeralData), $stateParams.source, $stateParams.id);
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
            $rootScope.submitInformation = false;
            system.delObj($rootScope.informationEphemeralData);
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
      console.log($rootScope.informationEphemeralData);
    }
  }
  })
