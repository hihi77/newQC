angular.module('starter.discoverServices', [])
  .factory('discoverServices', function (system, $http, $q, DataHand, localStorageService) {
    var servicesData = {};
      servicesData.selectTmpServices = {};
      servicesData.get = system.httpGet;
      servicesData.activityType = function () {

          return servicesData.get('./data/activitySelectType.json', {'cache': true});

      }


    servicesData.userGlobal = function () {
        
    }

      servicesData.searchSpecialist = function(searchData){
          console.log(searchData)
          return DataHand.Sdata("get","search_specialist",{},{param:searchData})

      }

    servicesData.getDiscoverIndexData = function () {
      //获取发现首页数据
      return DataHand.Sdata("get", "get_index_detail", {}, {});
      //return system.httpGet('./testData/discoverIndexData.json');
    }
    //获取活动 相应地区的信息
    servicesData.getAreaActivity = function (area) {
      return DataHand.Sdata("get", "get_activity_area", {}, {});
      //return system.httpGet('./testData/areaActivity.json');
    }

    servicesData.getInvestByType = function (id, area) {
      if (id) {
        return DataHand.Sdata("get", "get_circle_item", {investigtion: 1}, {circleId: id});
      }
      else
        return DataHand.Sdata("get", "get_invest_byType", {}, {draflag: '1'});
      //return system.httpGet('./testData/areaActivity.json');
    }

      servicesData.getAllActivities = function (location,type,text) {
          location = location?location:undefined;
          var param={};
          if(type&&type.length){

              param.type = {$in:type};
          }else{
              param.type=undefined;
          }
          if(location){
              location = location.split('-')[0];
              param.location = {$regex: location, $options:'i'};
          }

          return DataHand.Sdata("get","get_all_activities",{},param);
      }

    servicesData.getItemActivityDetailed = function (id, source) {
      //获取单个活动详情
      var data = {
        "activityTime": "02月15日(周一)16:00 - 02月16日14:00进行",//活动时间
        "activeAddress": true,//是不是线上活动
        "price": 0,//金额 如果是0显示免费
        "signUpCount": 20,//报名总数
        "signUpSuccess": 3,//报名成功数
        "overallMerit": 4.2,//综合评价
        "evaluationNumber": 2,//评价人数
        "eventDetails": "如果你无法简洁的表达你的想法，那只说明你还不够了解它。<br>-- 阿尔伯特·爱因斯坦<br>如果你无法简洁的表达你的想法，那只说明你还不够了解它。<br>",//活动详情
        "signUpSuccessImages": [//报名成功人的头像
          "1", "2", "3"
        ]
      };

      return DataHand.Sdata("get", "get_activity_detail", {registrationAdditional: 0}, {id: id, userId: window.userId})
        .then(function (res) {
          if (res.data) {
              console.log(window.userId)
            var activityMembers = res.data.verifiedApplicant || [];
            var signUpMembers = res.data.signUpRecord || [];
            var signInMembers = res.data.signInRecord || [];
            var evaluateMembers = res.data.evaluationRecord || [];
            res.data.participator = 0;
            res.data.alreadySignUp = 0;
            res.data.alreadySignIn = 0;
            res.data.timeAvr = 0;
            res.data.applyAvr = 0;
            res.data.checkInAvr = 0;
            res.data.commentAvr = 0;
            res.data.numberAvr = 0;
              res.data.alreadyEnd = 0;
            //是否已报满 1:未报满，0:已满
            if (res.data.signUpCount > signUpMembers.length) {
              res.data.numberAvr = 1;
            }
/*            if (res.data.userId == window.userId) {

            } else {*/
              //是否已报名 1:已报名，0:未报名
              if (signUpMembers) {
                signUpMembers.map(function (apply) {
                  if (apply.userId == window.userId)
                    res.data.alreadySignUp = 1;
                })
              }
              //是否是活动成员
              if (activityMembers) {
                activityMembers.map(function (apply) {
                  if (apply == window.userId) {
                    res.data.participator = 1;
                    //break;
                  }
                })
              }
              ;
              //是否已签到
              if (signInMembers) {
                signInMembers.map(function (apply) {
                  if (apply.userId == window.userId) {
                    res.data.alreadySignIn = 1;
                    //break;
                  }
                })
              }
              //是否已评价
              if (evaluateMembers) {
                evaluateMembers.map(function (apply) {
                  if (apply.userId == window.userId) {
                    res.data.alreadyEvaluate = 1;
                    //break;
                  }
                })
              }
              //是否活动进行中
              if ( (new Date(res.data.activityStartTime).getTime() || 0 <= new Date().getTime()) && (new Date().getTime() <= new Date(res.data.activityEndTime).getTime() || Infinity)) {
                res.data.timeAvr = 1;
              }
              //活动是否已结束
              if ( new Date().getTime() >= new Date(res.data.activityEndTime).getTime() || Infinity) {
                  res.data.alreadyEnd = 1;
              }

              //能否签到
              res.data.signIn = res.data.signIn||{};
              res.data.checkInAvr = res.data.signIn.startSignIn && res.data.participator && !res.data.alreadySignIn;

              //能否报名
              if ((new Date().getTime() <= new Date(res.data.applyEndTime).getTime()) && !res.data.alreadySignUp && res.data.numberAvr) {
                res.data.applyAvr = 1;
              }
              //能否评价
              if (res.data.alreadyEnd&&res.data.alreadySignIn && !res.data.alreadyEvaluate) {
                res.data.evaluateAvr = 1;
              }
            //}
          }
          return res;
        });

      //return system.httpGet('./testData/itemActivityDetailed.json');
    }
    servicesData.getActivityEvaluation = function (id) {
      //获取活动评价
      return DataHand.Sdata("get", "get_activity_evaluationModel", {}, {id: id});
    }
    servicesData.submitEvaluation = function (id, data) {
      //提交活动评价
      //return $http({url:''});
      return DataHand.Sdata("get", "submit_activity_rRecord", {
        data: data,
        type: "evaluation",
        userId: window.userId,
        creator: window.userInfo
      }, {id: id})
    };
    servicesData.getRegistrationAdditional = function (id) {
      //获取报名附加信息
      //return system.httpGet('./testData/registrationAdditional.json');//数据格式跟这个一样
      return DataHand.Sdata("get", "get_activity_registrationAdditionalModel", {}, {id: id})
    }

    servicesData.submitSignUp = function (param, data) {
      //提交活动报名信息
        /*
        * param = {
        * creatorId:'',
        * id:'',
        * activityName''
        * }
        * */
      //return $http({url:''});
      var len = data.length;
      for (var i = 0; i < len; i++) {
        delete data[i].$$hashKey;
      }
        DataHand.Sdata("get","new_sysNotice"
            ,{type:"applyActivity",item:param,from:{userId:userId,nickname:userInfo.nickname},to:{userId:param.creatorId,nickname:""},time:new Date(),message:userInfo.nickname+" 报名了活动 '"+param.activityName+"'!"}
            ,{type:"applyActivity",'item.id':param.id,'from.userId':userId,'to.userId':param.creatorId}
        )

      return DataHand.Sdata("get", "submit_activity_rRecord", {
        data: data,
        type: "signUp",
        userId: window.userId,
        creator: window.userInfo
      }, {id: param.id});
    }
    servicesData.getToHireMore = function (id, area) {
      //对应地区 例如上海-徐汇

      return DataHand.Sdata("get", "get_hire_byParam", {}, {});
    }

    servicesData.getItemToHireDetailed = function (id, source) {

      return DataHand.Sdata("get", "get_hire", {}, {id: id}).then(function (res) {
        var applicant = res.data.applicant||[];
          res.data.alreadyApply = 0;
        applicant.map(function (apply) {
                if (apply.userId == window.userId) {
                    res.data.alreadyApply = 1;
                }
            }
        )
        var creatorId = res.data.userId;
        if (creatorId == window.userId) {
          res.data.applyAvr = 0;
        } else {
          res.data.applyAvr = 1;
        }
        return res;
      });

    }

    servicesData.acceptAnOfferOfEmployment = function (id,position,creator) {
      //点击应聘
        DataHand.Sdata("get","new_sysNotice"
            ,{type:"applyHire",from:{userId:userId,nickname:userInfo.nickname},to:{userId:creator.userId,nickname:creator.nickname},time:new Date(),message:userInfo.nickname+" 应聘了 '"+position+"'!"}
            ,{type:"applyHire",'from.userId':userId,'to.userId':creator.userId}
        )
      return DataHand.Sdata("get", "apply_hire", window.userInfo, {id: id})
      //return $http({url:''})
    }
/*    servicesData.addFriends = function (data) {
      //才聘-发布人信息 添加好友
      // data.id 用户id text 附加信息
      return DataHand.Sdata("get", "add_friends", data, {userId: window.userId})
    }
      */
    servicesData.getIssuerUserInfo = function (id) {

      return DataHand.Sdata("get", "get_user_basic", {}, {userId: id})
    }
    servicesData.getQuestionnaireSurvey = function (id, source) {
      //获取问卷调查详情
      return DataHand.Sdata("get", "get_invest_model", {}, {id: id, userId: window.userId});
      //return system.httpGet('./testData/question.json');
    }
    servicesData.submittedQuestionnaire = function (id, data) {

      var len = data.length;
      var rdata = [];
      for (var i = 0; i < len; i++) {
        var option = data[i].option;
        var slen = option.length;
        var iarray = [];
        if (data[i].type == '问答') {
          iarray = data[i].text;
        } else {
          for (var j = 0; j < slen; j++) {
            if (option[j].pitchOn) {
              iarray.push(1);
            } else iarray.push(0);
          }
        }
        rdata.push(iarray);
      }
      data = rdata;

      //提交问卷
      data.userId = window.userId;
      data.userInfo = window.userInfo;
      return DataHand.Sdata("get", "submit_invest_rRecord", {
        data: data,
        type: "investRecord",
        userId: window.userId,
        creator: window.userInfo
      }, {id: id})
    }
    servicesData.getInformationByType = function (type) {
      //for test

      return DataHand.Sdata("get", "get_info_byType", {}, {});

      //return system.httpGet('./testData/areaInformation.json');
    }
    servicesData.getInformationSelectType = function () {
      return system.httpGet('./data/informationSelectTypeData.json');
    }
    servicesData.getItemInformationDetailed = function (id, source) {
      //获取单个信息详细数据
      //return system.httpGet('./testData/informationDetailed.json');
      return DataHand.Sdata("get", "get_info_detail", {}, {id: id});
    }
    servicesData.submitClickALike = function (id, source) {
      //信息详细数据点赞 //source 来源
      //return $http({url:''})
      return DataHand.Sdata("get", "submit_info_rRecord", {type: "alike", creator: window.userInfo}, {id: id});
    }
    servicesData.submitComment = function (id, data, source) {
      //信息详细数据评论
      //目前评论未做 你做假提交
      //return $http({url:''})
      data.type = "comment";
      data.creator = window.userInfo;
      return DataHand.Sdata("get", "submit_info_rRecord", data, {id: id});
    }
    servicesData.submitBrowse = function (id, source) {
      return DataHand.Sdata("get", "submit_info_rRecord", {type: "browse", creator: window.userInfo}, {id: id})
    }

    servicesData.discoverMap = function (scope, id) {
      //进去了地图控制器

    }
    servicesData.activitySignIn = function (id, source) {
      //活动签到
      //return $http({url:''});

      return DataHand.Sdata("get", "update_activity_signIn", {'signUpRecord.$.signInStatus': 1}, {
        id: id,
        'signUpRecord.userInfo': window.userInfo
      })
    }

    servicesData.searchHire = function (searchText) {
      param = {"$or":[{"address": {$regex: searchText, $options:'i'}},{"company": {$regex: searchText, $options:'i'}},{"industry": {$regex: searchText, $options:'i'}},{"profession": {$regex: searchText, $options:'i'}}]}
      return DataHand.Sdata("get","get_hire_byParam",{},param)
    }
    servicesData.getQuestionnaireSurveyResult = function (id, source) {
      //获取问卷调查结果
      console.log(id, source)
      return DataHand.Sdata("get", "get_invest_statistics", {}, {id: id});
      //return system.httpGet('./testData/question.json');
    }
    return servicesData;
  });
