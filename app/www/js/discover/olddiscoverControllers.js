angular.module('starter.discoverControllers', [])
  .controller('discover', function ($scope, $rootScope, discoverServices, $ionicPopup, $ionicSlideBoxDelegate) {
    //$scope.$broadcast('scroll.refreshComplete');
    $rootScope.pageMarking = 'discover';
    $scope.heardPhoto = [
      './img/banner/banner_background_1.png',
      './img/banner/banner_background_2.png',
      './img/banner/banner_background_3.png'
    ]
    $scope.doRefresh = function () {
      var promise = discoverServices.getDiscoverIndexData();
      $scope.discoverData = false;
      promise.then(function (result) {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.discoverData = result.data;
        $ionicSlideBoxDelegate.update();
      }, function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.doRefresh();
    });
  })


    .controller('activityApplyVerify', function ($scope, $stateParams, userServices) {
      $scope.heardClick = function (index) {
        $scope.heardIndex = index;
        $scope.lists = [];
        userServices.getExamineAndVerify($stateParams.id, index).then(function (result) {
          result.data.signUpRecord.map(function(data){
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
        userServices.ask('1', $stateParams.id,data.userId).then(function () {
          data.text = '已同意';
        });
      }
      $scope.refuse = function (data) {
        //拒绝
        userServices.ask('-1', $stateParams.id,data.userId).then(function () {
          data.text = '已拒绝';
        });
      }
    })

    .controller('discoverActivity', function ($rootScope,$scope, $ionicPopup, system, $state, discoverServices) {
      $rootScope.activityEphemeralData =$rootScope.activityEphemeralData?$rootScope.activityEphemeralData:{};
      $scope.$watch('activityMoreArea',function(newValue,oldValue){
        discoverServices.getAllActivities(newValue,$rootScope.activityEphemeralData['选择类型']||[]).then(function(res){
          if(res.status==200){
            $scope.activities = res.data;
          }
        })
      })

      $scope.$watch("activityEphemeralData['选择类型']",function(newValue,oldValue){
        var location = $rootScope.activityMoreArea?$rootScope.activityMoreArea:undefined;
        discoverServices.getAllActivities(location,newValue).then(function(res){
          if(res.status==200){
            $scope.activities = res.data;
          }
        })
      },true)
    })

  .controller('discoverSelectArea', function ($scope, publishToHireServices, $rootScope, system, $timeout, $state, discoverServices, $ionicPopup) {
    $scope.config = publishToHireServices.selectTmpServices.config['area'];
    $scope.selectData = [];
    $scope.maxSurplus = 1;
    system.bindNavTool({
      rightText: "保存",//默认地址
      toolClick: function () {
        var area;
        if (!$scope.selectData.length) {
          area = null;
          /*$ionicPopup.alert({
            title: "请选择"
          });
          return false;*/
        }else{
          area = $scope.selectData[0].city + "-" + $scope.selectData[0].county;
        }
        $rootScope.activityMoreArea = area;
        $rootScope.backClick();
      }
    }, $scope);
  })
  .controller('discoverSignUpDetailed', function ($ionicModal,mapGps,$ionicActionSheet, $ionicPopup, $ionicNavBarDelegate, WeChat, $rootScope, $scope, system, $stateParams, $timeout, $state, discoverServices, $ionicSlideBoxDelegate, userServices) {
    //ion-share
    var stateParam;
    $scope.$on('$ionicView.beforeEnter', function () {
      discoverServices.parev_$scope = $scope;
      var promise = discoverServices.getItemActivityDetailed($scope.id, $stateParams.source);
      promise.then(function (result) {
        var noe = result.data;
        stateParam = angular.copy($stateParams);
        $scope.signUpDetailed = result.data;
        stateParam.activityName = $scope.signUpDetailed.title;
        stateParam.creatorId = $scope.signUpDetailed.creator.userId;
        $scope.signUpDetailed.eventDetails.images = result.data.images;
        $scope.map = {};
        $scope.map.address=$scope.signUpDetailed.address||$scope.signUpDetailed.location;
        $ionicSlideBoxDelegate.update();
        if ($rootScope.__partake)return;
        if ($rootScope.pageMarking == 'user' && window.userInfo.userId == result.data.userId) {
          system.bindNavTool({//仅在我的页面进行更多的操作
            navRightIonicClass: "ion-more size-24",
            toolClick: function () {
              console.log($ionicActionSheet)
              // 显示操作表
              $ionicActionSheet.hide = $ionicActionSheet.show({
                buttons: [
                  {text: '编辑页面'},
                  {text: '查看报名'},
                  {text: '查看签到'},
                  {text: '查看评价'},
                ],
                titleText: '选择需要的操作',
                destructiveText: '删除活动',
                cancelText: '取消',
                buttonClicked: function (index) {
                  switch (index) {
                    case 0:
                      $stateParams.source = $rootScope.pageMarking;
                      $state.go('tab.' + $rootScope.pageMarking + '-activity', $stateParams);
                      break;
                    case 1:
                      $state.go('tab.'+ $rootScope.pageMarking+'-examineAndVerify', {
                        id: $stateParams.id,activityName:stateParam.activityName
                      });
                      break;
                    case 2:
                      $state.go('tab.' + $rootScope.pageMarking + '-signIn', {
                        id: $stateParams.id
                      });
                      break;
                    case 3:
                      $state.go('tab.' + $rootScope.pageMarking + '-evaluate', {
                        id: $stateParams.id
                      });
                      break;
                  }
                  $ionicActionSheet.hide();
                },
                destructiveButtonClicked: function () {
                  $ionicActionSheet.hide();
                  $ionicPopup.show({
                    title: '确认删除',
                    buttons: [
                      {
                        text: '确认',
                        onTap: function (e) {
                          userServices.delActivity($stateParams).then(function () {
                            $ionicPopup.alert({
                              title: '删除成功',
                              okText: '确认'
                            })
                            $rootScope.backClick();
                          });
                        }
                      },
                      {
                        text: '取消',
                        type: 'button-positive'
                      },
                    ]
                  });

                }
              });
            }
          }, $scope);
        }
      }, function () {
        initScope();
      });
    })


    $scope.location= function ()
    {
      iniModal('templates/modal/mapModal.html');
      //mapGps.getgps();
      $scope.mapIni()
    }

    $scope.mapIni = function ()
    {
      mapGps.map($scope);
    };


    function initScope() {
      if(!$rootScope.activityEphemeralData){
        $rootScope.activityEphemeralData = {};
        $scope.data = {};
        $rootScope.activityEphemeralData['活动详情'] = $scope.data;
      }else {
        system.delObj($rootScope.activityEphemeralData);
      }
    }


    $scope.closeModal = function()
    {
      //$rootScope.activityEphemeralData['线下活动地址']=$scope.map.address;
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



    $scope.id = $stateParams.id;
    $scope.initUrl = './img/banner/banner_background_1.png';
    var prevNavText = $rootScope.prevNavText;
    $scope.signIn = function () {
      discoverServices.activitySignIn($scope.id, $stateParams.source).then(function () {
        $ionicPopup.alert({
          title: '签到成功',
          okText: '确认'
        })
        $scope.signUpDetailed.alreadySignIn =1;
      }, function () {
        $ionicPopup.alert({
          title: '签到失败',
          okText: '确认'
        })
      })
    }

    $scope.isUser = window.userInfo && window.userInfo.userId;
    $scope.activitySignUp = function () {
      if ($rootScope.checkUserAuthority()) {

        $state.go('tab.' + $rootScope.pageMarking + '-signUp-input', stateParam);
      }
    }

  })
  .controller('discoverSignUpInput', function ($scope, $rootScope, system, $stateParams, $ionicPopup, discoverServices) {
    //报名信息
    $scope.registrationAdditional = [];
    $scope.userInfo = window.userInfo;
    discoverServices.getRegistrationAdditional($stateParams.id).then(function (result) {
      $scope.registrationAdditional = result.data instanceof Array ? result.data : [];
    }, function () {
    });
    $scope.initData = function (noe) {
      noe.text == '姓名' ? noe.value = userInfo.nickname : '';
      noe.text == '手机' ? noe.value = userInfo.phone : '';
    }
    $scope.submitSignUp = function () {
      var tmp = '';
      $scope.registrationAdditional.map(function (noe) {
        if (!noe.value) {
          tmp += noe.text + "信息未填写<br>"
        }
      })
      if (tmp) {
        $ionicPopup.alert({
          "title": "信息未填写",
          template: tmp,
          "okText": "确认"
        })
        return false;
      }
      //if (!$scope.checkbox)return;
      discoverServices.submitSignUp($stateParams,$scope.registrationAdditional).then(function () {
        $ionicPopup.alert({
          "title": "提交成功",
          "okText": "确认"
        })
        $rootScope.backClick();
      }, function () {
        $ionicPopup.alert({
          "title": "提交失败",
          "okText": "确认"
        })
      })
    }
  })


  .controller('discoverActivityEvaluation', function ($scope, discoverServices, $stateParams, $rootScope, $ionicPopup) {
    //活动评价
    $scope.giveLessonsIndex = 0;
    $scope.activityIndex = 0;
    $scope.evaluationData = (function () {
      var ls = discoverServices.parev_$scope.signUpDetailed;
      var o = {
        activity: [],
        giveLessons: []
      };
      ls.activitySatisfaction = ls.activitySatisfaction||[];
      ls.courseSatisfaction = ls.courseSatisfaction||[];
      try{
      ls.activitySatisfaction.map(function (noe) {
        if (noe.checkBox)o.activity.push(noe);
      })

      ls.courseSatisfaction.map(function (noe) {
        if (noe.checkBox)o.giveLessons.push(noe);
      })
      }
      catch(err){
        console.log(err)
      }
      return o;
    })();
    console.log($scope.evaluationData)
    $scope.submitEvaluation = function () {
      discoverServices.submitEvaluation($stateParams.id, $scope.evaluationData).then(function () {
        $ionicPopup.alert({
          title: "提交成功",
          okText: "确认"
        })
        discoverServices.parev_$scope.signUpDetailed.alreadyEvaluate = 1;
        $rootScope.backClick();
      }, function () {
        $ionicPopup.alert({
          title: "提交失败",
          okText: "确认"
        })
      });
    }
  })
  .controller('discoverToHireMore', function ($state, $scope, system, discoverServices, $stateParams) {
    //更多才聘
    //$scope.searchText = "";
    //$scope.servicesSearch = 1;
    $scope.servicesSearch = function (text,scope) {
      discoverServices.searchHire(text).then(function(result){
        $scope.nowData = result.data;
        scope.searchData = result.data;
      });
    }

    $scope.url = 'tab.discover-toHire-more';
    $scope.getData = function (area) {
      discoverServices.getToHireMore($stateParams.id, area).then(function (result) {
        $scope.nowData = result.data;
        $scope.searchData = result.data;
      });
      //
    }
    var initArea = '';//需要定位
    $scope.$on('$ionicView.beforeEnter', function () {
      discoverServices.parev_$scope = $scope;
      $scope.getData(initArea);
    });
    //system.bindNavTool({
    //  rightText: initArea,//默认地址
    //  navRightIonicClass: "ion-android-arrow-dropdown",
    //  toolClick: function () {
    //    $state.go('tab.discover-selectArea');
    //  }
    //});
  })
  .controller('discoverToHireDetailed', function ($ionicActionSheet, $rootScope, $window, userServices, $state, $scope, $stateParams, system, $ionicPopup, discoverServices) {
    //才聘详情
    discoverServices.getItemToHireDetailed($stateParams.id, $stateParams.source).then(function (result) {
      $scope.toHireDetailed = result.data;
      $scope.id = $scope.toHireDetailed.userId;
      if ($rootScope.__partake)return;
      if ($rootScope.pageMarking == 'user' && window.userInfo.userId == result.data.userId) {
        system.bindNavTool({//仅在我的页面进行更多的操作
          navRightIonicClass: "ion-more size-24",
          toolClick: function () {
            // 显示操作表
            $ionicActionSheet.hide = $ionicActionSheet.show({
              buttons: [
                {text: '编辑页面'},
                {text: '查看应聘人'}
              ],
              titleText: '选择需要的操作',
              destructiveText: '删除才聘',
              cancelText: '取消',
              buttonClicked: function (index) {
                switch (index) {
                  case 0:
                    $stateParams.source = $rootScope.pageMarking;
                    $state.go('tab.' + $rootScope.pageMarking + '-toHire', $stateParams);
                    break;
                  case 1:
                    $rootScope.ephemeralData = $scope.toHireDetailed;
                    $rootScope.ephemeralData.swap = true;
                    $state.go('tab.' + $rootScope.pageMarking + '-candidates', $stateParams)
                    break;
                }
                $ionicActionSheet.hide();
              },
              destructiveButtonClicked: function () {
                $ionicActionSheet.hide();
                $ionicPopup.show({
                  title: '确认删除',
                  buttons: [
                    {
                      text: '确认',
                      onTap: function (e) {

                        userServices.delToHire($stateParams).then(function () {
                          $ionicPopup.alert({
                            title: '删除成功',
                            okText: '确认'
                          })
                          $rootScope.backClick();
                        });
                        $ionicActionSheet.hide();
                      }
                    },
                    {
                      text: '取消',
                      type: 'button-positive'
                    },
                  ]
                });

              }
            });
          }
        }, $scope);
      }
    })
    $scope.acceptAnOfferOfEmployment = function () {
      if (!window.userId) {
        $state.go('login');
      }else{

      discoverServices.acceptAnOfferOfEmployment($stateParams.id,$scope.toHireDetailed.jobDescription,$scope.toHireDetailed.creator).then(function () {

      
        $scope.toHireDetailed.alreadyApply=true;
        $ionicPopup.alert({
          "title": "应聘成功",
          "okText": "确认"
        })
      }, function () {
        $ionicPopup.alert({
          "title": "提交失败",
          "okText": "确认"
        })
      });}
    }
  })
  .controller('discoverUserIfo', function ($rootScope,messageService,$ionicActionSheet, $scope, $ionicPopup, system, $state, $stateParams, discoverServices) {

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
          $state.go('tab.discover-message',{messageId:result.data.id,isFromMe:result.data[window.userId]},true)
        }
      })
      //私信
      //return false;

    }
  })
  .controller('discoverQuestionnaire', function ($scope, $stateParams, $rootScope, $ionicPopup, system, $state, discoverServices) {
    if ($stateParams.id !== undefined) {
      $rootScope.showNavBar = false;
    }
    var services = discoverServices;
    var initArea = '';//需要定位
    $scope.url = 'tab.discover-questionnaire';
    $scope.tabClick = function (tab, index) {
      $scope.heardTabs.map(function (noe) {
        noe.hover = '';
      })
      tab.hover = 'hover';
      $scope.$parent.$parent.nowTab = tab;
      if ($scope.nowData)$scope.nowData.length = 0;
      if (tab.click)tab.click();
    }
    $scope.title = '调查';
    $scope.heardTabs = [];
    $scope.nowData = [];
    $scope.getData = function (area) {
      console.log('获取' + area);
      var promise = services.getInvestByType($stateParams.id, area);
      promise.then(function (result) {
        $scope.heardTabs = [];
        result.data.map(function (noe, index) {
          $scope.heardTabs.push({
            "type": noe.type,
            tmpUrl: "./templates/discover/discover-cateforyTab-investigate-tmp.html",
            click: function () {
              $scope.nowData = JSON.parse(JSON.stringify(noe.data));
            }
          });
        });
        $scope.tabClick($scope.heardTabs[0], 0);
      }, alertShow);
    }
    $scope.$on('$ionicView.beforeEnter', function () {
      services.parev_$scope = $scope;
      $scope.getData(initArea);
    })
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
          }
        ]
      });
    }
  })
  .controller('discoverQuestionnaireSurvey', function ($scope, $rootScope, $state, $stateParams, $ionicSlideBoxDelegate, discoverServices, userServices, system, $ionicActionSheet, $ionicPopup) {
    $scope.top = window.innerHeight - 90 - 46;
    $scope.footerShow=
    $scope.$on('$ionicView.beforeEnter', function () {
      discoverServices.getQuestionnaireSurvey($stateParams.id, $stateParams.source).then(function (result) {
        discoverServices.discoverQuestionnaireSurveyData = result.data;
        discoverServices.discoverQuestionnaireSurveyData.id = $stateParams.id;
        $scope.data = discoverServices.discoverQuestionnaireSurveyData;
        $ionicSlideBoxDelegate.update();
        $scope.url = $scope.data.isRespondent ? "#/tab/" + $rootScope.pageMarking + "-answerDetails/" + $stateParams.id : "#/tab/" + $rootScope.pageMarking + "-question/" + $rootScope.pageMarking;//
        if ($rootScope.__partake)return;
        if ($rootScope.pageMarking == 'user' && window.userInfo.userId == result.data.userId) {
          system.bindNavTool({//仅在我的页面进行更多的操作
            navRightIonicClass: "ion-more size-24",
            toolClick: function () {
              // 显示操作表
              $ionicActionSheet.hide = $ionicActionSheet.show({
                buttons: [
                  {text: '编辑页面'},
                  {text: '答卷详情'}
                ],
                titleText: '选择需要的操作',
                destructiveText: '删除调查',
                cancelText: '取消',
                buttonClicked: function (index) {
                  switch (index) {
                    case 0:
                      console.log($scope.data)
                      if ($scope.data.alreadyPortion) {
                        $ionicPopup.alert({
                          title: "有人答题的问卷不允许编辑!",
                          okText: '确认'
                        })
                      } else {
                        $stateParams.source = $rootScope.pageMarking;
                        $state.go('tab.' + $rootScope.pageMarking + '-investigate', $stateParams);
                      }
                      break;
                    case 1:
                      $state.go('tab.' + $rootScope.pageMarking + '-answerDetails', $stateParams);
                      break;
                  }
                  $ionicActionSheet.hide();
                },
                destructiveButtonClicked: function () {

                  $ionicActionSheet.hide();
                  $ionicPopup.show({
                    title: '确认删除',
                    buttons: [
                      {
                        text: '确认',
                        onTap: function (e) {
                          userServices.delInvestigate($stateParams).then(function () {
                            $ionicPopup.alert({
                              title: '删除成功',
                              okText: '确认'
                            })
                            $rootScope.backClick();
                          });
                          $ionicActionSheet.hide();
                        }
                      },
                      {
                        text: '取消',
                        type: 'button-positive'
                      },
                    ]
                  });


                }
              });
            }
          }, $scope);
        }
      }, function () {
      });
    })
  })
  .controller('discoverQuestion', function ($scope, discoverServices, $rootScope, $ionicPopup, system, $ionicNavBarDelegate, $state, $stateParams) {
    $scope.top = window.innerHeight - 90 - 32;
    //$scope.sub = +$stateParams.sub;
    $scope.questions = discoverServices.discoverQuestionnaireSurveyData.questions;
    console.log($scope.questions)
    $scope.num = discoverServices.discoverQuestionnaireSurveyData.questions.length - 1;
    $scope.questions.map(function (noe) {
      var option = [];
      if (noe.option instanceof Array && typeof noe.option[0] == 'string') {
        noe.option.map(function (noe) {
          option.push({
            'text': noe,
            'pitchOn': false
          });
        });
        noe.option = option;
      }
      if (noe.type == '单选') {
        noe.noClass = 'ion-ios-circle-filled';
        noe.offClass = "ion-ios-circle-outline";
      }
      if (noe.type == '多选') {
        noe.noClass = 'ion-android-checkbox-outline';
        noe.offClass = "ion-android-checkbox-outline-blank";
      }
    })
    $scope.listClick = function (question, index) {
      var noe = question;
      var option = noe.option;
      if (noe.type == '单选') {

        option.map(function (noe_option) {
          noe_option.pitchOn = false;
        });
        option[index].pitchOn = true;
      }
      if (noe.type == '多选') {
        option[index].pitchOn = !option[index].pitchOn;
      }
    }
    $scope.submittedQuestionnaire = function () {
      console.log('提交');
      var isSubmittedQuestionnaireLength = 0;
      var notFilled = [];
      $scope.questions.map(function (data, index) {
        var length = 0;
        if (data.type != '问答') {
          for (var i = 0; i < data.option.length; i++) {
            var noe = data.option[i];
            if (noe.pitchOn) {
              length++;
              break;
            }
          }
        } else if (data.text) {
          length = 1;
        }
        if (length) {
          isSubmittedQuestionnaireLength++;
        } else {
          notFilled.push(index + 1);
        }
      })
      console.log(isSubmittedQuestionnaireLength);
      if (isSubmittedQuestionnaireLength != $scope.questions.length) {
        $ionicPopup.alert({
          "title": "请把信息填写完整~",
          "subTitle": "未填写的题目" + notFilled.join(','),
          "okText": "确认"
        });
        return
      }
      discoverServices.submittedQuestionnaire(discoverServices.discoverQuestionnaireSurveyData.id, $scope.questions).then(function () {
        $ionicPopup.alert({
          "title": "提交成功",
          "okText": "确认"
        });
        $rootScope.backClick();
      }, function () {
        $ionicPopup.alert({
          "title": "提交失败",
          "okText": "确认"
        })
      })
    }
  })
  .controller('discoverAnswerDetails', function ($scope, $stateParams, discoverServices) {
    var questionnaireSurveyData = discoverServices.discoverQuestionnaireSurveyData;
    console.log(questionnaireSurveyData);
    discoverServices.getQuestionnaireSurveyResult($stateParams.id).then(function (result) {
      $scope.maxLength = questionnaireSurveyData.respondents.length;
      $scope.questions = questionnaireSurveyData.questions;
      $scope.res = result.data;
      console.log(result, questionnaireSurveyData)
    })

    //singleSelectionData
  })
  .controller('discoverInformation', function ($scope, $rootScope, $stateParams, $ionicPopup, system, $state, discoverServices) {
    if ($stateParams.id !== undefined) {
      $rootScope.showNavBar = false;
    }
    var services = discoverServices;
    $scope.url = 'tab.discover-activity';
    $scope.tabClick = function (tab, index) {
      $scope.heardTabs.map(function (noe) {
        noe.hover = '';
      })
      tab.hover = 'hover';
      $scope.$parent.$parent.nowTab = tab;
      if ($scope.nowData)$scope.nowData.length = 0;
      if (tab.click)tab.click();
    }
    $scope.title = '信息';
    $scope.heardTabs = [];
    $scope.nowData = [];
    $scope.getData = function (area) {
      var promise = services.getInformationSelectType();
      promise.then(function (result) {
        $scope.heardTabs = [];
        result.data.map(function (type, index) {
          $scope.heardTabs.push({
            "type": type,
            tmpUrl: "./templates/discover/discover-cateforyTab-information-tmp.html",
            click: function () {
              if (!$scope._typeDatas) {
                services.getInformationByType(type).then(function (result) {
                  $scope._typeDatas = result.data;
                  console.log($scope._typeDatas, '111');
                  $scope.nowData = getData(type);
                })
              } else {
                $scope.nowData = getData(type);
                console.log($scope.nowData, $scope._typeDatas, type)
              }
              function getData(type) {
                var data = [];
                $scope._typeDatas.map(function (noe) {
                  if (noe.type == type) {
                    data = JSON.parse(JSON.stringify(noe.data));
                  }
                })
                return data;
              }
            }
          }, function () {
            alert('失败')
          });
        });
        $scope.tabClick($scope.heardTabs[0], 0);
      }, alertShow);
    }
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

    $scope.$on('$ionicView.beforeEnter', function () {
      var initArea = '上海';//需要定位
      services.parev_$scope = $scope;
      $scope.getData(initArea);
    })
    //system.bindNavTool({
    //  rightText: "上海",//默认地址
    //  navRightIonicClass: "ion-android-arrow-dropdown",
    //  toolClick: function () {
    //    $state.go('tab.discover-selectArea');
    //  }
    //});
  })
  .controller('discoverInformationDetailed', function ($scope, $ionicPopup, userServices, $rootScope, $ionicActionSheet, system, $state, $stateParams, discoverServices, $ionicScrollDelegate) {
    discoverServices.getItemInformationDetailed($stateParams.id, $stateParams.source).then(function (result) {
      $scope.data = result.data;
      $scope.userId = result.data.userId;
      console.log($scope.userId)
      if ($rootScope.pageMarking == 'user' && window.userInfo.userId == result.data.userId) {
        system.bindNavTool({//仅在我的页面进行更多的操作
          navRightIonicClass: "ion-more size-24",
          toolClick: function () {
            // 显示操作表
            $ionicActionSheet.hide = $ionicActionSheet.show({
              buttons: [
                {text: '编辑页面'}
              ],
              titleText: '选择需要的操作',
              destructiveText: '删除信息',
              cancelText: '取消',
              buttonClicked: function (index) {
                switch (index) {
                  case 0:
                    $stateParams.source = $rootScope.pageMarking;

                    $state.go('tab.' + $rootScope.pageMarking + '-information', $stateParams);
                    break;
                }
                $ionicActionSheet.hide();
              },

              destructiveButtonClicked: function () {
                $ionicActionSheet.hide();
                $ionicPopup.show({
                  title: '确认删除',
                  buttons: [
                    {
                      text: '确认',
                      onTap: function (e) {
                        userServices.delInformation($stateParams).then(function () {
                          $ionicPopup.alert({
                            title: '删除成功',
                            okText: '确认'
                          })
                          $rootScope.backClick();
                        });
                      }
                    },
                    {
                      text: '取消',
                      type: 'button-positive'
                    },
                  ]
                });
              }
            });
          }
        }, $scope);
      }
      if ($scope.data.commentInfo)$scope.data.commentInfo.map(function (noe, index) {
        if (!noe)$scope.data.commentInfo[index] = {};
      })

    }, function () {
    });
    var inputComment = document.getElementById('inputComment');
    $scope.emojis = [];
    $scope.commentText = '';
    $scope.commentShow = false;
    $scope.clickALike = function () {
      //点赞
      discoverServices.submitClickALike($stateParams.id, $stateParams.source).then(function () {
        $scope.data.alikeNumber++;
        $ionicPopup.alert({
          "title": "点赞成功",
          "okText": "确认"
        })
      });
    }
    $scope.$on('$ionicView.beforeEnter', function () {
      discoverServices.submitBrowse($stateParams.id, $stateParams.source);
    })

    //$scope.comment = function () {
    //  //调出评价
    //  $scope.commentShow = !$scope.commentShow;
    //}
    //inputComment.onkeydown = function (event) {

    //}
   // $scope.emojis.clickEmojis = function (noe) {
     // $scope.commentText += noe;
   // }
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    $scope.submitComment = function () {
      if(window.userId){
        var commentInfo = {
          text: $scope.commentText,
          name: window.userInfo.nickname,
          heardPhoto: window.userInfo.headUrl,
          date: new Date()
        }
        discoverServices.submitComment($stateParams.id, commentInfo, $stateParams.source).then(function () {
          //$ionicPopup.alert({
          //  "title": "评论成功",
          //  "okText": "确认"
          //})
          if (!window.userInfo)window.userInfo = {};
          if (!$scope.data.commentInfo) $scope.data.commentInfo = [];
          $scope.data.commentInfo.push(commentInfo);
          $scope.commentText = '';
          viewScroll.scrollBottom();
        }, function () {
          $ionicPopup.alert({
            "title": "评论失败",
            "okText": "确认"
          })
        });
      }else{
        alert('尚未登录,不能发表评论!')
      }

    }

  })
  .controller('discoverMap', function (Gpsfun, $scope, discoverServices, $stateParams) {

    $scope.address = $stateParams.address;
    console.log($scope.address);
    //discoverServices.discoverMap($scope, $scope.id);
    Gpsfun.getgps();

  })



/*    .controller('toPersonMessage', function ($timeout,$scope, $ionicPopup,$stateParams, discoverServices,$ionicScrollDelegate,pickPic)
    {
      //window.addEventListener("native.keyboardshow", function(e){
      //        viewScroll.scrollBottom();
      //   });

      $scope.messageDetails= [];

      discoverServices.refreshMessage($stateParams.messageId).then(function(res){
        $scope.messageHead =res.data;
        $scope.messageHead.members.map(function(item){
          if(!(item.userId==window.userId)){
            $scope.message = item;
          }
        })
        $scope.messageDetails = res.data.message;

      })



      //$scope.send_content="";
      var pic={};

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

      $scope.refresh = function(){
        discoverServices.refreshMessage($stateParams.messageId).then(function(res){
          $scope.messageHead =res.data;
          $scope.messageHead.members.map(function(item){
            if(!(item.userId==window.userId)){
              $scope.message = item;
            }
          })
          $scope.messageDetails = res.data.message;

        })
      }
/!*      $scope.$on("$ionicView.beforeEnter", function(){
        // console.log($scope.messages);
        //$timeout($scope.refresh,300)
        $scope.refresh();
      });*!/

      $scope.doSend = function(data){
        var newm={};
            newm.id=new Date().getTime(),
            newm.content= $scope.send_content,
            newm.name= window.userInfo.nickname,
            newm.face = window.userInfo.headUrl;
            newm.isFromMe = $stateParams.isFromMe,
            newm.pic= data.tsrc,
            newm.time =new Date()//.format("yyyy-MM-dd hh:mm:ss")
        newm.praise=0;
        newm.replycount=0
        $scope.messageDetails.splice($scope.messageDetails.length,0,newm);
        discoverServices.pushToPersonMessage(newm,$stateParams.messageId);
        $scope.send_content="";
        $ionicScrollDelegate.$getByHandle('listScroll').scrollBottom();

      }
    })*/
