angular.module('starter.circleControllers', [])
    .controller("circle", function ($state,$scope, $rootScope,$ionicPopover,$ionicModal, circleServices) {
      $scope.checkLogin = function () {
        //href="checkUserAuthority()?'#/tab/circle-addCircle/new':'#/tab/login'"
        if($rootScope.checkUserAuthority()){
          $state.go('tab.circle-addCircle',{id:'new'})
        }else{
          //$state.go('login')
        }
      }


      $scope.popover = $ionicPopover.fromTemplateUrl('templates/circle/my-popover.html', {
        scope: $scope
      });

      // .fromTemplateUrl() 方法
      $ionicPopover.fromTemplateUrl('templates/circle/my-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });


      $scope.onHold = function($event,data) {

        //去掉所有的样式
        document.body.classList.remove('platform-iOS');
        document.body.classList.remove('platform-Android');

//使用ios的样式
        document.body.classList.add('platform-ios');
        $scope.circleDataPreview = data;
        $scope.popover.show($event,data);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      // 清除浮动框
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // 在隐藏浮动框后执行
      $scope.$on('popover.hidden', function() {
        // 执行代码
      });
      // 移除浮动框后执行
      $scope.$on('popover.removed', function() {
        // 执行代码
      });


      $rootScope.pageMarking = 'circle';
      $scope.$on('$ionicView.beforeEnter',function(){
        circleServices.getCircleIndexData().then(function (result) {
          $scope.circleData = result.data;
          $scope.tmpData=result.data;
          //$scope.searchData=result.data;
        });
      })
      $scope.searchData=[];
      $scope.circleUrl = '#/tab/' + $rootScope.pageMarking + '-enterTheCircle';
      $scope.servicesSearch = function (text) {
        circleServices.getCircleIndexData(text).then(function (result) {
          $scope.circles=result.data.myCircle.concat(result.data.hotCircle);
          $scope.circles.map(function(noe,index){
            $scope.circles.map(function(a,b){
              if(noe.title==a.title){
                $scope.circles.splice(b,1)
              }
            });
          })
          if(!text){
            $scope.circles=[];
            $scope.circleData=$scope.tmpData;
          }
        });
      }
    })
    .controller('myCircle', function ($scope, $rootScope,circleServices) {
      $scope.circles = [];
      $scope.title = '我的圈子';
      $scope.circleUrl = '#/tab/' + $rootScope.pageMarking + '-enterTheCircle';
      circleServices.getMyCircle("myCircle").then(function (result) {
        $scope.searchData = result.data;
        $scope.circles = result.data;
      })
      $scope.servicesSearch = function (text) {
        circleServices.getMyCircle("myCircle",text).then(function (result) {
          $scope.circles=result.data;
          $scope.searchText=text;
          if(!text){
            $scope.circles= $scope.searchData;
          }
        });
      }
    })

    .controller('hotCircle', function ($scope,$rootScope, circleServices) {
      $scope.circles = [];
      $scope.title = '热门圈子';
      $scope.circleUrl = '#/tab/circle-enterTheCircle';
      $rootScope.circleEphemeralData =$rootScope.circleEphemeralData||{};
      var area = $rootScope.circleMoreArea?$rootScope.circleMoreArea:undefined;
      var type = $rootScope.circleEphemeralData['选择类型']||[];

      circleServices.getCircle("hotCircle",area,type).then(function (result) {
        $scope.searchData = result.data;
        $scope.circles = result.data;
      })
      $scope.servicesSearch = function (text) {
        circleServices.getCircle("hotCircle",area,type,text).then(function (result) {
          $scope.circles = result.data;
          $scope.searchText = text;
          if(!text){
            $scope.circles= $scope.searchData;
          }
        });
      }
    })



    .controller('myParticipateCircle', function ($scope, circleServices) {
      $scope.circles = [];
      $scope.title = '我加入的圈子';
      $scope.circleUrl = '#/tab/circle-enterTheCircle';
      circleServices.getParticipateCircle().then(function (result) {
        $scope.searchData = result.data;
        $scope.circles = result.data;
      })
      $scope.servicesSearch = function (text) {
        circleServices.getParticipateCircle(text).then(function (result) {
          $scope.circles = result.data;
          $scope.searchText = text;
          if(!text){
            $scope.circles= $scope.searchData;
          }
        });
      }
    })


    .controller('circleUserInfo', function ($rootScope,messageService,$ionicActionSheet, $scope, $ionicPopup, system, $state, $stateParams, discoverServices) {

      discoverServices.getIssuerUserInfo($stateParams.id).then(function (result) {
        $scope.userInfo = result.data;
        $scope.info = {
          id: $scope.userInfo.userId
        }
      }, function () {
        $ionicPopup.alert({
          "title": "信息获取失败",
          "okText": "确认"
        })
      });

      $scope.newsSend = function () {

        if($scope.userInfo.userId==window.userId){
          //
          alert("不能给自己发私信");
          return;
        }

        messageService.getToPersonMessage($scope.userInfo).then(function(result){
          $scope.messageDetails = result.data.message;
          if ($rootScope.checkUserAuthority()) {
            $state.go('tab.member-message',{messageId:result.data.id,isFromMe:result.data[window.userId]},true)
          }
        })
        //私信
        //return false;

      }
    })

    .controller('addCircle', function ($state,$scope, system, $stateParams, $rootScope, circleServices, $ionicPopup, $timeout) {

      $scope.data = {};

      if ($stateParams.id!='new') {
        circleServices.getCircleInfo($stateParams.id).then(function (result) {
          system.correspondingKey(circleServices.infoTransform,result.data,true);
          $rootScope.circleEphemeralData = result.data instanceof Object ? result.data : {};
          if (!$rootScope.circleEphemeralData['圈子描述'])$rootScope.circleEphemeralData['圈子描述'] = {};
          if (!$rootScope.circleEphemeralData['圈子海报'])$rootScope.circleEphemeralData['圈子海报'] = $scope.data;
          else $scope.data = $rootScope.circleEphemeralData['圈子海报']
        });
      } else {
        $rootScope.circleEphemeralData = {};
        $rootScope.circleEphemeralData['圈子描述'] = {};
        $rootScope.circleEphemeralData['圈子海报'] = $scope.data;
      }
      $scope.publishCircle = function () {

        var tmp = '';
        if (!$rootScope.circleEphemeralData['选择类型']) {
          tmp += '没有选择类型<br>';
        }
        if (!$rootScope.circleEphemeralData['圈子名称']) {

          tmp += '没有填写圈子名称<br>';
        }else{
          $rootScope.circleEphemeralData['圈子名称'] = $rootScope.circleEphemeralData['圈子名称'].replace(/[/]/g, '|');
        }
        if (!$rootScope.circleEphemeralData['地区']) {
          tmp += '没有填写圈子地区<br>';
        }
        //if (!$rootScope.circleEphemeralData['圈子海报'].images.length) {
        //  tmp += '没有圈子海报<br>';
        //}
        //if (!$rootScope.circleEphemeralData['圈子描述'].text) {
        //  tmp += '没有填写圈子描述<br>';
        //}
        if (tmp) {
          $ionicPopup.alert({
            "title": "信息不完整",
            "template": tmp,
            "okText": "确认"
          })
          return false;
        }
        circleServices.publishCircleInfo(system.newObject($rootScope.circleEphemeralData), $stateParams.id).then(function () {
          $ionicPopup.alert({
            "title": "发布成功",
            "okText": "确认"
          })
          $rootScope.backClick();
          system.delObj($rootScope.circleEphemeralData);
        });
        console.log($rootScope.circleEphemeralData);
      }
      system.bindNavTool({
        rightText: "保存",
        toolClick: function () {
          circleServices.saveCircleRough(system.newObject($rootScope.circleEphemeralData)).then(function (result) {
            $ionicPopup.alert({
              "title": "保存成功",
              "okText": "确认"
            })
          });
        }
      },$scope)
    })


    .controller('circleSelectType', function ($scope, circleServices, $rootScope, system) {
      $scope.title = '选择圈子类型';
      $scope.selectTypeText = '选择类型';
      var name = '选择类型';
      $scope.selectData=$rootScope.circleEphemeralData[name]||[];
      $scope.elementShow = {};
      $scope.maxSurplus=2;
      var promise = circleServices.circleSelectType();//测试服务
      promise.success(function (data) {
        $scope.typeDatas = data;
      });

      system.bindNavTool({

        rightText: "保存",
        toolClick: function () {
          $rootScope.circleEphemeralData[name] = $scope.selectData;
          $rootScope.backClick();
        }
      },$scope);
    })
    .controller('circleTermsForEntry', function ($scope, system, $rootScope) {
      $scope.title = '加入条件';
      $scope.heardTitle = '加入条件设置';
      if ($rootScope.circleEphemeralData['加入条件']) {
        $scope.lists = $rootScope.circleEphemeralData['加入条件'];
      } else {
        $scope.lists = [
          {
            "icon": "ion-person",
            "text": "姓名",
            "checkBox":true
          },
          {
            "icon": "ion-iphone",
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
          },
          {
            "icon": "ion-android-happy",
            "text": "是否需要上传认证"
          }
        ];
      }
      var name = '加入条件';
      system.bindNavTool({
        rightText: "保存",
        toolClick: function () {
          $rootScope.circleEphemeralData[name] = $scope.lists;
          $rootScope.backClick();
        }
      },$scope);
    })
    .controller('circleEnterTheCircle', function ($ionicModal,$state,$ionicPopup,$rootScope, $scope, $state, $stateParams, $ionicHistory, $ionicNavBarDelegate, system, circleServices, $timeout, $ionicSlideBoxDelegate) {


      circleServices.getAllMember($stateParams.id).then(function (result) {
        var managers =result.data.members.authority;
        var commons =result.data.members.common;
        var len = managers.length||0;
        var clen =  commons.length||0;
        $scope.manager = 0;
        $scope.isMember = 0;

        for(var i=0;i<len;i++){
          if(managers[i].userId==window.userId)
          {
            $scope.manager=1;
            break;
          }
        }
        for(var i=0;i<clen;i++){
          if(commons[i].userId==window.userId)
          {
            $scope.isMember=1;
            break;
          }
        }
        $scope.allUser = result.data.members;
        $scope.creator = result.data.userId;
      })


      $scope.initImagesRand=function(){
        var initImages=[
          './img/init/background_02.png',
          './img/init/background_04.png',
          './img/init/background_05.png',
          './img/init/background_06.png'
        ];
        return initImages[Math.floor(Math.random()*initImages.length)]
      }

      $ionicModal.fromTemplateUrl('./templates/circle/circle-noticeDetail.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
      }).then(function (modal) {
        $scope.modal = modal;
      });


      $scope.showNotice=function(data){
        /*$ionicPopup.alert({
         title:data.data.noticeTitle,
         subTitle:data.time?"发布时间"+data.time:'',
         template:data.data.notice,
         okText:"确认"
         })
         */
        $scope.modal.show();
        console.log(data)
        $scope.noticeDetail=data;
      }



      $scope.deleteNotice = function(data) {
        $scope.nowData.splice($scope.nowData.indexOf(data), 1);
        circleServices.deleteNotice($stateParams.id ,data.id).then(function(res){

        })
      };

      $scope.initImageUrl=$scope.initImagesRand();
      window.$ionicNavBarDelegate = $ionicNavBarDelegate;
      $scope.id = $stateParams.id;
      $scope.circleId = $stateParams.id;
      $scope.circleName = $stateParams.name;
      $rootScope.circleStateParams = $stateParams;

      $scope.nowData = [];
      $rootScope.closeCricleLayerShow = false;
      //获取首页的海报
      circleServices.getCircleHeard($scope.id).then(function (result) {
        $scope.heardData = result.data;
        if(window.userInfo.userId==$scope.heardData.userId||1){
          $scope.navRightIonicClass = "ion-more size-24";
          $scope.toolClick = function () {
            $state.go('tab.' + $rootScope.pageMarking + '-manage', {
              name:$stateParams.name,
              id: $stateParams.id
            });
          }
        }
        $ionicSlideBoxDelegate.update();
      })
      // Triggered on a button click, or some other target

      var getDataFn;
      $scope.heardClick = function (index) {
        $scope.heardIndex = index;
        $scope.allDataEnd = false;
        var getDataFn_;
        var type;
        switch (index) {
          case 0://通知
            getDataFn_ = circleServices.getNoticePage;
            $scope.tmpUrl = './templates/circle/circle-noticePage-tmp.html';
            type = 'notice';
            break;
          case 1://动态
            getDataFn_ = circleServices.getDynamicState;
            $scope.tmpUrl = './templates/discover/discover-cateforyTab-information-tmp.html';
            type = 'information';
            break;
          case 2://活动
            getDataFn_ = circleServices.getCircleActivity;
            $scope.tmpUrl = './templates/discover/discover-cateforyTab-activity-tmp.html';
            type = 'activity';
            break;
          case 3://才聘
            getDataFn_ = circleServices.getCircleToHire;
            $scope.tmpUrl = './templates/discover/discover-cateforyTab-toHire-tmp.html';
            type = 'hire';
            break;  
          case 4://调查
            getDataFn_ = circleServices.getCircleInvestigate;
            $scope.tmpUrl = './templates/discover/discover-cateforyTab-investigate-tmp.html';
            type = 'investigate';
            break;
              case 5://下拉
            getDataFn_=circleServices.getEltraFun;
            $scope.tmpUrl = './templates/discover/discover-cateforyTab-dropdown.html';
            type="dropdown";
            break;
        }
       
        getDataFn = function (offset) {
          getDataFn_($stateParams.id, offset).then(function (result) {
            $scope.nowData = result.data[type] || result.data;
           /* console.log(type, $scope.nowData)
            console.log(result.data)
            console.log($scope.nowData)*/
            $scope.allDataEnd = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function () {
          });
        }
         if(index!=5)//mod by Mrm
        {
        getDataFn(0);
      }
      }
      $scope.heardClick(0);
      $scope.loadMore = function () {
        if (!$scope.nowData)return;
        if (getDataFn)getDataFn($scope.nowData.length)
        else {
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.allDataEnd = true;
          }, 1000)
        }
      }



      $scope.entrPublish = function () {
        $rootScope.publishLayerEs = false;
        $scope.closeCricleLayer = false;
      }
      $scope.closeCircleLayer = function () {

        $scope.closeCricleLayer = !$scope.closeCricleLayer;
        $rootScope.publishLayerEs = $scope.closeCricleLayer;
      }
      $scope.circleName = $stateParams.name;
      $scope.id = $stateParams.id;
      system.bindNavTool({
        navRightIonicClass: "ion-more size-24",
        toolClick: function () {
          //$rootScope.pageMarking = $rootScope.pageMarking||'circle'
          $state.go('tab.'+$rootScope.pageMarking+'-manage',{
                name:$stateParams.name,
                id:$stateParams.id
              }
          );
        }
      },$scope);
      $scope.$on('$ionicView.beforeEnter',function(){
        // $rootScope.closeCricleLayerShow = false;//关闭圈子浮层
      })
    })
    .controller('circleCircleMembers', function ($scope, $rootScope, circleServices, $stateParams) {
      $scope.id = $stateParams.id;
      console.log($stateParams.id)
      circleServices.getCircleMembers($stateParams.id).then(function (result) {
        $scope.membersData = result.data;
      })
    })

    .controller('circleMember', function ($ionicPopup,$scope, $state, circleServices, $stateParams, $ionicHistory, $rootScope, system) {
      $scope.show = {
        "part": 1
      };


      console.log($stateParams.id);
      circleServices.getAllMember($stateParams.id).then(function (result) {
        var managers =result.data.members.authority;
        var commons =result.data.members.common;
        var len = managers.length||0;
        var clen =  commons.length||0;
        $scope.manager = 0;
        $scope.isMember = 0;

        for(var i=0;i<len;i++){
          if(managers[i].userId==window.userId)
          {
            $scope.manager=1;
            break;
          }
        }
        for(var i=0;i<clen;i++){
          if(commons[i].userId==window.userId)
          {
            $scope.isMember=1;
            break;
          }
        }
        $scope.allUser = result.data.members;
        $scope.creator = result.data.userId;
        $scope.searchData=$scope.allUser.authority.concat($scope.allUser.common);
        $scope.searchMarking='nickname';
      })


      $scope.unsetManager = function(index,data){

        circleServices.unsetManager($stateParams.id,data.userId).then(function(result){
          if(result.status==200){
            $ionicPopup.alert({
              "title": "设置成功",
              "okText": "确认"
            })
            $scope.allUser.authority.splice(index,1);
          }else{
            $ionicPopup.alert({
              "title": "设置失败",
              "okText": "确认"
            })
          }
        })
      }

      $scope.deleteMember = function(index,data){
        var confirmPopup = $ionicPopup.confirm({
          title: '确认删除?',
          template: '确认要删除该成员?',
          buttons: [
            { text: '取消' ,
              onTap: function(e) {
                return 'cancle';
              }
            },
            {
              text: '<b>确认</b>',
              type: 'button-positive',
              onTap: function(e) {
                return 'yes';
              }
            },
          ]
        });
        confirmPopup.then(function(res) {
          if(res=='cancle') {
            //return;
          } else {
            circleServices.deleteMember($stateParams.id,data.userId).then(function(result){
              if(result.status==200){
                $ionicPopup.alert({
                  "title": "删除成功",
                  "okText": "确认"
                })
                $scope.allUser.common.splice(index,1);
              }else{
                $ionicPopup.alert({
                  "title": "删除失败",
                  "okText": "确认"
                })
              }
            })
          }
        });






      }

      $scope.setManager = function(data){
        //console.log(index,data)
        circleServices.setManager($stateParams.id,data.userId).then(function(result){
          if(result.status==200){
            $ionicPopup.alert({
              "title": "设置成功",
              "okText": "确认"
            })
            $scope.allUser.authority.splice(0,0,data);
          }else{
            $ionicPopup.alert({
              "title": "设置失败",
              "okText": "确认"
            })
          }
        })

      }
    })


    .controller('circleAddressList', function ($stateParams,$scope, userServices, system, $ionicPopup, $rootScope, $timeout, $ionicModal) {
      //通讯录
      $scope.info = {};
      $scope.userFriends = {};
      $scope.allUsers = {};

      $ionicModal.fromTemplateUrl('./templates/circle/circle-hailFellow.html', {
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

      $scope.inviteMany = function(){

        var rData =[];
        $scope.userFriends.map(function(noe){
          if(noe.checked){
            var pushData = {};
            pushData.userId = noe.userId;
            pushData.nickname = noe.nickname;
            rData.push(pushData);
          }
        })

        userServices.inviteMany({circleId:$stateParams.id,circleName:$stateParams.name},rData).then(function(result){
          if(result.status==200){

            $ionicPopup.alert({
              "title": "邀请发送成功",
              "okText": "确认"
            })

          }else{
            $ionicPopup.alert({
              "title": "发送失败",
              "okText": "确认"
            })
          }

        })
      }

      $scope.searchCallBack=function(text) {
        userServices.getAllUser(text).then(function(result){
          console.log(result.data)
          $scope.userList=result.data;
        })
      }


      $scope.inviteToCircle = function(data){
        if(data.originalObject){
          data = data.originalObject;
        }
        userServices.sendNotification({circleId:$stateParams.id,circleName:$stateParams.name},data).then(function (result) {
          if (result) {
            $ionicPopup.alert({
              title: '发送成功', // String. 弹窗的标题。
              subTitle: "请等待对方确认",
              okText: '确认', // String (默认: 'OK')。OK按钮的文字。
            });
          } else {
            $ionicPopup.alert({
              title: '发送失败', // String. 弹窗的标题。
              subTitle: "请重新添加",
              okText: '确认' // String (默认: 'OK')。OK按钮的文字。
            });
          }
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

    .controller('circleSelectContacts', function ($scope, $rootScope, userServices) {
      $scope.searchMarking = 'nickname';
      $scope.searchData = [];
      userServices.getFriends().then(function (result) {
        $scope.userFriends = result.data;
        for (var noe in $scope.userFriends) {
          $scope.searchData = $scope.searchData.concat($scope.userFriends[noe]);
        }
      })
      $scope.checkBox={};
    })



    .controller('circleNotice', function ($ionicHistory,$scope,$state, $stateParams, circleServices, $rootScope, $ionicPopup) {

      $scope.notice="";
      $scope.noticeTitle="";
      $scope.submit = function () {
        if(!$scope.notice&&$scope.noticeTitle){
          $ionicPopup.alert({
            "title": "请输入标题和通知内容",
            "okText": "确认"
          })
        }
        circleServices.subNotice($stateParams.id, {
          notice:$scope.notice,
          noticeTitle:$scope.noticeTitle,
          time:new Date()
        }).then(function () {
          $scope.notice="";
          $scope.noticeTitle="";
          $ionicPopup.alert({
            "title": "成功",
            "okText": "确认"
          })

          $ionicHistory.goBack(-2);
          //console.log($scope.notice)
        })

      }


    })
    .controller('circleReport', function ($rootScope, $scope, circleServices, $stateParams, $ionicPopup) {
      $scope.submit = function () {
        circleServices.submitReport($stateParams.id, $scope.phone, $scope.text).then(function () {
          $ionicPopup.alert({
            "title": "成功",
            "okText": "确认"
          })
        });
      }
    })
    .controller('circleNoticePage', function ($scope, $rootScope, circleServices, $stateParams) {
      $scope.notice = [];
      circleServices.getNotice($stateParams.id).then(function (result) {
        $scope.notice = result.data;
      })

    })
    .controller('circleActivity', function ($scope, $rootScope, circleServices) {
      circleServices.getCircleActivity().then(function (result) {
        $scope.nowData = result.activity;
      })
    })
    .controller('circleChat', function ($scope, $rootScope, $stateParams, $state) {
      $scope.heard = {
        "rightText":"",
        "leftText": "返回",
        "title": $stateParams.name,
        "toolClick": function () {
          $state.go('tab.'+$rootScope.pageMarking+'-circleMembers', {

            id: $stateParams.id
          });
        }
      }
    })
    .controller('circleManage', function ($state,$window,$ionicPopup,$scope, $stateParams, $ionicModal,circleServices) {
      //圈子权限
      circleServices.getAllMember($stateParams.id).then(function(res){
        var managers =res.data.members.authority;
        var commons =res.data.members.common;
        var len = managers.length||0;
        var clen =  commons.length||0;
        $scope.manager = 0;
        $scope.isMember = 0;

        for(var i=0;i<len;i++){
          if(managers[i].userId==window.userId)
          {
            $scope.manager=1;
            break;
          }
        }
        for(var i=0;i<clen;i++){
          if(commons[i].userId==window.userId)
          {
            $scope.isMember=1;
            break;
          }
        }
      })


      $scope.leaveCircle = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: '确认退出?',
          template: '确认要退出该圈子?',
          buttons: [
            { text: '取消' ,
              onTap: function(e) {
                return 'cancle';
              }
            },
            {
              text: '<b>确认</b>',
              type: 'button-positive',
              onTap: function(e) {
                return 'yes';
              }
            },
          ]
        });
        confirmPopup.then(function(res) {
          if(res=='cancle') {
            //return;
          } else {
            circleServices.leaveCircle($stateParams.id,$stateParams.name).then(function(res){
              $state.go('tab.circle-index');
            })
          }
        });

      }

      $scope.deleteCircle  = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: '确认删除?',
          template: '确认要删除该圈子?',
          buttons: [
            { text: '取消' ,
              onTap: function(e) {
                return 'cancle';
              }
            },
            {
              text: '<b>确认</b>',
              type: 'button-positive',
              onTap: function(e) {
                return 'yes';
              }
            },
          ]
        });
        confirmPopup.then(function(res) {
          if(res=='cancle') {
            //return;
          } else {
            console.log('Yes');
            circleServices.deleteCircle($stateParams.id).then(function(res){
              $state.go('tab.circle-index');
            })
          }
        });
      };


       $scope.encodeCircle = function()
     {

      $scope.name = $stateParams.name;
//  cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {
//             alert("encode success: " + success);

// console.log(success);

//           }, function(fail) {
//             alert("encoding failed: " + fail);
//           }
//         );
        //alert(userId);


 // cordova.plugins.barcodeScanner.scan(
 //      function (result) {
 //          alert("We got a barcode\n" +
 //                "Result: " + result.text + "\n" +
 //                "Format: " + result.format + "\n" +
 //                "Cancelled: " + result.cancelled);
 //      }, 
 //      function (error) {
 //          alert("Scanning failed: " + error);
 //      }
 //   );
 $scope.closeModal =function()
 {

 $scope.modal.remove();

 }

  
           

    

 
$scope.saveImageQrcode = function () {
    console.log(window.canvas2ImagePlugin);  
    window.canvas2ImagePlugin.saveImageDataToLibrary(function (msg) {  
            console.log(msg);  
            alert('图片已保存');  
        },  
        function (err) {  
            console.log(err);  
        },  
        document.getElementById('Qrcode')  
    )  
};  

function toUtf8(str) {    
    var out, i, len, c;    
    out = "";    
    len = str.length;    
    for(i = 0; i < len; i++) {    
        c = str.charCodeAt(i);    
        if ((c >= 0x0001) && (c <= 0x007F)) {    
            out += str.charAt(i);    
        } else if (c > 0x07FF) {    
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));    
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));    
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
        } else {    
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));    
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
        }    
    }    
    return out;    
} 

       
        $ionicModal.fromTemplateUrl('templates/modal/encode.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();


var qrcode = new QRCode(document.getElementById("Qrcode"), {
    text: toUtf8(window.baseUrl.url+'#/tab/circle-addCircleInput/'+$stateParams.id+'/'+$scope.name),
    width: 250,
    height: 250,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});
        });


      




      }

      $scope.changeRole = function(userId,cRole){
        //alert(userId);
      }
      $scope.id = $stateParams.id;
      $scope.name = $stateParams.name;


    })
    .controller('circleExamineAndVerify', function ($scope, $stateParams, circleServices) {
      //成员审核
      $scope.heardClick = function (index) {
        $scope.heardIndex = index;
        $scope.lists = [];
        circleServices.getExamineAndVerify($stateParams.id, index).then(function (result) {
          $scope.lists = result;
        }, function () {
        });
        //$scope.lists = circleServices.getExamineAndVerify($stateParams.id, index)
      }
      $scope.heardClick(0);
      $scope.agree = function (data) {
        //同意
        circleServices.ask('1', data.userId,data.nickname,$stateParams.id).then(function () {
          data.text = '已同意';
        });
      }
      $scope.refuse = function (data) {
        //拒绝
        circleServices.ask('-1', data.userId,data.nickname,$stateParams.id).then(function () {
          data.text = '已拒绝';
        });

      }
    })


    .controller('circleAddAContact', function ($location,  WeChat, $ionicModal, $timeout,$scope, $ionicPopup,$stateParams, circleServices) {
      //添加成员
      $scope.id = $stateParams.id;
      $scope.name= $stateParams.name;
      $scope.info = {};
      $scope.shareWeChatFriend = function () {
        WeChat.sharelink(
            0,
            '才商连联', '您的好友:' + window.userInfo.nickname + '邀请您加入圈子'+$scope.name,
            window.company.logo, window.baseUrl.url+'#/tab/circle-addCircleInput/'+$scope.id +'/'+$scope.name

        );
      }
      $scope.shareWeChatFriendCircle = function () {
        WeChat.sharelink(
            1,
            '才商连联', '您的好友:' + window.userInfo.nickname + '邀请您加入圈子'+$scope.name,
            window.company.logo, window.baseUrl.url+'#/tab/circle-addCircleInput/'+$scope.id+'/'+$scope.name
        );
      }


      $scope.addFriends = function () {
        $ionicPopup.show({
          title: '添加好友', // String. 弹窗的标题。
          scope: $scope,
          template: "<div class='promptText' style='display: block'><p style='border:1px solid #bfbfbf;border-radius: 5px;box-sizing:border-box;height: 24px;line-height: 24px;padding:0 5px;'><input class='init' ng-model='info.id' placeholder='请输入账号和昵称' style='height: 24px'></p><p style='border:1px solid #bfbfbf;border-radius: 5px;box-sizing: border-box;height: 48px;margin-top: 10px;padding: 5px;'><textarea ng-model='info.extraMessage' maxlength='20'  placeholder='请输入不超过20字的附加信息'  class='init'></textarea></p></div>",
          buttons: [
            {
              text: '添加好友',
              type: 'button-positive',
              onTap: function (e) {
                //请求发送后这个消息应该在系统消息上显示吧?
                var promise = circleServices.addFriends($scope.info,$stateParams.id);
                if (promise) {
                  promise.then(function (result) {
                    if (+result.data.result) {
                      $ionicPopup.alert({
                        title: '请求发送成功', // String. 弹窗的标题。
                        okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                      });
                    } else {
                      $ionicPopup.alert({
                        title: '没有找到该用户', // String. 弹窗的标题。
                        subTitle: "请重新添加",
                        okText: '确认' // String (默认: 'OK')。OK按钮的文字。
                      });
                    }
                  }, function () {
                    $ionicPopup.alert({
                      title: '请求发送失败', // String. 弹窗的标题。
                      okText: '确认' // String (默认: 'OK')。OK按钮的文字。
                    });
                  });
                }
                $scope.info = {};
              }
            },
            {
              text: '取消',
              type: 'button-default',
              onTap: function (e) {
                $scope.info = {};
              }
            }
          ]
        });
      }
    })


    .controller('circleAddCircleInput',function(ShowM,$location,$timeout,$sce,$timeout,$scope,$ionicHistory,$state,circleServices,$ionicPopup,$rootScope,$stateParams){
      //报名信息
      $scope.registrationAdditional = [];
      $scope.userInfo = window.userInfo||{};
      $scope.sverifyHide = 0;
      $scope.verifyShow= 0;
      $scope.verifyNumber = "";
      //(Object data) is used for images upload, don't modified this object unless you know what you are doing!
      $scope.data={};
      circleServices.getCircleInput($stateParams.id).then(function (result) {
        $scope.registrationAdditional = result.data instanceof Array ? result.data : [];
        $scope.registrationAdditional.map(function (item) {
          if(item.text=='是否需要上传认证'){
            item.value={
              images:[]
            };
            $scope.data= item.value;
          }
        })
      }, function () {
      });


      $scope.initData = function (noe) {
        if(noe.text == '姓名'){
          noe.value = userInfo.nickname;
        }
        if(noe.text == '手机'){
          noe.value = userInfo.phone;
          if(noe.value){
            $scope.phoneDisable = "disabled";
            $scope.sverifyHide = 1;
            $scope.checkPass = 1;
          }
        }
      }
      $scope.sendMS = function (phone) {
        $scope.userInfo.phone = phone;
        $scope.phoneDisable = "disabled";
        $scope.sverifyHide = 1;
        $scope.verifyShow = 1;
        rSend(3,phone);
      }
      var ti;
      $scope.checkPass = 0;
      $scope.checkVerify = function (verifyNumber) {
        $timeout.cancel(ti);
        ti = $timeout(function () {
              var vr = doVerify(verifyNumber);
              if (vr){
                $scope.checkPass = 1;
                $scope.registrationAdditional.map(function (noe) {
                  if(noe.text == '姓名'){
                    $scope.userInfo.nickname = noe.value;
                  }
                  if(noe.text == '手机'){
                    $scope.userInfo.phone = noe.value;
                  }
                })
                //$scope.userInfo.userId=new Date().getTime().toString();

              }else{

              }
                  },
            1000)

      }

      function rSend(type,phone)
      {

        $scope.myURL ="";

        $scope.Snumber="";
        for(var i=0;i<6;i++)
        {
          $scope.Snumber+=Math.floor(Math.random()*10);
        }


        // $scope.Snumber=888888;
        var src='http://106.ihuyi.cn/webservice/sms.php?method=Submit&account=cf_zhongwei&password=amec123456&mobile='+phone+
            '&content=您的验证码是：【'+$scope.Snumber+'】。请不要把验证码泄露给其他人。' ;
//alert(src);
        $scope.myURL = $sce.trustAsResourceUrl(src);
        //$location.href($scope.myURL);
        $scope.wait=60;
        $scope.time=function () {
          if ($scope.wait== 0) {
            $scope.obj.resend=true;
            return;
          } else {

            $scope.wait--;
            $timeout(function() {
                  $scope.time()  ;
                },
                1000)
          }
        }
        $scope.time();
      }
      function doVerify(vNumber)
      {
        if($scope.Snumber==vNumber&&$scope.Snumber>'0')
        {
          return true;
        }
        else
        {
          ShowM.showAlert('验证码错误','您输入的短信验证码有误，请检查。');
        }
      };


      $scope.submitSignUp = function () {
        var tmp = '';
        $scope.registrationAdditional.map(function (noe) {
          if(!$scope.checkPass){
            tmp += "请验证手机号码<br>"
          }
          if(noe.text!='是否需要上传认证'){
            if (!noe.value) {
              tmp += noe.text + "信息未填写<br>"
            }
          }else{
            if(!noe.value.images[0]){
              tmp += "未上传证件<br>"
            }
          }
          if(noe.text == '姓名'){
            $scope.userInfo.nickname = noe.value;
          }
          if(noe.text == '手机'){
            $scope.userInfo.phone = noe.value;
          }
        })
        if (tmp) {
          $ionicPopup.alert({
            "title": "信息未填写",
            template: tmp,
            "okText": "确认"
          })
          return false;
        }else{
          circleServices.checkAddUser($scope.userInfo).then(function (res) {
            $scope.userInfo = res.data;
            circleServices.submitCircleInput($scope.userInfo,$stateParams, $scope.registrationAdditional,$scope.data.images).then(function () {
              $ionicPopup.alert({
                "title": "提交成功",
                "okText": "确认"
              })
              if($ionicHistory.backView()){
                $rootScope.backClick();
              }else{

                $state.go('tab.discover-index')
              }
            }, function () {
              $ionicPopup.alert({
                "title": "提交失败",
                "okText": "确认"
              })
            })
          })
        }
      }
    })




    .controller('circleMessage', function ($timeout,$interval,$scope, $ionicPopup,$stateParams, circleServices,$ionicScrollDelegate,pickPic)
    {

      $scope.messageNum = -10;
      var timer = $interval(refresh,7000);
      timer.then(success, error, notify);
      function success(){
        console.log("done");
      }
      function error(){
        console.log("error");
      }
      function notify(){
        console.log("每次都更新");
      }

      $scope.$on("$ionicView.leave", function() {
        //$scope.message = messageService.getMessageById($stateParams.messageId);
        $interval.cancel(timer);
        console.log(timer)
      });

      $timeout(function() {

        $ionicScrollDelegate.$getByHandle('messageDetailsScroll').scrollBottom();
      }, 200);

      $scope.circle={};
      $scope.circle.messages={

      };
      $scope.circle.messages.data = [];
      //$scope.send_content="";
      var pic={};


      refresh();


      $scope.addMulti =function()
      {
        pickPic.getPic(pic,uploadpic)

      }
      function uploadpic(data)
      {
        //alert(data.src);
        var pdata=[];
        pdata[0]=data;
        pickPic.upLoad(pdata,$scope.doSend)

      }
      $scope.doRefresh = function(){
        $scope.messageNum -= 5;
        circleServices.getMessage($scope.messageNum, $stateParams.messageId)
            .then(function(res){
              $scope.messages= res.data.messages||[];
              $scope.$broadcast('scroll.refreshComplete');

            })
      }

      function refresh() {
        circleServices.getMessage($scope.messageNum,$stateParams.id).then(function(res){
          $scope.circle.messages = res.data.messages;

        })
      }






      $scope.doSend = function(data){
        var newm={};
        newm.id=new Date().getTime(),
            newm.content= $scope.send_content,
            newm.name= window.userInfo.nickname,
            newm.img= window.userInfo.headUrl,
            newm.pic= data.tsrc,
            newm.time =new Date()//.format("yyyy-MM-dd hh:mm:ss")
        newm.praise=0;
        newm.replycount=0
        $scope.circle.messages.splice( $scope.circle.messages.length,0,{data:newm});

        // alert(data.tsrc);
        circleServices.pushMessage(newm,$stateParams.id);


        $timeout(function() {

          refresh();
        }, 200);
        $timeout(function() {

          $ionicScrollDelegate.$getByHandle('messageDetailsScroll').scrollBottom();
        }, 200);
        $scope.send_content="";


      }

    })


    .controller('circleSelectArea', function ($scope, publishToHireServices, circleServices, system, $rootScope) {
      $rootScope.circleEphemeralData = $rootScope.circleEphemeralData? $rootScope.circleEphemeralData : {};
      $scope.config = publishToHireServices.selectTmpServices.config['area'];
      $scope.selectData=$rootScope.circleEphemeralData['地区']?[$rootScope.circleEphemeralData['地区']]:[];
      $scope.maxSurplus = 1;
      system.bindNavTool(
          {
            "rightText": "保存",
            "toolClick": function () {
              var area;
              if (!$scope.selectData.length) {
                area = null;
                $rootScope.circleEphemeralData['地区'] = area;
              }else{
                area = $scope.selectData[0].city + "-" + $scope.selectData[0].county;
                $rootScope.circleEphemeralData['地区'] = $scope.selectData[0].city + "-" + $scope.selectData[0].county ;
              }
              $rootScope.circleMoreArea = area;
              $rootScope.backClick();
            }
          }
          ,$scope);

    })
