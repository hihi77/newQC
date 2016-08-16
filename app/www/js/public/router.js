angular.module('starter.routes', [])

  .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {


$ionicConfigProvider.tabs.style('standard'); // Tab风格
$ionicConfigProvider.tabs.position('bottom'); // Tab位置
$ionicConfigProvider.navBar.alignTitle('center'); // 标题位置
$ionicConfigProvider.navBar.positionPrimaryButtons('left'); // 主要操作按钮位置
$ionicConfigProvider.navBar.positionSecondaryButtons('right'); //次要操作按钮位置
$ionicConfigProvider.views.maxCache(10);


    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
         controller: 'AppCtrl'
      })

     .state('preview', {
        url: '/preview',
        templateUrl: 'templates/public/slither.html',
        controller: 'AppCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })



        .state('fetch_password', {
          url: '/fetch_password',
          templateUrl: 'templates/account/fetch_password.html',
          controller: 'fetchPasswordCtrl'
        })

        .state('reset_password', {
          url: '/reset_password/:submit',
          templateUrl: 'templates/account/reset_password.html',
          controller: 'fetchPasswordCtrl'
        })

        .state('resetPassword_verify', {
          url: '/resetPassword_verify/:verify',
          templateUrl: 'templates/account/register_verify.html',
          controller: 'fetchPasswordCtrl'

        })

        .state('mobile_verify', {
          url: '/mobile_verify/:mobileVerify',
          templateUrl: 'templates/account/mobile_verify.html',
          controller: 'RegisterCtrl'

        })



        .state('register_new', {
          url: '/register_new',
          templateUrl: 'templates/account/register_new.html',
          controller: 'RegisterCtrl'

        })

        .state('register_verify', {
        url: '/register_verify/:verify/:mobileVerify',
        templateUrl: 'templates/account/register_verify.html',
        controller: 'RegisterCtrl'

      })

      .state('register_submit', {
        url: '/register_submit/:submit',
        templateUrl: 'templates/account/register_submit.html',
        controller: 'RegisterCtrl'

      })

          //for enroll only


        .state('previewEnroll', {
          url: '/previewEnroll',
          templateUrl: 'templates/public/enroll.html',
          controller: 'AppCtrl'
        })

        .state('enroll_register', {
          url: '/enroll_register',
          templateUrl: 'templates/enroll/enroll_register.html',
          controller: 'EnrollCtrl'

        })

        .state('enroll_verify', {
          url: '/enroll_verify/:verify/:mobileVerify',
          templateUrl: 'templates/enroll/enroll_verify.html',
          controller: 'EnrollCtrl'

        })

        .state('enroll_submit', {
          url: '/enroll_submit/:submit',
          templateUrl: 'templates/enroll/enroll_submit.html',
          controller: 'EnrollCtrl'

        })

        .state('enroll-addCircleInput', {
          url: '/enroll-addCircleInput/:id',

              templateUrl: 'templates/enroll/enroll-addCircleInput.html',
              controller: 'enrollAddCircleInput'


        })
          //for enroll only
      /*
       * 发布模块开始
       * */
      /*
       * 基础
       * */
            //重构
      //发布->才聘路由

        .state('newHire', {
          url: '/newHire',
          abstract:true,
          templateUrl: 'components/publish/hire/toHire-abstract.html',
          controller: function($scope){
            $scope.scope = {
              source:"",
              id:"",
              ephemeralData:{}
            }
          }
        })

      .state('newHire.index', {
        url: '/index/:source/:id',
            templateUrl: 'components/publish/hire/toHire-index.html',
            controller: "toHire"
      })
      .state('newHire.JobDescription', {
        url: '/JobDescription/:type',


            templateUrl: 'components/publish/hire/toHire-JobDescription.html',
            controller: 'jobDescription'

      })
      .state('newHire.selectTmp', {
        url: '/selectTmp/:type',

            templateUrl: 'components/publish/selectTmp.html',
            controller: 'selectTmp'

      })

      .state('newHire.selectTrade', {
        url: '/selectTrade',

            templateUrl: 'components/publish/selectTrade.html',
            controller: 'selectTrade'

      })
      .state('newHire.technicalAbility', {
        url: '/technicalAbility',

            templateUrl: 'components/publish/hire/toHire-technicalAbility.html',
            controller: 'technicalAbility'

      })
      .state('newHire.yearlySalary', {
        url: '/yearlySalary',

            templateUrl: 'components/publish/hire/toHire-yearlySalary.html',
            controller: 'yearlySalary'

      })
      .state('newHire.jobCharacteristics', {
        url: '/jobCharacteristics',

            templateUrl: 'components/publish/hire/toHire-jobCharacteristics.html',
            controller: 'jobCharacteristics'

      })
      .state('newHire.preview', {
        url: '/preview/:source/:id',

            templateUrl: 'components/publish/hire/toHire-preview.html',
            controller: 'toHirePreview'

      })


    //重构活动
    //发布-->活动
     $stateProvider
        .state('newActivity', {
          url: '/newActivity',
          abstract:true,
          // Note: abstract still needs a ui-view for its children to populate."templates:'<ui-view/>'"
          // You can simply add it inline here.
          templateUrl: 'components/publish/activity/activity-abstract.html',
          controller: 'activityAbstractCtrl'
        })
         //new activity
         .state('newActivity.index', {
             url: '/index/:source/:id',
             templateUrl: 'components/publish/activity/activity-index.html',
             controller: 'activity',
             cache:false
         })

         //edit activity
         .state('newActivity.edit', {
             url: '/edit/:id',
             templateUrl: 'components/publish/activity/activity-index.html',
             controller: 'editActivity',
             cache:false
         })

         .state('newActivity.selectType',{
           url:'/selectType',
           templateUrl: 'components/publish/activity/selectType.html',
           controller: 'activitySelectType'
         })
         .state('newActivity.selectTmp', {
           url: '/selectTmp/:type',
               templateUrl: 'components/publish/activity/selectTmp.html',
               controller: 'activitySelectTemp'
         })
         .state('newActivity.additionalRegistration', {
           url: '/additionalRegistration',
               templateUrl: 'components/publish/activity/attachInfo.html',
               controller: 'activityAdditionalRegistration'
         })
         .state('newActivity.teachingSatisfaction', {
           url: '/teachingSatisfaction',
               templateUrl: 'components/publish/activity/attachInfo.html',
               controller: 'activityTeachingSatisfaction'

         })
         .state('newActivity.satisfaction', {
           url: '/satisfaction',
               templateUrl: 'components/publish/activity/attachInfo.html',
               controller: 'activitySatisfaction'

         })
         .state('newActivity.preview', {
           url: '/preview/:source/:id',
               templateUrl: 'components/publish/activity/activity-preview.html',
               controller: 'activityPreview'
         })



    //重构
    //发布->信息路由
    $stateProvider
        .state('newInformation', {
          url: '/newInformation',
          abstract:true,
          templateUrl: 'components/publish/information/information-abstract.html',
          controller: function($scope){
            $scope.scope = {
              source:"",
              id:"",
              informationEphemeralData:{}
            }
          }
        })
        .state('newInformation.index', {
          url: '/index/:source/:id',
          templateUrl: 'components/publish/information/information-index.html',
          controller: 'information',
          cache:false
        })

      .state('newInformation.selectType', {
        url: '/selectType',
            templateUrl: 'components/publish/selectType.html',
            controller: 'informationSelectType'

      })
        .state('newInformation.preview', {
          url: '/preview/:source/:id',
          templateUrl: 'components/publish/information/information-preview.html',
          controller: 'informationPreview'
        })



    //发布->调查
    $stateProvider
      .state('tab.publish-investigate', {
        url: '/publish-investigate-:source-:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/publish/investigate-index.html',
            controller: 'investigate'
          }
        }
      })

      .state('tab.publish-investigate-selectType', {
        url: '/publish-investigate/selectType',
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'investigateSelectType'
          }
        }
      })//subject
      .state('tab.publish-investigate-subject', {
        url: '/publish-investigate/subject/:sub',
        views: {
          "tab-circle": {
            templateUrl: 'templates/publish/investigate-subject.html',
            controller: 'investigateSubject'
          }
        }
      });
    /*
     * 发布模块结束
     * */




    /*
     * 用户模块开始
     * */
    $stateProvider
      .state('tab.user-index', {
        url: '/user/index',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-index.html',
            controller: 'user'
          }
        }
      })
      .state('tab.user-info', {
        url: '/user/info',
        cache:false,
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-info.html',
            controller: 'userInfo'
          }
        }
      })
      .state('tab.user-selectArea', {
        url: '/user/user-selectArea',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectTmp.html',
            controller: 'userSelectArea'
          }
        }
      })



        .state('tab.reset_password', {
          url: '/user/reset_password/:submit',
          views: {
            "tab-user": {
              templateUrl: 'templates/account/reset_password.html',
              controller: 'fetchPasswordCtrl'
            }
          }

        })

      .state('tab.user-beGoodAt', {
        url: '/discover/user-beGoodAt',
        views: {
          "tab-discover": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'discoverSpecialist'
          }
        }
      })

      .state('tab.user-interest', {
        url: '/user/user-interest',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'userInterestSelectType'
          }
        }
      })
      .state('tab.user-trade', {
        url: '/user/user-trade',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'userTradeSelectType'
          }
        }
      })
      .state('tab.user-occupation', {
        url: '/user/user-occupation',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'userOccupationSelectType'
          }
        }
      })
      .state('tab.user-language', {
        url: '/user/user-language',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'userLanguageSelectType'
          }
        }
      })
      .state('tab.user-projectExperience', {
        url: '/user/user-projectExperience/:sub',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-projectExperience.html',
            controller: 'userProjectExperience'
          }
        }
      })
      .state('tab.user-workExperience', {
        url: '/user/user-workExperience/:sub',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-workExperience.html',
            controller: 'userWorkExperience'
          }
        }
      })
      .state('tab.user-educationalBackground', {
        url: '/user/user-educationalBackground/:sub',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-educationalBackground.html',
            controller: 'userEducationalBackground'
          }
        }
      })



      .state('tab.user-addressList', {
        url: '/user/user-addressList',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-addressList.html',
            controller: 'userAddressList'
          }
        }
      })



      .state('tab.user-userOtherInfo', {
        url: '/user/user-userOtherInfo/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-userOtherInfo.html',
            controller: 'userOtherInfo'
          }
        }
      })

      .state('tab.user-partake', {
        url: '/user/user-partake',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/categoryTab.html',
            controller: 'userPartake'
          }
        }
      })
      .state('tab.user-publish', {
        url: '/user/user-publish',
        cache:false,
        views: {
          "tab-user": {
            templateUrl: 'templates/public/categoryTab.html',
            controller: 'userPublish'
          }
        }
      })
      .state('user-coupleBack', {
        url: '/user/user-coupleBack',
        cache:false,
/*        views: {
          "tab-user": {*/
            templateUrl: 'templates/user/user-coupleBack.html',
            controller: 'userCoupleBack'
/*          }
        }*/
      })
      //user-undergo.html
      .state('tab.user-undergo', {
          url: '/user/user-undergo/:type',
          views: {
            "tab-user": {
              templateUrl: 'templates/user/user-undergo.html',
              controller: 'userUndergo'
            }
          }
        })
        .state('tab.user-moreInfo', {
          url: '/user/user-moreInfo',
          cache:false,
          views: {
            "tab-user": {
              templateUrl: 'templates/user/user-moreInfo.html',
              controller: 'userMoreInfo'
            }
          }
        })
      /*
       * 继承于发现
       * */
      .state('tab.user-signUp-detailed', {
        url: '/user/user-signUp-detailed/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-signUp-detailed.html',
            controller: 'discoverSignUpDetailed'
          }
        }
      })
      .state('tab.user-signUp-input', {
        url: '/user/user-signUp-input/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-signUp-input.html',
            controller: 'discoverSignUpInput'
          }
        }
      })
      .state('tab.user-signUp-activityEvaluation', {
        url: '/user/user-activityEvaluation/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-activityEvaluation.html',
            controller: 'discoverActivityEvaluation'
          }
        }
      })
      .state('tab.user-toHire-more', {
        url: '/user/user-toHire/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-toHire.html',
            controller: 'discoverToHireMore'
          }
        }
      })
      .state('tab.user-toHire-detailed', {
        url: '/user/user-toHire-detailed/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-toHire-detailed.html',
            controller: 'discoverToHireDetailed'
          }
        }
      })
      .state('tab.user-user-userIfo', {
        url: '/user/user-toHire-userIfo/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-userInfo.html',
            controller: 'discoverUserIfo'
          }
        }
      })
      .state('tab.user-questionnaire', {
        url: '/user-questionnaire/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-investigate.html',
            controller: 'discoverQuestionnaire'
          }
        }
      })
      .state('tab.user-questionnaireSurvey', {
        url: '/user-questionnaireSurvey/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-questionnaireSurvey.html',
            controller: 'discoverQuestionnaireSurvey'
          }
        }
      })
      .state('tab.user-question', {
        url: '/user-question/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-question.html',
            controller: 'discoverQuestion'
          }
        }
      })
      .state('tab.user-answerDetails', {
        url: '/user-answerDetails/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-answerDetails.html',
            controller: 'discoverAnswerDetails'
          }
        }
      })
      .state('tab.user-information-more', {
        url: '/user-information/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-information.html',
            controller: 'discoverInformation'
          }
        }
      })
      .state('tab.user-information-detailed', {
        url: '/user-information-detailed/:id/:source',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-information-detailed.html',
            controller: 'discoverInformationDetailed'
          }
        }
      })
      .state('tab.user-map', {
        url: '/user-map/:id/:source/:address',
        views: {
          "tab-user": {
            templateUrl: 'templates/discover/discover-map.html',
            controller: 'discoverMap'
          }
        }
      })
      //end
      /*
       * 继承于圈子
       * */
      .state('tab.user-circle', {
        url: '/user/user-circle',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/circle.html',
            controller: 'myCircle'
          }
        }
      })
      .state('tab.user-addCircle', {
        url: '/user-addCircle/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-addCircle.html',
            controller: 'addCircle'
          }
        }
      })

        .state('tab.user-editCircle', {
          url: '/user-editCircle/:id/:type',
          views: {
            "tab-user": {
              templateUrl: 'templates/circle/circle-addCircle.html',
              controller: 'addCircle'
            }
          }
        })

      .state('tab.user-selectType', {
        url: '/user-selectType',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'circleSelectType'
          }
        }
      })
      .state('tab.user-termsForEntry', {
        url: '/user-termsForEntry',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/attachInfo.html',
            controller: 'circleTermsForEntry'
          }
        }
      })
      .state('tab.user-enterTheCircle', {
        url: '/user-enterTheCircle/:name/:id',
        cache:false,
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-enterTheCircle.html',
            controller: 'circleEnterTheCircle',

          }
        }
      })
      .state('tab.user-chat', {
        url: '/user-chat/:name/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/chat.html',
            controller: 'circleChat'
          }
        }
      })
      .state('tab.user-circleMembers', {
        url: '/user-circleMembers/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-circleMembers.html',
            controller: 'circleCircleMembers'
          }
        }
      })
      .state('tab.user-member', {
        url: '/user-member/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-member.html',
            controller: 'circleMember'
          }
        }
      })
      .state('tab.user-userInfo', {
        url: '/user-userInfo/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-userInfo.html',
            controller: 'discoverUserIfo'
          }
        }
      })//user-selectContacts
      .state('tab.user-selectContacts', {
        url: '/user-selectContacts',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-selectContacts.html',
            controller: 'circleSelectContacts'
          }
        }
      })
      .state('tab.user-notice', {
        url: '/user-notice/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-notice.html',
            controller: 'circleNotice'
          }
        }
      })//circle-report
      .state('tab.user-report', {
        url: '/user-report/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-circleReport.html',
            controller: 'circleReport'
          }
        }
      })
      .state('tab.user-noticePage', {
        url: '/user-noticePage/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-noticePage.html',
            controller: 'circleNoticePage'
          }
        }
      })
      .state('tab.user-manage', {
        url: '/user-manage/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-manage.html',
            controller: 'circleManage'
          }
        }
      })

      //user-examineAndVerify for activity...
      .state('tab.user-examineAndVerify', {
        url: '/user-examineAndVerify/:id/:activityName',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-examineAndVerify.html',
            controller: 'userExamineAndVerify'
          }
        }
      })


        .state('tab.activityApply-examineAndVerify', {
          url: '/activityApply-examineAndVerify/:id',
          views: {
            "tab-user": {
              templateUrl: 'templates/user/user-examineAndVerify.html',
              //in discoverController
              controller: 'activityApplyVerify'
            }
          }
        })

      .state('tab.user-addAContact', {
        url: '/user-addAContact/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-addAContact.html',
            controller: 'circleAddAContact'
          }
        }
      })
      .state('tab.user-addCircleInput', {
        url: '/user-addCircleInput/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/circle/circle-addCircleInput.html',
            controller: 'circleAddCircleInput',
            params: {
              'id': '0'
            }
          }
        }
      })



      //继承于发布模块
      /*
       * 发布模块开始
       * */
      /*
       * 基础
       * */
      //user->才聘路由
      .state('tab.user-saveInfoOk', {
        url: '/user/saveInfoOk/:title-url_:url',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/savePrompt.html',
            controller: 'saveInfoOk'
          }
        }
      })
      // setup an abstract state for the tabs directive
      .state('tab.user-toHire', {
        url: '/user-toHire-:source-:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/toHire-index.html',
            controller: "toHire"
          }
        }
      })
      .state('tab.user-toHire-JobDescription', {
        url: '/discover-toHire/JobDescription/:type',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/toHire-JobDescription.html',
            controller: 'jobDescription'
          }
        }
      })
      .state('tab.user-toHire-selectTmp', {
        url: '/discover-toHire/selectTmp/:type',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectTmp.html',
            controller: 'selectTmp'
          }
        }
      })
      .state('tab.user-toHire-selectTrade', {
        url: '/discover-toHire/selectTrade',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectTrade.html',
            controller: 'selectTrade'
          }
        }
      })
      .state('tab.user-toHire-technicalAbility', {
        url: '/discover-toHire/technicalAbility',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/toHire-technicalAbility.html',
            controller: 'technicalAbility'
          }
        }
      })
      .state('tab.user-toHire-yearlySalary', {
        url: '/discover-toHire/yearlySalary',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/toHire-yearlySalary.html',
            controller: 'yearlySalary'
          }
        }
      })
      .state('tab.user-toHire-jobCharacteristics', {
        url: '/discover-toHire/jobCharacteristics',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/toHire-jobCharacteristics.html',
            controller: 'jobCharacteristics'
          }
        }
      })
      .state('tab.user-toHire-preview', {
        url: '/discover-toHire/preview/:source/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/toHire-preview.html',
            controller: 'toHirePreview'
          }
        }
      })

    //user->活动路由
    $stateProvider
      .state('tab.user-activity', {
        url: '/user-activity-:source-:id',
        //cache:false,
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/activity-index.html',
            controller: 'activity'
          }
        }
      })
     

      .state('tab.user-activity-selectType', {
        url: '/user-activity/selectType',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'activitySelectType'
          }
        }
      })



        .state('tab.user-activity-selectTmp', {
          url: '/user-activity/selectTmp/:type',
          views: {
            "tab-discover": {
              templateUrl: 'templates/public/selectTmp.html',
              controller: 'activitySelectTmp'
            }
          }
        })

      .state('tab.user-activity-additionalRegistration', {
        url: '/user-activity/additionalRegistration',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/attachInfo.html',
            controller: 'activityAdditionalRegistration'
          }
        }
      })

      .state('tab.user-activity-teachingSatisfaction', {
        url: '/user-activity/teachingSatisfaction',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/attachInfo.html',
            controller: 'activityTeachingSatisfaction'
          }
        }
      })
      .state('tab.user-activity-satisfaction', {
        url: '/user-activity/satisfaction',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/attachInfo.html',
            controller: 'activitySatisfaction'
          }
        }
      })



      .state('tab.user-activity-saveInfoOk', {
        url: '/user-activity/saveInfoOk',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/savePrompt.html',
            controller: 'activitySaveInfoOk'
          }
        }
      })
      .state('tab.user-activity-preview', {
        url: '/user-activity/preview/:source/:id',
        cache:false,
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/activity-preview.html',
            controller: 'activityPreview'
          }
        }
      })

    //user->信息路由
    $stateProvider
      .state('tab.user-information', {
        url: '/user-information-:source-:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/information-index.html',
            controller: 'information'
          }
        }
      })
      .state('tab.user-information-selectType', {
        url: '/user-information/selectType',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'informationSelectType'
          }
        }
      })//
      .state('tab.user-information-preview', {
        url: '/user-information/preview/:source/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/information-preview.html',
            controller: 'informationPreview'
          }
        }
      })

    //user--调查
    $stateProvider
      .state('tab.user-investigate', {
        url: '/user-investigate-:source-:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/investigate-index.html',
            controller: 'investigate'
          }
        }
      })
      .state('tab.user-investigate-selectType', {
        url: '/user-investigate/selectType',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'investigateSelectType'
          }
        }
      })//subject
      .state('tab.user-investigate-subject', {
        url: '/user-investigate/subject/:sub',
        views: {
          "tab-user": {
            templateUrl: 'templates/publish/investigate-subject.html',
            controller: 'investigateSubject'
          }
        }
      })
      /*
       * 模块结束
       * */



      .state('tab.user-candidates', {
        url: '/user-candidates/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-candidates.html',
            controller: 'userCandidates'
          }
        }
      })
      .state('tab.user-candidatesUserInfo', {
        url: '/user-candidatesUserInfo/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-candidatesUserInfo.html',
            controller: 'userCandidatesUserInfo'
          }
        }
      })
      .state('tab.user-selectTmp', {
        url: '/user-selectDuty',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectTmp.html',
            controller: 'userSelectDuty'
          }
        }
      })
      .state('tab.user-selectTrade', {
        url: '/user-selectTrade',
        views: {
          "tab-user": {
            templateUrl: 'templates/public/selectTrade.html',
            controller: 'userSelectTrade'
          }
        }
      })
      .state('tab.user-signIn', {
        url: '/user-signIn/:id',
        views: {
          "tab-user": {
            templateUrl: 'templates/user/user-signIn.html',
            controller: 'userSignIn'
          }
        }
      })
        .state('tab.user-newFriend', {
          url: '/user-newFriend',
          views: {
            "tab-user": {
              templateUrl: 'templates/user/user-newFriend.html',
              controller: 'userNewFriend'
            }
          }
        })
        .state('tab.user-evaluate', {
          url: '/user-evaluate/:id',
          views: {
            "tab-user": {
              templateUrl: 'templates/user/user-evaluate.html',
              controller: 'userActivityEvaluate'
            }
          }
        })
    //end


    //发现
    $stateProvider



        .state('tab.discover-specilist', {
          url: '/discover/discover-specilist',
          views: {
            "tab-discover": {
              templateUrl: 'templates/public/selectType.html',
              controller: 'discoverSpecialist'
            }
          }
        })
.state('tab.discover-guide', {
          url: '/discover/discover-guide', 
          views: {
            "tab-discover": {
              templateUrl: 'templates/discover/discover-guide.html',
            }
          }
        })
.state('tab.discover-mall', {
          url: '/discover/discover-mall',
          views: {
            "tab-discover": {
              templateUrl: 'templates/discover/discover-mall.html',
             
            }
          }
        })

.state('tab.discover-programme', {
          url: '/discover/discover-programme',
          views: {
            "tab-discover": {
              templateUrl: 'templates/discover/discover-programme.html',
             
            }
          }
        })

        .state('tab.discover-addressList', {
          url: '/discover/discover-addressList',
          views: {
            "tab-discover": {
              templateUrl: 'templates/discover/discover-members.html',
              controller: 'discoverAddressList'
            }
          }
        })

      .state('tab.discover-index', {
        url: '/discover/index',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-index.html',
            controller: 'discover'
          }
        }
      })//''
      .state('tab.discover-activity', {
        url: '/discover-activity',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-activity-more.html',
            controller: 'discoverActivity'
          }
        }
      })


      .state('tab.discover-selectArea', {
        url: '/discover/discover-selectArea',
        views: {
          "tab-discover": {
            templateUrl: 'templates/public/selectTmp.html',
            controller: 'discoverSelectArea'
          }
        }
      })
        .state('tab.discover-selectType', {
            url: '/discover-activity/selectType',
            views: {
                "tab-discover": {
                    templateUrl: 'templates/public/selectType.html',
                    controller: 'discoverSelectType'
                }
            }
        })


      //discover-signUp-detailed
      .state('tab.discover-signUp-detailed', {
        url: '/discover/discover-signUp-detailed/:id/:source',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-signUp-detailed.html',
            controller: 'discoverSignUpDetailed'
          }
        }
      })
      .state('tab.discover-signUp-input', {
        url: '/discover/discover-signUp-input/:id/:source/:activityName/:creatorId',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-signUp-input.html',
            controller: 'discoverSignUpInput'
          }
        }
      })
      .state('tab.discover-signUp-activityEvaluation', {
        url: '/discover/discover-activityEvaluation/:id/:source',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-activityEvaluation.html',
            controller: 'discoverActivityEvaluation'
          }
        }
      })
      .state('tab.discover-toHire-more', {
        url: '/discover/discover-toHire-more',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-toHire-more.html',
            controller: 'discoverToHireMore'
          }
        }
      })

      //Modified by tina
/*        .state('tab.give-toHire-more', {
        url: '/publish/discover-toHire-more/moreJob',
        views: {
          "tab-discover": {
            templateUrl: 'templates/publish/toHire-index.html',
            controller: 'toHire'
          }
        }
      })*/

        //End by tina

         .state('tab.give-activity-more', {
        url: '/publish/discover-activity-more',
        views: {
          "tab-discover": {
            templateUrl: 'templates/publish/activity-index.html',
            controller: 'activity'
          }
        }
      })

      .state('tab.discover-toHire-detailed', {
        url: '/discover/discover-toHire-detailed/:id/:source',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-toHire-detailed.html',
            controller: 'discoverToHireDetailed'
          }
        }
      })
      .state('tab.discover-user-userIfo', {
        url: '/discover/discover-toHire-userIfo/:id/:source',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-userInfo.html',
            controller: 'discoverUserIfo'
          }
        }
      })

      .state('tab.discover-questionnaire', {
        url: '/discover-questionnaire',
        views: {
          "tab-discover": {
            templateUrl: 'templates/public/categoryTab.html',
            controller: 'discoverQuestionnaire'
          }
        }
      })
      .state('tab.discover-questionnaireSurvey', {
        url: '/discover-questionnaireSurvey/:id/:source',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-questionnaireSurvey.html',
            controller: 'discoverQuestionnaireSurvey'
          }
        }
      })
      .state('tab.discover-question', {
        url: '/discover-question/:sub',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-question.html',
            controller: 'discoverQuestion'
          }
        }
      })
      .state('tab.discover-answerDetails', {
        url: '/discover-answerDetails/:id',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-answerDetails.html',
            controller: 'discoverAnswerDetails'
          }
        }
      })
      .state('tab.discover-information-more', {
        url: '/discover-information-more',
        views: {
          "tab-discover": {
            templateUrl: 'templates/public/categoryTab.html',
            controller: 'discoverInformation'
          }
        }
      })
      .state('tab.discover-information-detailed', {
        url: '/discover-information-detailed/:id/:source',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-information-detailed.html',
            controller: 'discoverInformationDetailed'
          }
        }
      })
      .state('tab.discover-map', {
        url: '/discover-map/:id/:source/:address',
        views: {
          "tab-discover": {
            templateUrl: 'templates/discover/discover-map.html',
            controller: 'discoverMap'
          }
        }
      })

        .state('tab.discover-activity-selectType', {
          url: '/discover-activity/selectType',
          views: {
            "tab-discover": {
              templateUrl: 'templates/public/selectType.html',
              controller: 'discoverSelectType'
            }
          }
        })

    //圈子路由
    $stateProvider
      .state('tab.circle-index', {
        url: '/circle/index',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-index.html',
            controller: 'circle'
          }
        }
      })
      .state('tab.circle-myCircle', {
        url: '/circle-myCircle',
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/circle.html',
            controller: 'myCircle'
          }
        }
      })
        .state('tab.circle-participateCircle', {
          url: '/circle-participateCircle',
          views: {
            "tab-circle": {
              templateUrl: 'templates/public/circle.html',
              controller: 'myParticipateCircle'
            }
          }
        })
      .state('tab.circle-hotCircle', {
        url: '/circle-hotCircle',
        cache:false,
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/circle.html',
            controller: 'hotCircle'
          }
        }
      })
      .state('tab.circle-addCircle', {
        url: '/circle-addCircle/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-addCircle.html',
            controller: 'addCircle'
          }
        }
      })
        .state('tab.circle-noticeDetail', {
          url: '/circle-noticeDetail/:id',
          views: {
            "tab-circle": {
              templateUrl: 'templates/circle/circle-noticeDetail.html',
              controller: 'circleNoticeDetail'
            }
          }
        })
      .state('tab.circle-circleArea', {
        url: '/circle-circleArea',
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/selectTmp.html',
            controller: 'circleSelectArea'
          }
        }
      })
      .state('tab.circle-selectType', {
        url: '/circle-selectType',
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/selectType.html',
            controller: 'circleSelectType'
          }
        }
      })
      .state('tab.circle-termsForEntry', {
        url: '/circle-termsForEntry',
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/attachInfo.html',
            controller: 'circleTermsForEntry'
          }
        }
      })//
      .state('tab.circle-addCircleInput', {
        url: '/circle-addCircleInput/:id/:name',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-addCircleInput.html',
            controller: 'circleAddCircleInput'
          }
        }
      })
      /*聊天界面*/
      .state('tab.circle-enterTheCircle', {
        url: '/circle-enterTheCircle/:name/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-enterTheCircle.html',
            controller: 'circleEnterTheCircle',
            params: {
              'name': 'circle',
              'id': 0
            }
          }
        }
      })
      .state('tab.circle-chat', {
        url: '/circle-chat/:name/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/chat.html',
            controller: 'circleChat'
          }
        }
      })
      .state('tab.circle-circleMembers', {
        url: '/circle-circleMembers/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-circleMembers.html',
            controller: 'circleCircleMembers'
          }
        }
      })

      .state('tab.circle-member', {
        url: '/circle-member/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-member.html',
            controller: 'circleMember'
          }
        }
      })

      .state('tab.circle-userInfo', {
        url: '/circle-userInfo/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-userInfo.html',
            controller: 'circleUserInfo'
          }
        }
      })

      //circle-selectContacts
      .state('tab.circle-selectContacts', {
        url: '/circle-selectContacts/:name/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-selectContacts.html',
            controller: 'circleAddressList'
          }
        }
      })
        .state('tab.circle-addressList', {
          url: '/circle/circle-addressList',
          views: {
            "tab-circle": {
              templateUrl: 'templates/user/user-addressList.html',
              controller: 'circleAddressList'
            }
          }
        })
      .state('tab.circle-notice', {
        url: '/circle-notice/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-notice.html',
            controller: 'circleNotice'
          }
        }
      })//circle-report
      .state('tab.circle-report', {
        url: '/circle-report/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-circleReport.html',
            controller: 'circleReport'
          }
        }
      })
      .state('tab.circle-noticePage', {
        url: '/circle-noticePage/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-noticePage.html',
            controller: 'circleNoticePage'
          }
        }
      })

      /*
       * 继承于发现
       * */
      .state('tab.circle-activity', {
        url: '/circle-activity/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-activity.html',
            controller: 'circleActivity'
          }
        }
      })
      .state('tab.circle-selectArea', {
        url: '/circle/circle-selectArea/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/public/selectTmp.html',
            controller: 'discoverSelectArea'
          }
        }
      })//discover-signUp-detailed
      .state('tab.circle-signUp-detailed', {
        url: '/circle/circle-signUp-detailed/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-signUp-detailed.html',
            controller: 'discoverSignUpDetailed'
          }
        }
      })
      .state('tab.circle-signUp-input', {
        url: '/circle/circle-signUp-input/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-signUp-input.html',
            controller: 'discoverSignUpInput'
          }
        }
      })
      .state('tab.circle-signUp-activityEvaluation', {
        url: '/circle/circle-activityEvaluation/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-activityEvaluation.html',
            controller: 'discoverActivityEvaluation'
          }
        }
      })
      .state('tab.circle-toHire', {
        url: '/circle/circle-toHire/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-toHire.html',
            controller: 'discoverToHireMore'
          }
        }
      })
      .state('tab.circle-toHire-detailed', {
        url: '/circle/circle-toHire-detailed/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-toHire-detailed.html',
            controller: 'discoverToHireDetailed'
          }
        }
      })
      .state('tab.circle-user-userIfo', {
        url: '/circle/circle-toHire-userIfo/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-userInfo.html',
            controller: 'discoverUserIfo'
          }
        }
      })
      .state('tab.circle-questionnaire', {
        url: '/circle-questionnaire/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-investigate.html',
            controller: 'discoverQuestionnaire'
          }
        }
      })
      .state('tab.circle-questionnaireSurvey', {
        url: '/circle-questionnaireSurvey/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-questionnaireSurvey.html',
            controller: 'discoverQuestionnaireSurvey'
          }
        }
      })

       .state('tab.circle-answerDetails', {
        url: '/circle-answerDetails/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-answerDetails.html',
            controller: 'discoverAnswerDetails'
          }
        }
      })
      .state('tab.circle-question', {
        url: '/circle-question/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-question.html',
            controller: 'discoverQuestion'
          }
        }
      })


        //system notice

        .state('tab.notice-candidatesUserInfo', {
          url: '/notice-candidatesUserInfo/:id',
          views: {
            "tab-chat": {
              templateUrl: 'templates/user/user-candidatesUserInfo.html',
              controller: 'userCandidatesUserInfo'
            }
          }
        })

        .state('tab.notice-user-examineAndVerify', {
          url: '/notice-user-examineAndVerify/:id/:activityName',
          views: {
            "tab-chat": {
              templateUrl: 'templates/user/user-examineAndVerify.html',
              controller: 'userExamineAndVerify'
            }
          }
        })

        .state('tab.chat-signUp-detailed', {
          url: '/chat/discover-signUp-detailed/:id/:source',
          views: {
            "tab-chat": {
              templateUrl: 'templates/discover/discover-signUp-detailed.html',
              controller: 'discoverSignUpDetailed'
            }
          }
        })

        .state('tab.notice-circle-examineAndVerify', {
          url: '/notice-circle-examineAndVerify/:id',
          views: {
            "tab-chat": {
              templateUrl: 'templates/circle/circle-examineAndVerify.html',
              controller: 'circleExamineAndVerify'
            }
          }
        })

      //information
      .state('tab.circle-information', {
        url: '/circle-information/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-information.html',
            controller: 'discoverInformation'
          }
        }
      })
      .state('tab.circle-information-detailed', {
        url: '/circle-information-detailed/:id/:source',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-information-detailed.html',
            controller: 'discoverInformationDetailed'
          }
        }
      })
      .state('tab.circle-map', {
        url: '/circle-map/:id/:source/:address',
        views: {
          "tab-circle": {
            templateUrl: 'templates/discover/discover-map.html',
            controller: 'discoverMap'
          }
        }
      })
      .state('tab.circle-manage', {
        url: '/circle-manage/:name/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-manage.html',
            controller: 'circleManage'
          },
          params: {
            'name': 'circle',
            'id': 0
          }
        }
      })//circle-examineAndVerify
      .state('tab.circle-examineAndVerify', {
        url: '/circle-examineAndVerify/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-examineAndVerify.html',
            controller: 'circleExamineAndVerify'
          }
        }
      })


      .state('tab.circle-addAContact', {
        url: '/circle-addAContact/:name/:id',
        views: {
          "tab-circle": {
            templateUrl: 'templates/circle/circle-addAContact.html',
            controller: 'circleAddAContact'
          }
        }
      })
    //end

        .state('tab.circle-circle-message', {
          url: '/circle-circle-message/:id',
          views: {
            "tab-circle": {
              templateUrl: 'templates/circle/circle-message.html',
              controller: 'circleMessage'
            }
          }
        })


           .state('tab.user-circle-message', {
          url: '/user-circle-message/:id',
          views: {
            "tab-user": {
              templateUrl: 'templates/circle/circle-message.html',
              controller: 'circleMessage'
            }
          }
        })
          .state('tab.publish-circle-message', {
          url: '/publish-circle-message/:id',
          views: {
            "tab-circle": {
              templateUrl: 'templates/circle/circle-message.html',
              controller: 'circleMessage'
            }
          }
        })

       
    //end

    //聊天界面
    $stateProvider
        .state('tab.chat-index', {
          url: '/chat-index',
          cache: false,
          views: {
            "tab-chat": {
              templateUrl: 'templates/chat/chat-index.html',
              controller: 'chat'
            }
          }
        })

        .state('tab.message_detail', {
          url: '/message_detail/:messageId:noReadMessages',
          views: {
            "tab-chat": {
              templateUrl: 'templates/chat/message_detail.html',
              controller: 'MessageDetailCtrl'
            }
          }
        })

        .state('tab.chat-newFriend', {
          url: '/chat-newFriend',
          views: {
            "tab-chat": {
              templateUrl: 'templates/user/user-newFriend.html',
              controller: 'userNewFriend'
            }
          }
        })

        //new invitation from circles

        .state('tab.chat-newCircle', {
          url: '/chat-newCircle',
          views: {
            "tab-chat": {
              templateUrl: 'templates/chat/chat-newCircle.html',
              controller: 'chatNewCircle'
            }
          }
        })

        .state('tab.chat-addressList', {
          url: '/chat-user-addressList',
          views: {
            "tab-chat": {
              templateUrl: 'templates/chat/user-addressList.html',
              controller: 'userAddressList'
            }
          }
        })

        .state('tab.chat-sysNotice', {
          url: '/chat-sysNotice',
          views: {
            "tab-chat": {
              templateUrl: 'templates/chat/sysNotice.html',
              controller: 'sysNoticeCtrl'
            }
          }
        })

        .state('tab.chat-userOtherInfo', {
          url: '/chat/user-userOtherInfo/:id',
          views: {
            "tab-chat": {
              templateUrl: 'templates/user/user-userOtherInfo.html',
              controller: 'chatUserOtherInfo'
            }
          }
        })




        .state('tab.user-message', {
        url: '/user-message/:messageId:isFromMe',
        views: {
          "tab-user": {
              templateUrl: 'templates/chat/message_detail.html',
              controller: 'MessageDetailCtrl',
              params: {
                'messageId': 'some default',
                'isFromMe': 0
              }
          }
        }
      })

        .state('tab.member-message', {
          url: '/member-message/:messageId:isFromMe',
          views: {
            "tab-circle": {
              templateUrl: 'templates/chat/message_detail.html',
              controller: 'MessageDetailCtrl',
              params: {
                'messageId': 'some default',
                'isFromMe': 0
              }
            }
          }
        })
          .state('tab.discover-message', {
          url: '/discover/message_detail/:messageId:isFromMe',
          views: {
            "tab-discover": {
              templateUrl: 'templates/chat/message_detail.html',
              controller: 'MessageDetailCtrl',
              params: {
                'messageId': 'some default',
                'isFromMe': 0
              }
            }
          }
        })

          
      
        


    $urlRouterProvider.otherwise('tab/discover/index');
  });