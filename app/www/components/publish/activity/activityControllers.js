angular.module('starter.publishActivityControllers',[])
    .controller('activityAbstractCtrl',function($scope){
        $scope.scope = {
            source:"",
            id:"",
            activityEphemeralData:{}
        }
    })

    .controller('editActivity', function ($ionicModal,mapGps,$state, $timeout, $scope, $rootScope, $stateParams, publishActivityServices,$location, system, $ionicPopup) {
        $scope.scope.source = $stateParams.source;
        $scope.scope.id = $stateParams.id;
        $scope.scope.submitInformation=true;
        $scope.htmlVariable ={};
        $scope.map = {};
        $scope.map.address="";
        $scope.location= function ()
        {
            iniModal('templates/modal/mapModal.html');
            $scope.mapIni()
        }

        $scope.mapIni = function ()
        {
            mapGps.map($scope);
        };

        $scope.closeModal = function()
        {
            $scope.scope.activityEphemeralData['线下活动地址']=$scope.map.address;
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

        function getInfo() {
         var promise = publishActivityServices.getInfo($stateParams);
         if (promise) {
         promise
         .success(function (data) {
         system.correspondingKey(publishActivityServices.infoTransform,data,true);
         $scope.scope.activityEphemeralData = JSON.parse(JSON.stringify(data instanceof Object ? data : {}));
             $scope.scope.activityEphemeralData['活动开始时间'] = new Date($scope.scope.activityEphemeralData['活动开始时间'])
             $scope.scope.activityEphemeralData['活动结束时间'] = new Date($scope.scope.activityEphemeralData['活动结束时间'])
             $scope.scope.activityEphemeralData['报名截止时间'] = new Date($scope.scope.activityEphemeralData['报名截止时间'])
             $scope.data = $scope.scope.activityEphemeralData['活动详情'];
         $scope.data.images = $scope.scope.activityEphemeralData.images;

         if(!$scope.data.images){
         $scope.data.images=$scope.scope.activityEphemeralData['活动详情'].images;
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
         //initScope();
         });
         } else {
         //initScope();
         }
         }

        getInfo();


        $scope.data = $scope.scope.activityEphemeralData = publishActivityServices.template;
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
        $scope.toolClick = function () {
            var promise = publishActivityServices.saveInfo(system.newObject($scope.scope.activityEphemeralData), $stateParams.source, $stateParams.id);
            window.a = $scope.scope.activityEphemeralData;
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
                    title: "信息未保存",
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

  .controller('activity', function ($ionicModal,mapGps,$state, $timeout, $scope, $rootScope, $stateParams, publishActivityServices,$location, system, $ionicPopup) {
    $scope.scope.source = $stateParams.source;
      $scope.scope.id = $stateParams.id;
      $scope.scope.submitInformation=true;
    $scope.htmlVariable ={};
    $scope.map = {};
    $scope.map.address="";
    $scope.location= function ()
    {
      iniModal('templates/modal/mapModal.html');
      $scope.mapIni()
    }

    $scope.mapIni = function ()
    {
      mapGps.map($scope);
    };

    $scope.closeModal = function()
    {
      $scope.scope.activityEphemeralData['线下活动地址']=$scope.map.address;
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

    $scope.data = $scope.scope.activityEphemeralData = publishActivityServices.template;
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
    $scope.toolClick = function () {
      var promise = publishActivityServices.saveInfo(system.newObject($scope.scope.activityEphemeralData), $stateParams.source, $stateParams.id);
      window.a = $scope.scope.activityEphemeralData;
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


  .controller('activitySelectType', function ($scope, $rootScope, $ionicHistory, publishActivityServices, system) {
    $scope.title = '选择活动类型';
    $scope.selectTypeText = '选择类型';
    var name = '选择类型';
      if($scope.scope&&$scope.scope.source=="discover"){
          $scope.maxSurplus = 3;
      }else{
          $scope.maxSurplus = 1;
      }
    $scope.scope.activityEphemeralData = $scope.scope.activityEphemeralData?$scope.scope.activityEphemeralData:{};
    $scope.selectData = $scope.scope.activityEphemeralData[name]?$scope.scope.activityEphemeralData[name]:[];

    $scope.elementShow = {};
    var promise = publishActivityServices.activitySelectType.getData();
    promise.success(function (data) {
      $scope.typeDatas = data;
    });
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $scope.scope.activityEphemeralData[name] = $scope.selectData;
        $rootScope.backClick();
      }
    },$scope);
  })

  .controller('activityAdditionalRegistration', function ($scope, $rootScope, system) {
    $scope.title = '报名附加信息';
    $scope.heardTitle = '设置报名附加信息';
    if ($scope.scope.activityEphemeralData['报名附加信息']&&$scope.scope.activityEphemeralData['报名附加信息'].length) {
      $scope.lists = $scope.scope.activityEphemeralData['报名附加信息'];
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
        $scope.scope.activityEphemeralData[name] = $scope.lists;
        $rootScope.backClick();
      }
    },$scope);
  })


    .controller('activitySelectTemp', function ($stateParams, $scope, $rootScope, $state, $ionicHistory, publishToHireServices, system) {
      var type = $state.$current.name + '-' + $stateParams.type;
      var selectTmpServices = publishToHireServices.selectTmpServices;
      $scope.type = type;
      $scope.config = selectTmpServices.config[$stateParams.type];
      var name = $scope.config.title;
        //最大可选数目
      $scope.maxSurplus = 1;
      window.$scope = $scope;
      $scope.selectData = $scope.scope[name] || [];
      system.bindNavTool({
        rightText: "保存",
        toolClick: function () {
          $scope.scope.activityEphemeralData[name] = [];
          console.log($scope.selectData)
          $scope.selectData.map(function (noe, index) {
          $scope.scope.activityEphemeralData[name].push(noe.city + '-' + noe.county);
              console.log($scope.scope.activityEphemeralData[name])
          });
          $rootScope.backClick();
        }
      },$scope);
    })


  .controller('activityTeachingSatisfaction', function ($scope, $rootScope, system) {
    $scope.title = '授课满意度评价';
    $scope.heardTitle = '授课老师满意度评价';
    if ($scope.scope.activityEphemeralData['授课满意度']&&$$scope.scope.activityEphemeralData['授课满意度'].length) {
      $scope.lists = $scope.scope.activityEphemeralData['授课满意度'];
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
        $scope.scope.activityEphemeralData[name] = $scope.lists;
        $rootScope.backClick();
        console.log($scope.lists);
      }
    },$scope);
  })
  .controller('activitySatisfaction', function ($scope, $rootScope, system) {
    $scope.title = '活动满意度评价';
    $scope.heardTitle = '本次活动满意度评价';
    if ($scope.scope.activityEphemeralData['活动满意度评价']&&$scope.scope.activityEphemeralData['活动满意度评价'].length) {
      $scope.lists = $scope.scope.activityEphemeralData['活动满意度评价'];
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
          $scope.scope.activityEphemeralData[name] = $scope.lists;
        $rootScope.backClick();
      }
    },$scope);
  })

  .controller('activitySaveInfoOk', function ($scope) {

  })

  .controller('activityPreview',function($ionicHistory,$state, $timeout, $scope, $rootScope, $stateParams, publishActivityServices, system, $ionicPopup){
    $scope.publishEvent = function () {
      if($scope.disabled)return;
      $scope.disabled=true;
      //验证
      var template = '';
      var showLayer = false;
      if (!$scope.scope.activityEphemeralData['选择类型']) {
        template += "活动类型未选择<br>";
        showLayer = true;
      }
      if (!$scope.scope.activityEphemeralData['活动主题']) {
        template += "活动主题未填写！<br>";
        showLayer = true;
      }
     if (!($scope.scope.activityEphemeralData['线下活动地址'] || ($scope.scope.activityEphemeralData['线上活动']))) {
        template += "活动方式未选择！<br>";
        showLayer = true;
      }
      if (!$scope.scope.activityEphemeralData['线上活动']&&!$scope.scope.activityEphemeralData['线下活动地址']) {
        template += "线下活动地址填写！<br>";
        showLayer = true;
      }
      if (isNaN(+$scope.scope.activityEphemeralData['活动人数上限'])) {
        template += "活动人数上限输入有误或未输入！<br>";
        showLayer = true;
      }
      if (isNaN(+$scope.scope.activityEphemeralData['活动费用'])) {
        template += "活动费用输入有误或未输入！<br>";
        showLayer = true;
      }

      if (!$scope.scope.activityEphemeralData['活动性质']) {
        template += "活动性质未选择！<br>";
        showLayer = true;
      }
      if (!($scope.scope.activityEphemeralData['报名附加信息'] && $scope.scope.activityEphemeralData['报名附加信息'].length > 0)) {
        template += "报名附加信息未选择！<br>";
        showLayer = true;
      }
      if (!$scope.scope.activityEphemeralData['活动详情'].text) {
        template += "活动详情未填写！<br>";
        showLayer = true;
      }
      if (
        (+$scope.scope.activityEphemeralData['活动开始时间']>+$scope.scope.activityEphemeralData['活动结束时间'])

      ) {
        template += "活动开始时间大于结束时间！<br>";
        showLayer = true;
      }
      if(+$scope.scope.activityEphemeralData['活动结束时间']<+$scope.scope.activityEphemeralData['报名截止时间']){
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
      $scope.scope.activityEphemeralData.createTime=new Date();
      var promise = publishActivityServices.publishInfo(system.newObject($scope.scope.activityEphemeralData), $stateParams.source, $stateParams.id);
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
              $scope.scope.submitInformation=false;
            $rootScope.go('tab.discover-index','discover');
            //$ionicHistory.goBack(-3)
            //$state.go('tab.'+$rootScope.pageMarking+'-saveInfoOk', {title: "保存成功",url:publishActivityServices.indexUrl});
            system.delObj($scope.scope.activityEphemeralData);
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
