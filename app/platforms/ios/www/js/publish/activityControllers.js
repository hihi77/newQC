angular.module('starter.publishActivityControllers',[])
  .controller('activity', function ($ionicModal,mapGps,$state, $timeout, $scope, $rootScope, $stateParams, publishActivityServices,$location, system, $ionicPopup) {
    $rootScope.submitInformation=true;
    $scope.htmlVariable ={};

    $scope.map = {};
    $scope.map.address="";
    $scope.location= function ()
    {
      //alert();
      iniModal('templates/modal/mapModal.html');
      //mapGps.getgps();
      $scope.mapIni()
      //mapGps.map($scope);
    }

    $scope.mapIni = function ()
    {
      mapGps.map($scope);
    };



/*    function initScope() {
      if(!$rootScope.activityEphemeralData){
        $rootScope.activityEphemeralData = {};
        $scope.data = {};
        $rootScope.activityEphemeralData['活动详情'] = $scope.data;
      }else {
        system.delObj($rootScope.activityEphemeralData);
      }
    }*/


    $scope.closeModal = function()
    {
      $rootScope.activityEphemeralData['线下活动地址']=$scope.map.address;
      $scope.modal.remove();
    };


    function iniModal(url)
    {
      $ionicModal.fromTemplateUrl(url, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();

      });
    }


    function initScope() {
      if(!$rootScope.activityEphemeralData){
        $rootScope.activityEphemeralData = {};
        $scope.data = {};
        $rootScope.activityEphemeralData['活动详情'] = $scope.data;
      }else {
        system.delObj($rootScope.activityEphemeralData);
      }
    }
    function getInfo() {
      $scope.source = $stateParams.source;
      $scope.id = $stateParams.id;
      var promise = publishActivityServices.getInfo($stateParams);
      if (promise) {
        promise
          .success(function (data) {
            system.correspondingKey(publishActivityServices.infoTransform,data,true);
            $rootScope.activityEphemeralData = JSON.parse(JSON.stringify(data instanceof Object ? data : {}));
            $scope.data = $rootScope.activityEphemeralData['活动详情'];
            $scope.data.images = $rootScope.activityEphemeralData.images;

            if(!$scope.data.images){
              $scope.data.images=$rootScope.activityEphemeralData['活动详情'].images;
            }
          })
          .error(function (data) {
            $ionicPopup.show({
              title: "草稿数据获取错误",
              buttons: [
                {
                  text: "确认",
                  type: "button-default",
                  onTap: function () {
                  }
                },
                {
                  text: "重新获取",
                  type: "button-positive",
                  onTap: getInfo
                }
              ]
            });
            initScope();
          });
      } else {
        initScope();
      }
    }

    if($rootScope.pageMarking=='user')getInfo();
    $scope.data = $rootScope.activityEphemeralData = publishActivityServices.template;
    //$rootScope.pageMarking=$stateParams.source;
    //initScope();
    publishActivityServices.$stateParams=$stateParams;
    publishActivityServices.indexUrl='#'+$location.$$url;

    var promise = publishActivityServices.activityKind.getActivityKind();
    if (promise) {
      promise.success(function (data) {
        $scope.activityKind = data;
        $scope.nowSelectData = $scope.activityKind[0];
      });
    } else {
      $scope.activityKind = ['内部', '公开'];
      $scope.nowSelectData = $scope.activityKind[0];
    }

    $scope.source = $stateParams.source;
    $scope.id = $stateParams.id;
    //$scope.data = $rootScope.informationEphemeralData = publishInformationServices.template;
    $rootScope.pageMarking=$stateParams.source=='circle'?'publish':$stateParams.source;
    $scope.toolClick = function () {
      var promise = publishActivityServices.saveInfo(system.newObject($rootScope.activityEphemeralData), $stateParams.source, $stateParams.id);
      window.a = $rootScope.activityEphemeralData;
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
    /*system.bindNavTool({
      rightText:"保存",
      toolClick:function () {
        var promise=publishActivityServices.saveInfo(system.newObject($rootScope.activityEphemeralData),$stateParams.source,$stateParams.id);
        if(promise) {
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
        }else{
          $ionicPopup.show({
            title:"未保存",
            buttons:[
              {
                text:"确认",
                type:"button-positive"
              }
            ]
          });
        }
      }
    },$scope);*/
  })
  .controller('activitySelectType', function ($scope, $rootScope, $ionicHistory, publishActivityServices, system) {
    $scope.title = '选择活动类型';
    $scope.selectTypeText = '选择类型';
    var name = '选择类型';
      if($rootScope.pageMarking=="discover"){
          $scope.maxSurplus = 3;
      }else{
          $scope.maxSurplus = 1;
      }
    $rootScope.activityEphemeralData = $rootScope.activityEphemeralData?$rootScope.activityEphemeralData:{};
    $scope.selectData = $rootScope.activityEphemeralData[name]?$rootScope.activityEphemeralData[name]:[];
    $scope.elementShow = {};
    var promise = publishActivityServices.activitySelectType.getData();
    promise.success(function (data) {
      $scope.typeDatas = data;
    });
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.activityEphemeralData[name] = $scope.selectData;
        $rootScope.backClick();
      }
    },$scope);
  })
  .controller('activityAdditionalRegistration', function ($scope, $rootScope, system) {
    $scope.title = '报名附加信息';
    $scope.heardTitle = '设置报名附加信息';
    if ($rootScope.activityEphemeralData['报名附加信息']&&$rootScope.activityEphemeralData['报名附加信息'].length) {
      $scope.lists = $rootScope.activityEphemeralData['报名附加信息'];
    } else {
      $scope.lists = [
        {
          "icon": 'ion-android-person',
          "text": '姓名',
          "checkBox":true
        },
        {
          "icon": "ion-android-phone-portrait",
          "text": "手机",
          "checkBox":true
        },
        {
          "icon": "ion-android-happy",
          "text": "公司"
        },
        {
          "icon": "ion-android-happy",
          "text": "邮箱"
        }
      ];

    }
    var name = '报名附加信息';
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.activityEphemeralData[name] = $scope.lists;
        $rootScope.backClick();
      }
    },$scope);
  })


    .controller('activitySelectTmp', function ($stateParams, $scope, $rootScope, $state, $ionicHistory, publishToHireServices, system) {
      console.log('selectTmp');
      var type = $state.$current.name + '-' + $stateParams.type;
      console.log(type)
      var selectTmpServices = publishToHireServices.selectTmpServices;
      $scope.type = type;
      $scope.config = selectTmpServices.config[$stateParams.type];
      var name = $scope.config.title;
        $scope.maxSurplus = 1;
      window.$scope = $scope;
      console.log($rootScope.activityEphemeralData[name])
      if ($rootScope.activityEphemeralData[name]) {
        //$scope.selectData = $rootScope.ephemeralData[name].split(',');
      } else {

      }
      $scope.selectData = $rootScope.activityEphemeralData[name] || [];
      system.bindNavTool({
        rightText: "保存",
        toolClick: function () {
          $rootScope.activityEphemeralData[name] = [];
          console.log($scope.selectData)
          $scope.selectData.map(function (noe, index) {
            $rootScope.activityEphemeralData[name].push(noe.city + '-' + noe.county);
          });
          $rootScope.backClick();
        }
      },$scope);
    })


  .controller('activityTeachingSatisfaction', function ($scope, $rootScope, system) {
    $scope.title = '授课满意度评价';
    $scope.heardTitle = '授课老师满意度评价';
    if ($rootScope.activityEphemeralData['授课满意度']&&$rootScope.activityEphemeralData['授课满意度'].length) {
      $scope.lists = $rootScope.activityEphemeralData['授课满意度'];
    } else {
      $scope.lists = [
        {
          "icon": "ion-android-happy",
          "text": "理论底蕴"
        },
        {
          "icon": "ion-android-happy",
          "text": "专业能力"
        },
        {
          "icon": "ion-android-happy",
          "text": "实操能力"
        },
        {
          "icon": "ion-android-happy",
          "text": "表达能力"
        },
        {
          "icon": "ion-android-happy",
          "text": "授课效果"
        }
      ];
    }
    var name = '授课满意度';
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.activityEphemeralData[name] = $scope.lists;
        $rootScope.backClick();
        console.log($scope.lists);
      }
    },$scope);
  })
  .controller('activitySatisfaction', function ($scope, $rootScope, system) {
    $scope.title = '活动满意度评价';
    $scope.heardTitle = '本次活动满意度评价';
    if ($rootScope.activityEphemeralData['活动满意度评价']&&$rootScope.activityEphemeralData['活动满意度评价'].length) {
      $scope.lists = $rootScope.activityEphemeralData['活动满意度评价'];
    } else {
      $scope.lists = [
        {
          "icon": "ion-android-happy",
          "text": "时间安排"
        },
        {
          "icon": "ion-android-happy",
          "text": "地点安排"
        },
        {
          "icon": "ion-android-happy",
          "text": "主题安排"
        },
        {
          "icon": "ion-android-happy",
          "text": "活动内容"
        },
        {
          "icon": "ion-android-happy",
          "text": "活动组织"
        },
        {
          "icon": "ion-android-happy",
          "text": "活动效果"
        },
        {
          "icon": "ion-android-happy",
          "text": "总体评价"
        }
      ];
    }
    var name = '活动满意度评价';
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.activityEphemeralData[name] = $scope.lists;
        $rootScope.backClick();
      }
    },$scope);
  })

  .controller('activitySaveInfoOk', function ($scope) {

  })

  .controller('activityPreview',function($ionicHistory,$state, $timeout, $scope, $rootScope, $stateParams, publishActivityServices, system, $ionicPopup){
    console.log($rootScope.activityEphemeralData);
    $scope.publishEvent = function () {
      if($scope.disabled)return;
      $scope.disabled=true;
      //验证
      var template = '';
      var showLayer = false;
      if (!$rootScope.activityEphemeralData['选择类型']) {
        template += "活动类型未选择<br>";
        showLayer = true;
      }
      if (!$rootScope.activityEphemeralData['活动主题']) {
        template += "活动主题未填写！<br>";
        showLayer = true;
      }
     if (!($rootScope.activityEphemeralData['线下活动地址'] || ($rootScope.activityEphemeralData['线上活动']))) {
        template += "活动方式未选择！<br>";
        showLayer = true;
      }
      if (!$rootScope.activityEphemeralData['线上活动']&&!$rootScope.activityEphemeralData['线下活动地址']) {
        template += "线下活动地址填写！<br>";
        showLayer = true;
      }
      if (isNaN(+$rootScope.activityEphemeralData['活动人数上限'])) {
        template += "活动人数上限输入有误或未输入！<br>";
        showLayer = true;
      }
      if (isNaN(+$rootScope.activityEphemeralData['活动费用'])) {
        template += "活动费用输入有误或未输入！<br>";
        showLayer = true;
      }

      if (!$rootScope.activityEphemeralData['活动性质']) {
        template += "活动性质未选择！<br>";
        showLayer = true;
      }
      if (!($rootScope.activityEphemeralData['报名附加信息'] && $rootScope.activityEphemeralData['报名附加信息'].length > 0)) {
        template += "报名附加信息未选择！<br>";
        showLayer = true;
      }
/*      if (!($rootScope.activityEphemeralData['活动满意度评价'] && $rootScope.activityEphemeralData['活动满意度评价'].length > 0)) {
        template += "活动满意度评价未选择！<br>";
        showLayer = true;
      }
      if (!($rootScope.activityEphemeralData['授课满意度'] && $rootScope.activityEphemeralData['授课满意度'].length > 0)) {
        template += "授课满意度未选择！<br>";
        showLayer = true;
      }*/
      if (!$rootScope.activityEphemeralData['活动详情'].text) {
        template += "活动详情未填写！<br>";
        showLayer = true;
      }
      if (
        (+$rootScope.activityEphemeralData['活动开始时间']>+$rootScope.activityEphemeralData['活动结束时间'])

      ) {
        template += "活动开始时间大于结束时间！<br>";
        showLayer = true;
      }
      if(+$rootScope.activityEphemeralData['活动结束时间']<+$rootScope.activityEphemeralData['报名截止时间']){
        template += "活动结束时间小于报名截止时间！<br>";
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
        $scope.disabled=false;
        return;
      }
      $rootScope.activityEphemeralData.createTime=new Date();
      var promise = publishActivityServices.publishInfo(system.newObject($rootScope.activityEphemeralData), $stateParams.source, $stateParams.id);
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
            $scope.disabled=false;
            $rootScope.submitInformation=false;
            $rootScope.go('tab.discover-index','discover');
            //$ionicHistory.goBack(-3)
            //$state.go('tab.'+$rootScope.pageMarking+'-saveInfoOk', {title: "保存成功",url:publishActivityServices.indexUrl});
            system.delObj($rootScope.activityEphemeralData);
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
    }
  })
