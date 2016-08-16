angular.module('starter.publishInvestigateServices', [])
  .factory('publishInvestigateServices', function (pickPic,system, DataHand, localStorageService) {
    var servicesData = {};
    /*
     * 选择调查类型
     * */
    servicesData.investigateSelectType = {};
    servicesData.investigateSelectType.getData = function () {
      return system.httpGet('./data/investigateSelectTypeData.json');
    }
    /*
     * 调查Index
     * */
    servicesData.deathData = {
      "问卷份数": [
        '100',
        "200",
        "300",
        "400",
        "500"
      ],
      "查看权限": [
        "公开结果",
        "非公开结果"
      ]
    };
    /*
     * 信息保存于读取
     */
    servicesData.infoTransform = {//提交信息数据模板
      "选择类型": "type",
      "标题": "title",
      "截止日期": "endTime",
      "问卷份数": "maxPortion",
      "问卷赏金": "moneyReward",
      "报告查看权限": "viewauthority",
      "问卷描述": "questdes",
      "问题": "questions"
    };

    servicesData.template = {//提交信息数据模板
      "选择类型": "",
      "标题": "",
      "截止日期": "",
      "问卷份数": "",
      "问卷赏金": "",
      "报告查看权限": "",
      "问卷描述": {},
      "问题":[]
    };
    /*
     * system.correspondingKey(obj,obj_);//对应注释在app.js
     * */
    servicesData.saveInfo = function (data, source,id) {
      //保存草稿到服务器 数据模板参考servicesData.infoTransform
      pickPic.upLoad(data['问卷描述'].images||data.images||[]);
      system.correspondingKey(servicesData.infoTransform, data);
      (data.questdes.images||[]).map(function(item){
        item.src=item.tsrc;
      })

      if(source=='circle'){
        var ids = id.split('_');
        if(ids.length==2){
          data.draflag = '0';
          data.userId = window.userId;
          data.creator = window.userInfo;
          data.type = "investigations";
          return DataHand.Sdata("get", "update_circle_rRecord", data, {circleId:id})
        }else{
          data.draflag = '0';
          return DataHand.Sdata("get","update_publish_item",data,{type:"investigations",id:id});
        }
      }else{
        if(id==""||id=='new'){
          data.draflag = '0';
          data.userId = window.userId;
          data.creator = window.userInfo;
          return DataHand.Sdata("get", "add_invest", data, {})
        }else{
          data.draflag = '0';
          return DataHand.Sdata("get","update_publish_item",data,{type:"investigations",id:id});
        }
      }
    }

    servicesData.getInfo = function ($stateParams) {
      var data = {
      "type":1,
      "title":1,
      "endTime":1,
      "maxPortion":1,
      "moneyReward":1,
      "viewauthority":1,
      "questdes":1,
      "questions":1,
      "_id":0
      };
      //获取已经保存在服务器发布的json数据 数据模板参考servicesData.infoTransform
      return DataHand.Sdata("get","get_invest_model",data,{id:$stateParams.id})
    }
    servicesData.publishInfo = function (data, source,id) {
      //所有http请求直接返回 例如return $http(); 数据模板参考servicesData.infoTransform
      pickPic.upLoad(data['问卷描述'].images||data.images||[]);

      system.correspondingKey(servicesData.infoTransform, data);

      (data.questdes.images||[]).map(function(item){
        item.src=item.tsrc;
      })

      if(source=='circle'){
        var ids = id.split('_');
        if(ids.length==2){
          data.draflag = '1';
          data.userId = window.userId;
          data.creator = window.userInfo;
          data.type = "investigations";
          return DataHand.Sdata("get", "update_circle_rRecord", data, {circleId:id})
        }else{
          data.draflag = '1';
          return DataHand.Sdata("get","update_publish_item",data,{type:"investigations",id:id});
        }
      }else{
        if(id==""||id=='new'){
          data.draflag = '1';
          data.userId = window.userId;
          data.creator = window.userInfo;
          return DataHand.Sdata("get", "add_invest", data, {})
        }else{
          data.draflag = '1';
          return DataHand.Sdata("get","update_publish_item",data,{type:"investigations",id:id});
        }
      }
    }
    return servicesData;
  });
