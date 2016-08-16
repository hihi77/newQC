angular.module('starter.publishActivityServices',[])
.factory('publishActivityServices',function(pickPic,system,DataHand,localStorageService){
        var servicesData={};
        /*
        * 选择活动类型
        * */
        servicesData.activitySelectType={};
        servicesData.activitySelectType.getData=function(){
            return system.httpGet('./testData/activitySelectTypeData.json');
        }
        /*
        * 活动性质
        * */
        servicesData.activityKind={};
        servicesData.activityKind.getActivityKind=function(){//获取活动性质
            return system.httpGet('./testData/activitySelectTypeData.json');
        };
        /*
         * 信息保存于读取
         */
        servicesData.infoTransform={//提交信息数据模板
            "选择类型":"type",
            "活动主题":"title",
            "报名截止时间":"applyEndTime",
            "活动开始时间":"activityStartTime",
            "活动结束时间":"activityEndTime",
            "线下活动地址":"address",
            "地区":"location",
            "线上活动":"activeAddress",
            "活动人数上限":"signUpCount",
            "活动费用":"price",
            "活动性质":"eventProperty",
            "报名附加信息":"registrationAdditional",
            "活动满意度评价":"activitySatisfaction",
            "推荐成功奖励":"recommendedSuccess",
            "授课满意度":"courseSatisfaction",
            "活动详情":"eventDetails"
        };

        servicesData.template={//提交信息数据模板
          "选择类型":"",
          "活动主题":"",
          "报名截止时间":"",
          "活动开始时间":"",
          "活动结束时间":"",
          "线上活动地址":"",
          "线下活动":"",
          "活动人数上限":"",
          "活动费用":"",
          "活动性质":"",
          "报名附加信息":"",
          "活动满意度评价":"",
          "推荐成功奖励":"",
          "授课满意度":"",
          "活动详情":""
        };
        /*
         * system.correspondingKey(obj,obj_);//对应注释在app.js
         * */
        servicesData.getInfo=function(par){
          var data ={
            "type":1,
            "title":1,
            "images":1,
            "applyEndTime":1,
            "activityStartTime":1,
            "activityEndTime":1,
            "location":1,
            "address":1,
            "activeAddress":1,
            "signUpCount":1,
            "price":1,
            "eventProperty":1,
            "registrationAdditional":1,
            "activitySatisfaction":1,
            "recommendedSuccess":1,
            "courseSatisfaction":1,
            "eventDetails":1,
            "_id":0
          };
          var param = {id:par.id}

          return DataHand.Sdata("get","get_activity_edit",data,param)

        }
        servicesData.publishInfo=function(data,source,id){
            //所有http请求直接返回 例如return $http(); 数据模板参考servicesData.infoTransform
          pickPic.upLoad(data['活动详情'].images||data.images||[]);
          system.correspondingKey(servicesData.infoTransform,data);
            (data.images||[]).map(function (noe) {
                noe.src=noe.tsrc;
            })
            if(source=='circle'){
            var ids = id.split('_');
            if(ids.length==2){
              data.draflag = '1';
              data.userId = window.userId;
              data.creator = window.userInfo;
              data.type = "activities";
              return DataHand.Sdata("get", "update_circle_rRecord", data, {circleId:id})
            }else{
              data.draflag = '1';
              return DataHand.Sdata("get","update_publish_item",data,{type:"activities",id:id});
            }
          }else{
            if(id==""||id=='new'){
              data.draflag = '1';
              data.userId = window.userId;
              data.creator = window.userInfo;
              return DataHand.Sdata("get", "add_activity", data, {})
            }else{
              data.draflag = '1';
              return DataHand.Sdata("get","update_publish_item",data,{type:"activities",id:id});
            }
          }

        }
        return servicesData;
    });
