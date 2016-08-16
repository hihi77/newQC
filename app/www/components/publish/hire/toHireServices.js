var app = angular.module('starter.publishToHireServices', []);
app.factory('publishToHireServices', function ($http, $q, $ionicLoading, system, DataHand, localStorageService) {
  var servicesData = {};
  var quote;
  /**
   * 选择地区 选择职能
   * **/
  servicesData.selectTmpServices = {};
  servicesData.get = system.httpGet;
  quote = servicesData.selectTmpServices;
  quote.config = {
    "area": {
      "title": "地区",
      "getData": function () {
        var promise = servicesData.get('./data/area.json', {'cache': true});
        var deferred = $q.defer();
        promise.then(function (result) {
          var exeDate = {};
          result.data.map(function (noe) {
            if (noe.name != '请选择') {
              exeDate[noe.name] = [];
              if (noe.sub instanceof Array) {
                noe.sub.map(function (subNoe) {
                  if (subNoe.name != '请选择' && subNoe.name != '其他') {
                    exeDate[noe.name].push(subNoe.name);
                  }
                });
              }
            }
          });
          deferred.resolve({
            data: exeDate
          });
        }, function (data) {
          deferred.reject(data);
        });
        return deferred.promise;
      }
    },
    "duty": {
      "title": "职能",
      "getData": function () {
        return servicesData.get('./data/duty.json', {'cache': true});
      }
    }
  };
  /**
   * 选择行业
   * **/
  servicesData.selectTradeServices = {};
  servicesData.selectTradeServices.getData = function () {
    return servicesData.get('./data/trade.json', {'cache': true});
  };

  /*
   * 选择年薪
   * */
  servicesData.yearlySalary = {};
  servicesData.yearlySalary.getData = function () {
    return servicesData.get('./data/yearlySalary.json', {'cache': true});
  };

  /*
   * 岗位性质
   * */
  servicesData.jobCharacteristics = {};
  servicesData.jobCharacteristics.getData = function () {
    return servicesData.get('./data/jobCharacteristics.json', {'cache': true});
  };
  /*
   * 岗位描述
   * 岗位要求
   * 岗位性质
   * */
  servicesData.jobDescription = {};
  servicesData.jobDescription.config = {
    "describe": {
      "title": "岗位描述",

    },
    "demand": {
      "title": "岗位要求",

    },
    "property": {
      "title": "岗位性质",
    }
  };
  servicesData.infoTransform = {//提交信息数据模板
    "公司名称": "company",
    "地区": "address",
    "职位": "profession",
    "行业": "industry",
    "职能": "responsibility",
    "年薪": "salary",
    "岗位描述": "jobDescription",
    "岗位要求": "jobRequirements",
    "岗位特点": "jobCharacteristics",
    "岗位性质": "jobNature",
    "公司邮箱": "companyMail",
    "公司地址": "companyAddress",
    "推荐奖励": "recommendedAward",
    "推荐成功奖励": "recommendedSuccess",
    "选择日期": "time"
  }
  servicesData.template = {//提交信息数据模板
    "公司名称": "",
    "地区": "",
    "职位": "",
    "行业": "",
    "职能": "",
    "年薪": "",
    "岗位描述": "",
    "岗位要求": "",
    "岗位特点": "",
    "岗位性质": "",
    "公司邮箱": "",
    "公司地址": "",
    "推荐奖励": "",
    "推荐成功奖励": "",
    "选择日期": ""
  };
  /*
   * system.correspondingKey(obj,obj_);//对应注释在app.js
   * */

  servicesData.getInfo = function (par) {

    var data = {
      "company": 1,
      "address": 1,
      "industry": 1,
      "responsibility": 1,
      "profession":1,
      "salary": 1,
      "jobDescription": 1,
      "jobRequirements": 1,
      "jobCharacteristics": 1,
      "jobNature": 1,
      "companyMail": 1,
      "companyAddress": 1,
      "recommendedAward": 1,
      "recommendedSuccess": 1,
      "periodOfValidity": 1,
      "time":1,
      "_id": 0
    };
    //获取已经保存在服务器发布的json数据 数据模板参考servicesData.infoTransform
    return DataHand.Sdata("get", "get_hire", data, {id: par.id});
  }
  servicesData.publishInfo = function (data, source, id) {
    //所有http请求直接返回 例如return $http(); 数据模板参考servicesData.infoTransform
    system.correspondingKey(servicesData.infoTransform, data);
    if (source == 'circle') {
      var ids = id.split('_');
      if (ids.length == 2) {
        data.draflag = '1';
        data.userId = window.userId;
        data.creator = window.userInfo;
        data.type = "hires";
        return DataHand.Sdata("get", "update_circle_rRecord", data, {circleId: id})
      } else {
        data.draflag = '1';
        return DataHand.Sdata("get", "update_publish_item", data, {type: "hires", id: id});
      }
    } else {
      if (id == "" || id == 'new') {
        data.draflag = '1';
        data.userId = window.userId;
        data.creator = window.userInfo;
        return DataHand.Sdata("get", "add_hire", data, {})
      } else {
        data.draflag = '1';
        return DataHand.Sdata("get", "update_publish_item", data, {type: "hires", id: id});
      }
    }
  }
  return servicesData;
});
