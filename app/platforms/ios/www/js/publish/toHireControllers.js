var app = angular.module('starter.publishToHireControllers', []);
app
  .controller('toHire', function ($scope, $state, $location, $rootScope, publishToHireServices, $stateParams, system, $ionicPopup) {
   

    function initData() {
      if (!$rootScope.ephemeralData) {
        $rootScope.ephemeralData = {};
      } else {
        system.delObj($rootScope.ephemeralData);
      }
    }

    function getInfo() {
      $scope.source = $stateParams.source;
      $scope.id = $stateParams.id;
      var promise = publishToHireServices.getInfo($stateParams);
      if (promise) {
        promise
          .success(function (data) {
            system.correspondingKey(publishToHireServices.infoTransform, data, true);
            $rootScope.ephemeralData = JSON.parse(JSON.stringify(data instanceof Object ? data : {}));
            console.log($rootScope.ephemeralData)
            $rootScope.ephemeralData['选择日期'] = new Date($rootScope.ephemeralData['选择日期'])
          })
          .error(function (data) {
            $ionicPopup.show({
              title: "数据获取错误",
              buttons: [
                {
                  text: "确认",
                  type: "button-default",
                  onTap: function () {
                    initData();
                  }
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

    if ($rootScope.pageMarking == 'user') {
      getInfo();
    }
    $rootScope.ephemeralData = publishToHireServices.template;

    $scope.source = $stateParams.source;
    $scope.id = $stateParams.id;
    publishToHireServices.$stateParams = $stateParams;
    publishToHireServices.indexUrl = '#' + $location.$$url;
    console.log($stateParams);
    //$scope.data = $rootScope.informationEphemeralData = publishInformationServices.template;
    $rootScope.pageMarking = $stateParams.source == 'circle' ? 'publish' : $stateParams.source;
    $scope.toolClick = function () {
      var promise = publishToHireServices.saveInfo(system.newObject($rootScope.ephemeralData), $stateParams.source, $stateParams.id);
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
        var promise = publishToHireServices.saveInfo(system.newObject($rootScope.ephemeralData), $stateParams.source);
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
            title: "未保存",
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
    console.log($rootScope.ephemeralData, '测试')
  })
  .controller('jobDescription', function ($scope, $state, $rootScope, $stateParams, $ionicHistory, publishToHireServices, system) {
    console.log('jobDescription');
    var type = $stateParams.type;
    var a = {
      "describe": "岗位描述",
      "demand": "岗位要求"
    }
    $scope.textareaHeight = window.innerHeight - 153;
    $scope.text = $rootScope.ephemeralData[a[type]]||'';

    $scope.maxTextLength =$scope.text.length ;

    $scope.config = publishToHireServices.jobDescription.config[$stateParams.type];
    var textDom = document.getElementById('text');
    var textarea = angular.element(textDom);
    textDom.onkeydown = function (event) {
      var val = textarea.val();
      $scope.maxTextLength = val.length;
    };
    $scope.keydownEvent = function () {
    }
    var name = $scope.config.title;
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.ephemeralData[name] = textarea.val();
        $rootScope.backClick();
      }
    },$scope);

  })

  .controller('saveInfoOk', function ($state, $scope, $rootScope, $ionicHistory, $stateParams) {
    $scope.title = $stateParams.title;
    $scope.url = $stateParams.url;
    $rootScope.go('tab.discover-index','discover');
  })

  .controller('selectTmp', function ($stateParams, $scope, $rootScope, $state, $ionicHistory, publishToHireServices, system) {
    console.log('selectTmp');
    $scope.maxSurplus = 1;
    var type = $state.$current.name + '-' + $stateParams.type;
    var selectTmpServices = publishToHireServices.selectTmpServices;
    $scope.type = type;
    $scope.config = selectTmpServices.config[$stateParams.type];
    var name = $scope.config.title;
    window.$scope = $scope;
    //console.log($rootScope.ephemeralData[name])
    if ($rootScope.ephemeralData[name]) {
      //$scope.selectData = $rootScope.ephemeralData[name].split(',');
    } else {

    }
    $scope.selectData = $rootScope.ephemeralData[name] || [];
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.ephemeralData[name] = [];
        console.log($scope.selectData)
        $scope.selectData.map(function (noe, index) {
          $rootScope.ephemeralData[name].push(noe.city + '-' + noe.county);
        });
        $rootScope.backClick();
      }
    },$scope);
  })
  .controller('selectTrade', function ($state, $scope, $rootScope, publishToHireServices, $ionicHistory, system) {
    console.log('selectTrade');
    var type = $state.$current.name;
    var name = '行业';
    $scope.selectData = $rootScope.ephemeralData[name] || [];
    $scope.contentHeight = window.innerHeight - 156;
    $scope.type = type;
    var promise = publishToHireServices.selectTradeServices.getData();
    promise.then(function (result) {
      $scope.typeDatas = result.data;
    }, function (data) {
    });
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.ephemeralData[name] = $scope.selectData;
        $rootScope.backClick();
      }
    },$scope);
  })
  .controller('technicalAbility', function ($state, $scope, $rootScope, $ionicHistory) {
    console.log('technicalAbility');
    $rootScope.navRightButtonText = '保存';
    $scope.surplus = 0;
    $scope.selectData = [];
    $scope.technicalAbilitys = [];
    $scope.elementShow = {};
    for (var i = 0; i < 20; i++) {
      $scope.technicalAbilitys.push('战略组织' + i);
    }
    $scope.removeNoe = function (noe) {
      $scope.selectData.splice($scope.selectData.indexOf(noe), 1);
      $scope.elementShow[noe] = false;
      $scope.surplus--;
    }
    $scope.clickNoe = function (type) {
      if ($scope.surplus >= 5 && $scope.selectData.indexOf(type) == -1)return;
      $scope.elementShow[type] = !$scope.elementShow[type];
      if ($scope.elementShow[type]) {
        $scope.selectData.push(type);
      } else {
        $scope.removeNoe(type);

      }
      $scope.surplus = $scope.selectData.length;
    }
    $rootScope.navButtonEvent = function () {
      $rootScope.ephemeralData[type] = {
        text: $scope.selectData.toString()
      };
      $ionicHistory.goBack();
    };
  })
  .controller('yearlySalary', function ($state, $scope, $rootScope, $ionicHistory, publishToHireServices, system) {
    console.log('yearlySalary');
    $rootScope.navRightButtonText = '保存';
    var type = $state.$current.name;
    $scope.type = type;
    var name = '年薪';

    var promise = publishToHireServices.yearlySalary.getData();
    promise.then(function (result) {
      $scope.yearlySalarys = result.data;
      if ($rootScope.ephemeralData[name]) {
        $scope.noeIndex = $scope.yearlySalarys.indexOf($rootScope.ephemeralData[name]);
      }
    }, function () {
    });
    $scope.clickNoe = function (index) {
      $scope.noeIndex = index;
    }
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.ephemeralData[name] = $scope.yearlySalarys[$scope.noeIndex];
        $rootScope.backClick();
      }
    },$scope);

  })

  .controller('jobCharacteristics', function ($state, $scope, $rootScope, $ionicHistory, publishToHireServices, system) {
    console.log('jobCharacteristics');
    $rootScope.navRightButtonText = '保存';
    var type = $state.$current.name;
    var name = '岗位特点';
    $scope.maxSurplus=5;
    $scope.selectData = $rootScope.ephemeralData[name] || [];
    var promise = publishToHireServices.jobCharacteristics.getData();
    promise.then(function (result) {
      $scope.typeDatas = result.data;
    }, function () {
    });
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.ephemeralData[name] = $scope.selectData;
        $rootScope.backClick();
      }
    },$scope);
  })
  .controller('toHirePreview', function ($ionicHistory,$scope, $state, $rootScope, publishToHireServices, system, $ionicPopup) {
    var $stateParams = publishToHireServices.$stateParams;
    $rootScope.ephemeralData.postPublisher = window.userInfo;
    //$rootScope.ephemeralData['岗位特点']=$rootScope.ephemeralData['岗位特点'].split(',');
    $scope.publishEvent = function () {
      var template = '';
      var showLayer = false;
      if (!$rootScope.ephemeralData['公司名称']) {
        template += "公司名称未输入<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['地区']) {
        template += "地区未选择<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['职位']) {
        template += "职位未填写<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['行业']) {
        template += "行业未选择<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['职能']) {
        template += "职能未选择<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['年薪']) {
        template += "年薪未选择<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['岗位描述']) {
        template += "岗位描述无内容<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['岗位要求']) {
        template += "岗位要求无内容<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['岗位特点']) {

        template += "岗位特点未选择<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['岗位性质']) {
        template += "岗位性质无内容<br>";
        showLayer = true;
      }
      function isEmail(str) {
        var reg = /^([a-zA-Z0-9_\.\-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(str);
      }

/*      if (!isEmail($rootScope.ephemeralData['公司邮箱'])) {
        template += "公司邮箱格式错误<br>";
        showLayer = true;
      }*/
      if (!($rootScope.ephemeralData['公司地址'])) {
        template += "公司地址未输入<br>";
        showLayer = true;
      }
      if (isNaN(+$rootScope.ephemeralData['推荐奖励'])) {
        template += "推荐奖励未填写<br>";
        showLayer = true;
      }
      if (isNaN(+$rootScope.ephemeralData['推荐成功奖励'])) {
        template += "推荐成功奖励未填写<br>";
        showLayer = true;
      }
      if (!$rootScope.ephemeralData['选择日期']) {
        template += "日期未选择<br>";
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
        return;
      }
      $rootScope.ephemeralData.createTime=new Date();
      var promise = publishToHireServices.publishInfo(system.newObject($rootScope.ephemeralData), $stateParams.source, $stateParams.id);
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
            $rootScope.submitInformation = false;
            system.delObj($rootScope.ephemeralData);
            /*$state.go('tab.' + $rootScope.pageMarking + '-saveInfoOk', {
              title: "保存成功",
              url: publishToHireServices.indexUrl
            });*/
            $rootScope.go('tab.discover-index','discover');
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
      console.log($rootScope.ephemeralData);
    }
    $scope.postPublisher = window.userInfo;
  })

