angular.module('starter.publishInvestigateControllers', [])
  .controller('investigate', function ($ionicHistory,$scope, $rootScope, publishInvestigateServices, $ionicModal, $state, $stateParams, system, $ionicPopup, $location) {
    $scope.PHR = publishInvestigateServices.deathData['问卷份数'];
    $scope.sub=0;
    $scope.authoritys = publishInvestigateServices.deathData['查看权限'];
    $rootScope.pageMarking = $stateParams.source;
    function initScope() {
      if (!$rootScope.investigateEphemeralData) {
        $rootScope.investigateEphemeralData = {};
        $rootScope.investigateEphemeralData['问题'] = [];
        $rootScope.investigateEphemeralData['问卷描述'] = {
          "placeholder": "亲爱的朋友：您好！随着人们生活水平的提高，外出" +
          "旅游已经成为一种新的时尚和休闲方式。为了全面了" +
          "解人们旅游的方式、地点、经费等问题，我们组织了" +
          "这次调查活动。希望得到您的支持和帮助。本次调查" +
          "严格按照《统计法》的要求进行，不用填写姓名，所" +
          "有回答只用于统计分析，各种答案没有正确、错误之" +
          "分。请您在百忙之中抽出一点时间填写这份调查表。" +
          "您的回答将代表众多和您一样的朋友，并将对提高旅" +
          "游质量、服务水平提供帮助。我们将会对您的信息进" +
          "行必要保护！请在在题目后的括号里填写您的答案。" +
          "衷心感谢您的支持和协助！祝您生活愉快。"
        };
        $scope.data = $rootScope.investigateEphemeralData['问卷描述'];//上传图片
      } else {
        system.delObj($rootScope.investigateEphemeralData);
      }
    }

    function getInfo() {
      var promise = publishInvestigateServices.getInfo($stateParams);
      if (promise) {
        promise
          .success(function (data) {
            system.correspondingKey(publishInvestigateServices.infoTransform, data, true);
            $rootScope.investigateEphemeralData = JSON.parse(JSON.stringify(data instanceof Object ? data : {}));
            $scope.data = $rootScope.investigateEphemeralData['问卷描述'];
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
            initScope();
          });
      } else {
        initScope();
      }
    }
    if ($rootScope.pageMarking == 'user')getInfo();
    else {
      initScope();
    }
    $scope.source = $stateParams.source;
    $scope.id = $stateParams.id;
    $rootScope.pageMarking = $stateParams.source == 'circle' ? 'publish' : $stateParams.source;
    publishInvestigateServices.$stateParams = $stateParams;
    publishInvestigateServices.indexUrl = '#' + $location.$$url;
/*    system.bindNavTool({
      rightText:'保存',
      toolClick:toolClick = function () {
        var promise = publishInvestigateServices.saveInfo(system.newObject($rootScope.investigateEphemeralData), $stateParams.source, $stateParams.id);
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
    $scope.questionScope={};
    $scope.nowData={};
    var q =[];
    $ionicModal.fromTemplateUrl('./templates/publish/investigate-subject.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal=modal;
    })
    $scope.addQuestion=function(index){
      $scope.modal.show();
      subject(index);
    }
    //发布
    $scope.publishInfo = function () {
      var template = '';
      var showLayer = false;
      /*
       * 判断
       * */
      if (!$rootScope.investigateEphemeralData['选择类型']) {
        template += "你没有选择调查类型！<br>";
        showLayer = true;
      }
      if (!$rootScope.investigateEphemeralData['标题']) {
        template += "你没有输入标题！<br>";
        showLayer = true;
      }
      if (!$rootScope.investigateEphemeralData['截止日期']) {
        template += "你没有输入截止日期！<br>";
        showLayer = true;
      }
      if (!$rootScope.investigateEphemeralData['问卷份数']) {
        template += "你没有选择问卷份数！<br>";
        showLayer = true;
      }
      if (!$rootScope.investigateEphemeralData['问卷赏金']) {
        template += "你没有填写问卷赏金！<br>";
        showLayer = true;
      }
      if (!$rootScope.investigateEphemeralData['问题'].length) {
        template += "你没有填写任何问题！<br>";
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
      $rootScope.investigateEphemeralData.createTime=new Date();
      var promise = publishInvestigateServices.publishInfo(system.newObject($rootScope.investigateEphemeralData), $stateParams.source, $stateParams.id);
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
            system.delObj($rootScope.investigateEphemeralData);
            $rootScope.go('tab.discover-index','discover');
            /*$state.go('tab.' + $rootScope.pageMarking + '-saveInfoOk', {
              title: "保存成功",
              url: publishInvestigateServices.indexUrl
            });*/
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
      console.log($rootScope.investigateEphemeralData);
    }
    //检查问题是否符合要求
    $scope.ck = function () {
      if (!$scope.nowData.question) {
        $ionicPopup.alert({
          title: '你没有填写问题！',
          template: '请重新输入'
        });
        return false;
      }
      if ($scope.nowData.option.length < 2 && $scope.nowData.type != '问答') {
        $ionicPopup.alert({
          title: '你的选项小于两个！',
          template: '请重新输入'
        });
        return false;
      }
      return true;
    }
    $scope.nextQuestion = function () {
      if (!$scope.ck()) {
        return false;
      }
      if (q.indexOf($scope.nowData)==-1)q.push($scope.nowData);
      $scope.modal.hide();
    }
    //添加一个选项
    $scope.addOption = function () {
      if ($scope.questionScope.nowOptionText == '') {
/*        $ionicPopup.alert({
          title: '您没有输入任何内容！',
          template: '请重新输入'
        });*/
        $scope.questionScope.questionScope.nowOptionText = '';
        return false;
      }
      if ($scope.nowData.option.indexOf($scope.questionScope.nowOptionText || "") != -1) {
        $ionicPopup.alert({
          title: '已经有了此选项！',
          template: '请重新输入'
        });
        $scope.questionScope.nowOptionText = '';
        return false;
      }
      $scope.nowData.option.push($scope.questionScope.nowOptionText);
      $scope.questionScope.nowOptionText = '';
    }
    //移除一个选项
    $scope.removeOption = function (text) {
      var a = $scope.nowData.option;
      a.splice(a.indexOf(text), 1);
    }
    $scope.deleteQuestion=function(){
      if(q[$scope.sub])q.splice($scope.sub,1);
      $scope.modal.hide();
    }
    //添加问题
    function subject(index) {
      q = $rootScope.investigateEphemeralData['问题'];
      console.log($rootScope.investigateEphemeralData)
      $scope.sub = index || 0;
      $scope.nowData = q[$scope.sub];
      if (!$scope.nowData) {
        $scope.nowData = {
          "type": "单选",
          "question": "",
          "option": []
        };
      } else {
        $scope.seekOut = true;
      }
    }
  })
  .controller('investigateSelectType', function ($scope, $rootScope, publishInvestigateServices, system) {
    $scope.title = '选择调查类型';
    $scope.selectTypeText = '选择类型';
    $scope.maxSurplus = 1;
    var name = '选择类型';
    $scope.selectData = $rootScope.investigateEphemeralData[name] || [];
    var promise = publishInvestigateServices.investigateSelectType.getData();
    promise.success(function (data) {
      $scope.typeDatas = data;
    });
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        $rootScope.investigateEphemeralData[name] = $scope.selectData;
        $rootScope.backClick();
      }
    }, $scope);
  })
  .controller('investigateSubject', function ($scope, $rootScope, publishInvestigateServices, $stateParams, $ionicHistory, $state, $ionicPopup, system) {

  })
