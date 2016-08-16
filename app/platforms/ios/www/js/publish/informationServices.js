angular.module('starter.publishInformationServices', [])
  .factory('publishInformationServices', function (pickPic,system, DataHand, localStorageService) {
    var servicesData = {};
    /*
     * 选择信息类型
     * */
    servicesData.informationSelectType = {};
    servicesData.informationSelectType.getData = function () {
      return system.httpGet('./data/informationSelectTypeData.json');
    }
    /*
     * 信息保存于读取
     */
    servicesData.infoTransform = {//提交信息数据模板
      "选择类型": "type",
      "信息标题": "title",
      "信息详情": "des",
      "信息联系人": "contacts",
      "联系方式": "contactmethod",
      "信息截止时间": "endtime"
    };

    servicesData.template = {//提交信息数据模板
      "选择类型": "",
      "信息标题": "",
      "信息详情": "",
      "信息联系人": "",
      "联系方式": "",
      "信息截止时间": ""
    };

    /*
     * system.correspondingKey(obj,obj_);//对应注释在app.js
     * */
    servicesData.saveInfo = function (data, source,id) {
      //保存草稿到服务器 数据模板参考servicesData.infoTransform
      system.correspondingKey(servicesData.infoTransform, data);
      try{
        pickPic.upLoad(data['des'].images||data.images||[]);
      }
      catch(err){
        console.log(err)
      }

      (data.des.images||[]).map(function(item){
        item.src=item.tsrc;
      })
      if(source=='circle'){
        var ids = id.split('_');
        if(ids.length==2){
          data.draflag = '0';
          data.userId = window.userId;
          data.creator = window.userInfo;
          data.type = "informations";
          return DataHand.Sdata("get", "update_circle_rRecord", data, {circleId:id})
        }else{

          return DataHand.Sdata("get","update_publish_item",data,{type:"informations",id:id});
        }
      }else{
        if(id==""||id=='new'){
          data.draflag = '0';
          data.userId = window.userId;
          data.creator = window.userInfo;
          return DataHand.Sdata("get", "add_info", data, {})
        }else{
          return DataHand.Sdata("get","update_publish_item",data,{type:"informations",id:id});
        }
      }

    }
    servicesData.getInfo = function (par) {
      var data ={//提交信息数据模板
      "type":1,
      "title":1,
      "des":1,
      "contacts":1,
      "contactmethod":1,
      "endtime":1,
      "_id":0
    };
      //获取已经保存在服务器发布的json数据 数据模板参考servicesData.infoTransform
      return DataHand.Sdata("get","get_info_detail",data,{id:par.id})
    }
    servicesData.publishInfo = function (data,source,id) {
      //所有http请求直接返回 例如return $http(); 数据模板参考servicesData.infoTransform
      system.correspondingKey(servicesData.infoTransform, data);
      pickPic.upLoad(data['des'].images||data.images||[])
        try{
      (data.des.images||[]).map(function(item){
        item.src=item.tsrc;
      })
    }
    catch(err){
      console.log(err)
    }
      if(source=='circle'){
        var ids = id.split('_');
        if(ids.length==2){
          data.draflag = '1';
          data.userId = window.userId;
          data.creator = window.userInfo;
          data.type = "informations";
          return DataHand.Sdata("get", "update_circle_rRecord", data, {circleId:id})
        }else{
          data.draflag = '1';
          return DataHand.Sdata("get","update_publish_item",data,{type:"informations",id:id});
        }
      }else{
        if(id==""||id=='new'){
          data.draflag = '1';
          data.userId = window.userId;
          data.creator = window.userInfo;
          return DataHand.Sdata("get", "add_info", data, {})
        }else{
          data.draflag = '1';
          return DataHand.Sdata("get","update_publish_item",data,{type:"informations",id:id});
        }
      }
    }
    return servicesData;
  });
