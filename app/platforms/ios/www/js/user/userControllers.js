angular.module('starter.userControllers', [])
  .controller('user', function ($interval,$rootScope, $scope, system, $rootScope, userServices, localStorageService, $state, $ionicPopup) {
    //Check wheather is a registrated user
    $rootScope.pageMarking = 'user';
    system.bindNavTool();
    $scope.myConcealToggle = function (config,value) {
      window.userInfo.config=config;
      userServices.updateUserConfig(config,value);
    }
    $scope.sysSettingToggle = function (config) {
      window.userInfo.sysSetting=config;
      userServices.updateUserInfo('sysSetting',config);
    }


    $scope.$on('$ionicView.beforeEnter',function(){
      var promise = userServices.getUserProInfo();
      if(promise){
      promise.then(function (result) {
        console.log(result.data)
        $scope.userInfo = result.data;

        if (!$scope.userInfo.config||($scope.userInfo.config["扩展信息可见"])==undefined) {

          $scope.userInfo.config = {
            "手机号码可见": false,
            "基本信息可见": true,
            "扩展信息可见": false
          };
        }
        window.userInfo=window.userInfo||{};
        window.userInfo.config=$scope.userInfo.config;
        $scope.phone=window.userInfo.phone;
        //$scope.phone=11
      });}
    })

    $scope.doLogOut = function () {
      localStorageService.clear('userId');
      localStorageService.clear('userInfo');
      window.userInfo = {};
      window.userId = "";
      $rootScope.messageBadge = 0;
      if(sysTimer){
        $interval.cancel(sysTimer);
      }
      $state.go('login');
    };
  })
  .controller('userInfo', function ($rootScope, $scope, userServices, system, $ionicPopup, pickPic) {
    //用户信息
    $scope.uploadHeadPhoto = function () {
      pickPic.getPic([],function (image) {
        if (image) {
          pickPic.upLoad([image],function(image){
            $scope.userInfo.headUrl = image.tsrc;
            userServices.updateFunction('headUrl', image.tsrc);
          });
        }
      });
      //
    }

    system.bindNavTool();
    $scope.yerds = [];
    for (var i = 1960; i < (new Date()).getFullYear(); i++) {
      $scope.yerds.push(i);
    }
    var promise = userServices.getUserBasicInfo(window.userId);
    promise.then(function (result) {
      window.userInfo_ = result.data;
      //进行一次拷贝
      $scope.userInfo = JSON.parse(JSON.stringify(window.userInfo_));
    });
    $scope.$watch('userInfo',function(){
      if(!$scope.userInfo)return;
      var model = ['heardPhotoUrl', 'name', 'nickname', 'sex', 'sex', 'area', 'area', 'phone', 'email', 'currentCompany', 'currentTrade', 'currentFunction', 'goodSkill', 'hobbiesAndInterests', 'workExperience', 'projectExperience', 'educationalBackground', 'linguisticCapacit', 'selfAssessment', 'extraMessage'];
      var all = 0;
      for (var i in model) {
        if ($scope.userInfo[model[i]]) {
          all++;
        }
      }
      $scope.userInfo.complete = (all / model.length * 100).toFixed(0);
    })
    userServices.updateFunction = function (key, value) {
      console.log(key, value)
      var promise = userServices.updateUserInfo(key, value);
      if (promise) {
        promise.success(function () {
          //$ionicPopup.show({
          //  title: '信息更新成功!', // String. 弹窗的标题。
          //  buttons: [
          //    {
          //      text: '确认',
          //      onTap: function (e) {
          //
          //      }
          //    }
          //  ]
          //});
        }).error(function () {
          $ionicPopup.show({
            title: '信息更新失败!', // String. 弹窗的标题。
            buttons: [
              {
                text: '再次尝试',
                type: 'button-positive',
                onTap: function (e) {
                  userServices.updateFunction(key, value);
                }
              },
              {
                text: '确认',
                onTap: function (e) {

                }
              }
            ]
          });
        });
      } else {
        $ionicPopup.show({
          title: '信息更新失败!', // String. 弹窗的标题。
          buttons: [
            {
              text: '再次尝试',
              type: 'button-positive',
              onTap: function (e) {
                userServices.updateFunction(key, value);
              }
            },
            {
              text: '确认',
              onTap: function (e) {

              }
            }
          ]
        });
      }
    };
    $scope.update = userServices.updateFunction;
    userServices.dataExchange = $scope;//数据交互
  })
  .controller('userSelectArea', function ($scope, publishToHireServices, userServices, system, $rootScope) {
    //用户-选择地区
    $scope.selectData = [];
    $scope.config = publishToHireServices.selectTmpServices.config['area'];
    $scope.selectData=[userServices.dataExchange.userInfo.area]||[];
    $scope.maxSurplus = 1;
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          userServices.dataExchange.userInfo.area = $scope.selectData[0].city + " - " + $scope.selectData[0].county;
          userServices.updateFunction('area', userServices.dataExchange.userInfo.area);
          $rootScope.backClick();
        }
      }
    ,$scope);

  })
  .controller('userTradeSelectType', function ($scope, system, userServices, $rootScope) {
    //当前行业
    $scope.title = "当前行业";
    $scope.selectTypeText = "选择行业";
    $scope.selectData = [];
    $scope.typeDatas = [];
    var promise = userServices.getTrade();
    promise.then(function (result) {
      $scope.typeDatas = result.data;
    })
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          userServices.dataExchange.userInfo.currentTrade = $scope.selectData.join(',');
          userServices.updateFunction('currentTrade', userServices.dataExchange.userInfo.currentTrade);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })
  .controller('userOccupationSelectType', function ($scope, system, userServices, $rootScope) {
    //当前职能
    $scope.title = "当前职能";
    $scope.selectTypeText = "选择职能";
    $scope.selectData = [];
    $scope.typeDatas = [];
    var promise = userServices.getOccupation();
    promise.then(function (result) {
      $scope.typeDatas = result.data;
    })
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          userServices.dataExchange.userInfo.currentFunction = $scope.selectData.join(',');
          userServices.updateFunction('currentFunction', userServices.dataExchange.userInfo.currentFunction);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })
  .controller('userBeGoodAtSelectType', function ($scope, system, userServices, $rootScope) {
    //擅长技能 goodSkill
    $scope.title = "擅长技能";
    $scope.selectTypeText = "选择技能";
    $scope.selectData = userServices.dataExchange.userInfo.goodSkill||[];
    $scope.typeDatas = [];
    $scope.maxSurplus = 3;
    var promise = userServices.getBeGoodAt();
    promise.then(function (result) {
      $scope.typeDatas = result.data;
    })
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          userServices.dataExchange.userInfo.goodSkill = $scope.selectData;
          userServices.updateFunction('goodSkill', userServices.dataExchange.userInfo.goodSkill);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })
  .controller('userInterestSelectType', function ($scope, system, userServices, $rootScope) {
    //兴趣爱好
    $scope.title = "兴趣爱好";
    $scope.selectTypeText = "选择兴趣";
    $scope.selectData = userServices.dataExchange.userInfo.hobbiesAndInterests||[];
    $scope.typeDatas = [];
    $scope.maxSurplus = 3;
    var promise = userServices.getInterest();
    promise.then(function (result) {
      $scope.typeDatas = result.data;
    })
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          userServices.dataExchange.userInfo.hobbiesAndInterests = $scope.selectData;
          userServices.updateFunction('hobbiesAndInterests', userServices.dataExchange.userInfo.hobbiesAndInterests);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })
  .controller('userLanguageSelectType', function ($scope, system, userServices, $rootScope) {
    //语言能力
    $scope.title = "语言能力";
    $scope.selectTypeText = "选择语言";
    $scope.selectData = userServices.dataExchange.userInfo.linguisticCapacit instanceof Array ? userServices.dataExchange.userInfo.linguisticCapacit : [];
    $scope.typeDatas = [];
    $scope.maxSurplus = 3;
    var promise = userServices.getLanguage();
    promise.then(function (result) {
      $scope.typeDatas = result.data;
    })
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          userServices.dataExchange.userInfo.linguisticCapacit = $scope.selectData;
          userServices.updateFunction('linguisticCapacit', userServices.dataExchange.userInfo.linguisticCapacit);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })
  .controller('userWorkExperience', function ($scope, userServices, $stateParams, system, $ionicPopup, $rootScope) {
    //工作经历
    var sub = $stateParams.sub;
    var data;
    if (sub == 'new') {
      //新创建
      data = {};
    } else {
      data = userServices.dataExchange.userInfo.workExperience[sub];
    }
    $scope.workExperience = JSON.parse(JSON.stringify(data));//拷贝一份
    $scope.workExperience.startTime = new Date($scope.workExperience.startTime);
    $scope.workExperience.endTime = new Date($scope.workExperience.endTime);
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          if (sub == 'new') {
            if (+$scope.workExperience.startTime > +$scope.workExperience.endTime) {
              $ionicPopup.alert({
                title: "开始时间大于结束时间",
                okText: "确认"
              })
              return false;
            }
            userServices.dataExchange.userInfo.workExperience.push($scope.workExperience);
          } else {
            userServices.dataExchange.userInfo.workExperience[sub] = $scope.workExperience;
          }
          userServices.updateUndergo('workExperience', $scope.workExperience, sub);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })

  .controller('userProjectExperience', function ($scope, userServices, $stateParams, system, $ionicPopup, $rootScope) {
    //项目经验
    var sub = $stateParams.sub;
    var data;
    if (sub == 'new') {
      //新创建
      data = {};
    } else {
      data = userServices.dataExchange.userInfo.projectExperience[sub];
    }
    $scope.projectExperience = JSON.parse(JSON.stringify(data));//拷贝一份
    $scope.projectExperience.startTime = new Date($scope.projectExperience.startTime);
    $scope.projectExperience.endTime = new Date($scope.projectExperience.endTime);
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          if (sub == 'new') {
            if (+$scope.projectExperience.startTime > +$scope.projectExperience.endTime) {
              $ionicPopup.alert({
                title: "开始时间大于结束时间",
                okText: "确认"
              })
              return false;
            }
            userServices.dataExchange.userInfo.projectExperience.push($scope.projectExperience);
          } else {
            userServices.dataExchange.userInfo.projectExperience[sub] = $scope.projectExperience;
          }
          userServices.updateUndergo('projectExperience', $scope.projectExperience, sub);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })

  .controller('userEducationalBackground', function ($scope, userServices, $ionicPopup, $stateParams, system, $rootScope) {
    //教育背景
    var sub = $stateParams.sub;
    var data;
    if (sub == 'new') {
      //新创建
      data = {};
    } else {
      data = userServices.dataExchange.userInfo.educationalBackground[sub];
    }
    $scope.educationalBackground = JSON.parse(JSON.stringify(data));//拷贝一份
    $scope.educationalBackground.startTime = new Date($scope.educationalBackground.startTime);
    $scope.educationalBackground.endTime = new Date($scope.educationalBackground.endTime);
    //获取学校大全
    userServices.getSchoolName().then(function (result) {
      $scope.schoolNames = result.data;
    })
    ////获取专业
    userServices.getSpecialty().then(function (result) {
      $scope.specialtys = result.data;
    })
    //固定学历
    $scope.educationalBackground.recordOfFormalSchoolings = [
      "中专",
      "大专",
      "本科",
      "硕士",
      "博士",
      "其他"
    ];
    system.bindNavTool(
      {
        "rightText": "保存",
        "toolClick": function () {
          if (sub == 'new') {
            if (+$scope.educationalBackground.startTime > +$scope.educationalBackground.endTime) {
              $ionicPopup.alert({
                title: "开始时间大于结束时间",
                okText: "确认"
              })
              return false;
            }
            userServices.dataExchange.userInfo.educationalBackground.push($scope.educationalBackground);
          } else {
            userServices.dataExchange.userInfo.educationalBackground[sub] = $scope.educationalBackground;
          }
          userServices.updateUndergo('educationalBackground', $scope.educationalBackground, sub);
          $rootScope.backClick();
        }
      }
    ,$scope);
  })

    .controller('userMobileVerify', function ($ionicHistory,$stateParams,$scope, userServices, system, $ionicPopup, $rootScope, $timeout, $ionicModal) {

        $scope.getPreviousTitle = function() {
          return $ionicHistory.backTitle();
        };

      $scope.goBack = function(){
        $ionicHistory.goBack();
      }
    })

  .controller('userAddressList', function ($stateParams,$scope, userServices, system, $ionicPopup, $rootScope, $timeout, $ionicModal) {
    //通讯录
    $scope.info = {};
    $scope.userFriends = {};
    $scope.allUsers = {};

    $ionicModal.fromTemplateUrl('./templates/user/user-hailFellow.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: false
    }).then(function (modal) {
      $scope.modal = modal;
    });


    $scope.searchMarking = 'nickname';
    $scope.searchData = [];
    userServices.getFriends().then(function (result) {
      $scope.userFriends = result.data;
      for (var noe in $scope.userFriends) {
        $scope.searchData = $scope.searchData.concat($scope.userFriends[noe]);
      }
    })


    $scope.searchCallBack=function(text) {
      userServices.getAllUser(text).then(function(result){
        $scope.userList=result.data;
      })
    }

    $scope.addFriend = function (data) {
      userServices.addFriends(window.userInfo,data).then(function(){
        $ionicPopup.alert({title:'请求已发出,等待对方确认',okText:"确认"});
      },function(){
        $ionicPopup.alert({title:'添加失败',okText:"确认"});
      });
    }


    if(userServices.getFriendsUrl instanceof  Function)userServices.getFriendsUrl().then(function(result){
      $scope.lists=result.data;
    })
    system.bindNavTool({
      navRightIonicClass: "icon ion-person-add",
      toolClick: function () {
        $scope.modal.show();
        userServices.getAllUser().then(function(result){
          $scope.userList=result.data;
        });
      }
    },$scope);
    var promise = userServices.getFriends();
    promise.then(function (result) {
      $scope.userFriends = result.data;
    }, function () {
    });
    $scope.deleteFriend = function (user) {
      var promise = userServices.deleteFriend(user.userId);
      promise.then(function () {
        $ionicPopup.alert({
          "title": "删除成功",
          okText: "确认"
        });
        var list=$scope.userFriends;
        list.splice(list.indexOf(user), 1);
      }, function () {
        $ionicPopup.alert({
          "title": "删除失败",
          okText: "确认"
        });
      });
    }
    $scope.defriend = function (user) {
      userServices.defriend(user.userId).then(function(res){
        $ionicPopup.alert({
          "title": "拉黑成功",
          okText: "确认"
        });
        var list=$scope.userFriends;
        list.splice(list.indexOf(user), 1);
      })
    }
  })
  .controller('userPartake', function ($scope, $rootScope, userServices, $ionicPopup) {
    //我参与的
    $rootScope.__partake = true;
    var services = userServices.partake;
    $scope.title = '我参与的';
    $scope.nowData = [];
    function alertShow() {
      $ionicPopup.show({
        title: '信息拉取失败',
        buttons: [
          {
            text: '重新拉取',
            type: 'button-positive',
            onTap: function (e) {
              $scope.nowTab.click();
            }
          },
          {
            text: '取消',
          },
        ]
      });
    }

    $scope.heardTabs = [
      {
        'type': '活动',
        tmpUrl: "./templates/discover/discover-cateforyTab-activity-tmp.html",
        click: function () {
          var promise = services.getActivity();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      },
      {
        'type': '才聘',
        tmpUrl: "./templates/discover/discover-cateforyTab-toHire-tmp.html",
        click: function () {
          var promise = services.getToHire();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      },
      {
        'type': '调查',
        tmpUrl: "./templates/discover/discover-cateforyTab-investigate-tmp.html",
        click: function () {
          var promise = services.getInvestigate();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      },
/*      {
        'type': '信息',
        tmpUrl: "./templates/discover/discover-cateforyTab-information-tmp.html",
        click: function () {
          var promise = services.getInformation();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      }*/
    ];
  })
  .controller('userPublish', function ($scope, $rootScope, userServices, $ionicPopup, $timeout) {
    //我参与的
    $rootScope.__partake = false;
    var services = userServices.publish;
    $scope.title = '我发布的';
    $scope.nowData = [];
    function alertShow() {
      $ionicPopup.show({
        title: '信息拉取失败',
        buttons: [
          {
            text: '重新拉取',
            onTap: function (e) {
              $scope.nowTab.click();
            }

          },
          {
            text: '取消',
            type: 'button-positive'
          },
        ]
      });
    }

    $scope.deleteItem = function (index, id) {
      userServices.deleteItem($scope.type, id).then(function () {
        $timeout(function () {
          $scope.nowData.splice(index, 1);
        }, 1000)
        $scope.nowData[index].class = 'rollOut';
      }, function () {
        $ionicPopup.alert({
          title: '删除失败',
          okText: '确认'
        })
      })
    }
    $scope.heardTabs = [
      {
        'type': '活动',
        tmpUrl: "./templates/discover/discover-cateforyTab-activity-tmp.html",
        click: function () {
          $scope.type = this.type;
          var promise = services.getActivity();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      },
      {
        'type': '才聘',
        tmpUrl: "./templates/discover/discover-cateforyTab-toHire-tmp.html",
        click: function () {
          $scope.type = this.type;
          var promise = services.getToHire();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      },
      {
        'type': '调查',
        tmpUrl: "./templates/discover/discover-cateforyTab-investigate-tmp.html",
        click: function () {
          $scope.type = this.type;
          var promise = services.getInvestigate();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      },
      {
        'type': '信息',
        tmpUrl: "./templates/discover/discover-cateforyTab-information-tmp.html",
        click: function () {
          $scope.type = this.type;
          var promise = services.getInformation();
          promise.then(function (result) {
            $scope.nowData = result.data;
          }, alertShow)
        }
      }
    ];
  })
  .controller('userCircle', function ($scope, userServices, $timeout) {
    $scope.circles = [];
    $scope.promise = userServices.getCircle("myCircle");
    $scope.title = '我的圈子';
    $scope.circleUrl = "#/tab/user-enterTheCircle";
    $scope.promise.then(function (result) {
      $scope.circles = result.data;
      $scope.searchData = result.data;

    });
  })
  .controller('userCoupleBack', function ($ionicHistory,$rootScope, $scope, userServices, system, $ionicPopup) {
    $scope.getPreviousTitle = function() {
      return $ionicHistory.backTitle();
    };

    $scope.goBack = function(){
      $ionicHistory.goBack();
    }

    system.bindNavTool({
      "rightText": "提交",
      toolClick: function () {
        if (isNaN(+$scope.phone) && $scope.phone.length != 11) {
          $ionicPopup.alert({
            title: "手机号码格式错误!"
          });
          return false;
        }
        userServices.userCoupleBackSubmit({
          phone: $scope.phone,
          text: $scope.text
        }).then(function (res) {

            if(res){
              $ionicPopup.alert({
                "title": "提交成功",
                "okText": "确认"
              })
              //$state.go('tab.user-index');
            }else{
              $ionicPopup.alert({
                "title": "提交失败",
                "okText": "确认"
              })
            }
        });
        $rootScope.backClick();
      }
    },$scope);
  })

  .controller('userOtherInfo', function ($rootScope,$state,$scope, $stateParams, messageService,userServices) {
    $scope.userInfo = {};

    userServices.getFellowInfo($stateParams.id).then(function (result) {
      $scope.userInfo = result.data||{};
    })

    $scope.newsSend = function () {
     

if($scope.userInfo.userId==window.userId){
                   // 
                   alert("不能给自己发私信");
                return;
                }

        messageService.getToPersonMessage($scope.userInfo).then(function(result){
        $scope.messageDetails = result.data.message||[];
          if ($rootScope.checkUserAuthority()) {
            $state.go('tab.user-message',{messageId:result.data.id,isFromMe:result.data[window.userId]},true)
          }
      })
    }
  })

  .controller('userUndergo', function ($scope, $rootScope, userServices, $stateParams) {
    var userInfo = userServices.dataExchange.userInfo;
    var type = '';
    switch ($stateParams.type) {
      case 'work':
        $scope.title = '工作经历';
        $scope.url = "#/tab/user/user-workExperience/";
        userInfo.workExperience = userInfo.workExperience || [];
        $scope.lists = userInfo.workExperience;
        $scope.showListKeyName="corporateName";
        type = 'work';
        break;
      case 'education':
        $scope.title = '教育背景';
        $scope.url = "#/tab/user/user-educationalBackground/";
        userInfo.educationalBackground = userInfo.educationalBackground || [];
        $scope.lists = userInfo.educationalBackground;
        $scope.showListKeyName="schoolName";
        type = 'education';
        break;
      case 'project':
        $scope.title = '项目经验';
        $scope.url = "#/tab/user/user-projectExperience/";
        userInfo.projectExperience = userInfo.projectExperience || [];
        $scope.lists = userInfo.projectExperience;
        $scope.showListKeyName="projectName";
        type = 'project';
        break;
    }
    $scope.onDelete = function (index) {
      userServices.deleteUndergoItem(type, index).then(function () {
        $scope.lists.splice(index, 1);
      });
    }
  })

    .controller('userMoreInfo', function ($window,pickPic,$scope, $rootScope, userServices, $stateParams) {
      $scope.userInfo = {}
      userServices.getUserBasicInfo(window.userId).then(function (res) {
        $scope.userInfo = res.data;
     
        if(!$scope.userInfo.extraMessage){
          $scope.userInfo.extraMessage={};
          $scope.userInfo.extraMessage.images=[];
          
        }
       
        $scope.data = $scope.userInfo.extraMessage;
      //  if(!$scope.data.images)
        //  $scope.data.images=[];
        $scope.data.images =  $scope.userInfo.extraMessage.images;

      });
      //$scope.update = userServices.updateFunction;
      var imgs = [];
      $scope.$on('$ionicView.beforeLeave',function(){
        angular.copy($scope.data.images,imgs);
        pickPic.upLoad(imgs);
        $scope.data.images.map(function (item) {
          item.src=item.tsrc;
        })
        $scope.data.text = $scope.userInfo.extraMessage.text;
        userServices.updateUserInfo('extraMessage',$scope.data);
        //$scope.update('extraMessage',$scope.data);
      })
    })

  .controller('userExamineAndVerify', function ($scope, $stateParams, userServices) {
    $scope.activityName = $stateParams.activityName;
    $scope.heardClick = function (index) {
      $scope.heardIndex = index;
      $scope.lists = [];
      userServices.getExamineAndVerify($stateParams.id, index).then(function (result) {
        (result.data.signUpRecord||[]).map(function(data){
          if(data.status){
            data.text = (data.status=='1')?'已同意':'已拒绝';
          }
        })
        $scope.lists = result.data.signUpRecord;
      }, function () {
      });
    }
    $scope.heardClick(0);
    $scope.agree = function (data) {
      //同意
      userServices.ask('1', $stateParams,data.userId).then(function () {
        data.text = '已同意';
      });
    }
    $scope.refuse = function (data) {
      //拒绝
      userServices.ask('-1', $stateParams,data.userId).then(function () {
        data.text = '已拒绝';
      });
    }
  })
  .controller('userCandidates', function ($scope, userServices, $stateParams) {
    userServices.getCandidates($stateParams.id).then(function (result) {
      $scope.candidates = result.data;
    })
  })
  .controller('userCandidatesUserInfo', function ($scope, userServices, $stateParams) {
    userServices.getUserBasicInfo($stateParams.id).then(function (result) {
      $scope.userInfo = result.data;
    })

    $scope.shareHire = function(){

    }
  })
  .controller('userAnswerDetails', function ($scope, userServices, $stateParams) {
    userServices.getAnswerDetails($stateParams.id).then(function (result) {
      var data = {};
      data.singleSelectionData = [];
      var data = {
        'maxPortion': '100',//全部
        "alreadyPortion": "1",//有效问卷
        "singleSelectionData": [
          {
            "questions": 'wenti',
            "answers": [
              {
                "percentage": 11,
                "item": 'xx'
              }
            ]
          }
        ],
        "multiSelectData": [
          {
            "questions": 'wenti',
            "answers": [
              {
                "percentage": 11,
                "item": 'xx'
              }
            ]
          }
        ],
        'questionsAndAnswers': [
          {
            questions: '问题',
            answers: [
              '答案1'
            ]
          }
        ]
      };
      $scope.answerDetails = data;
    })
  })
  .controller('userSelectDuty', function ($scope, $rootScope, userServices, system, publishToHireServices, $stateParams) {
    $scope.maxSurplus = 1;
    $scope.type = $stateParams.type;
    $scope.title = $scope.type;

    $scope.config = {
      title: '当前职能',
      getData: publishToHireServices.selectTmpServices.config.duty.getData
    }
    $scope.selectData = userServices.dataExchange.userInfo.currentFunction||[];
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        var arr = [];
        $scope.selectData.map(function (noe, index) {
          arr.push(noe.city + '-' + noe.county);
        });
        userServices.dataExchange.userInfo.currentFunction = arr;
        userServices.updateFunction('currentFunction', arr);
        $rootScope.backClick();
      }
    },$scope);
  })
  .controller('userSelectTrade', function ($scope, system, $rootScope, userServices, publishToHireServices) {
    $scope.contentHeight = window.innerHeight - 156;
    $scope.title = "选择行业";
    $scope.selectTypeText = "选择行业";
    $scope.selectData =userServices.dataExchange.userInfo.currentTrade|| [];
    $scope.maxSurplus = 1;
    publishToHireServices.selectTradeServices.getData().then(function (result) {
      $scope.typeDatas = result.data;
    })
    system.bindNavTool({
      rightText: "保存",
      toolClick: function () {
        userServices.dataExchange.userInfo.currentTrade = $scope.selectData;
        userServices.updateFunction('currentTrade', $scope.selectData);
        $rootScope.backClick();
      }
    },$scope);
  })



    .controller('userNewFriend',function ($scope, system, $stateParams, $ionicPopup, $rootScope, userServices) {
      userServices.getSysNotice("userApplyFriend").then(function(result){
        $scope.applyFriends = result.data;
      })



      $scope.agreeFriendApply = function (index,data,$event) {

        userServices.agreeFriendApply(data,1).then(function (res) {
          if(res.status==200){
            $scope.applyFriends[index].status = 1;
          }
          $event.stopPropagation();
        })
      }
    })


    .controller('userSignIn', function ($scope, system, $stateParams, $ionicPopup, $rootScope, userServices, publishToHireServices) {
    $scope.signIn = {};

    userServices.getSignInPersonnel($stateParams.id).then(function (result) {
      $scope.signIn = result.data instanceof Object?result.data : {};
    });
    $scope.change = function () {
      userServices.startSignIn($stateParams.id,$scope.signIn.signIn.startSignIn).then(function () {
      }, function () {
        $ionicPopup.alert({
          title: "打开失败",
          okText: "确认"
        })
      })
    }
  })

    .controller('userActivityEvaluate', function ($scope, system, $stateParams, $ionicPopup, $rootScope, userServices, publishToHireServices) {

      userServices.getActivityEvaluation($stateParams.id).then(function (result) {
        if(result.data){
          $scope.evaluationData= result.data instanceof Object?result.data : {};
          var i= 0,j=0;
          if($scope.evaluationData.activity){
            $scope.evaluationData.activity.map(function(noe){
              var len = noe['activityIndex'].length;
              var activityIndex  = noe['activityIndex'].reduce(function (a,b){
                return a+b;
              },0)
              activityIndex = activityIndex/(len||1);
              $scope.evaluationData.activity[i]['activityIndex'] = activityIndex;
              i++;
            })
          }
          if($scope.evaluationData.giveLessons){
            $scope.evaluationData.giveLessons.map(function(noe){
              var len = noe['giveLessonsIndex'].length;
              var giveLessonsIndex  = noe['giveLessonsIndex'].reduce(function (a,b){
                return a+b;
              },0)
              giveLessonsIndex = giveLessonsIndex/(len||1);
              $scope.evaluationData.giveLessons[j]['giveLessonsIndex'] = giveLessonsIndex;
              j++;
            })
          }

        }else{
          $scope.evaluationData = {
            activity:[],
            giveLessons:[]
          }
        }
      });
    })
