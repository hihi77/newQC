angular.module('starter.circleServices', [])
  .factory('circleServices',function($rootScope,pickPic,system,$http,DataHand,localStorageService){
    var serviceData={};

    serviceData.infoTransform={//提交信息数据模板
      "加入条件": "requirement",
      "圈子名称": "title",
      "地区": "area",
      "圈子描述": "describe",
      "圈子海报": "photoUrl",
      "选择类型": "type",
      "是否公开": "open",

    };
      serviceData.checkAddUser= function (data) {

          return DataHand.Sdata("get", "check_add_user", data, {phone:data.phone});
      }
    serviceData.circleSelectType=function(){
      //获取圈子类型
      return system.httpGet('./data/circleSelectTypeData.json');
    }
    serviceData.applyCircle = function(notice,circleId,circleName){
      var data = window.userInfo;
      data.notice = notice;
      data.status ='0';
      return DataHand.Sdata("get","apply_circle",data,{circleId:circleId})
    }

      serviceData.deleteNotice = function(circleId,id){
          return DataHand.Sdata("get","unset_circle_manager",{notice:{id:id}},{circleId:circleId});
      }


      serviceData.getCircleInfo=function(id){
      //原格式返回
      //return $http({url:""})
      return DataHand.Sdata("get","get_circle_edit",{area:1,requirement:1,title:1,describe:1,photoUrl:1,type:1,open:1,_id:0},{circleId:id})

      //return serviceData.template;
    }

      serviceData.deleteCircle=function(id){
          //原格式返回
          //return $http({url:""})
          return DataHand.Sdata("get","delete_circle",{},{circleId:id})

      }

      serviceData.leaveCircle=function(id){

          return DataHand.Sdata("get","leave_circle",{},{circleId:id,userId:window.userId});

      }

      serviceData.pushMessage=function(data,id){

          return DataHand.Sdata("get","update_circle_rRecord",{type:"messages",data:data},{circleId:id});
      }


      serviceData.getMessage = function(num,id){
          
          return DataHand.Sdata("get","get_circle_items",{messages:{$slice:num}},{circleId:id});
      }

    serviceData.getCircleIndexData=function(text){
      //获取圈子首页数据
      return DataHand.Sdata("get","get_circle_index",{},{draflag:'1',userId:window.userId||"notexist","title": {$regex: text?text:"", $options:'i'}})

    }
    serviceData.searchCircle=function(text,type){
      //搜索圈子 每次按下都会执行
      switch(type){
        case 'my':
        return circleResult('myCircle');
        case 'hot':
        return circleResult('hotCircle');
        case 'all':
        return circleResult('myCircle','hotCircle')
        defalt:
        console.log('invalid');

      }
      function circleResult(t1,t2){
      return DataHand.Sdata("get","get_circle_index",{},{draflag:'1',userId:window.userId||"notexist","title": {$regex: text?text:"", $options:'i'}})
      .then(function(res){
        var ress;
        if(t2) ress = res;
        else ress = res.data[t1];
        return ress;
      })
      }
    }
    serviceData.saveCircleRough=function(data){
      //保存圈子草稿
      system.correspondingKey(serviceData.infoTransform,data);
      pickPic.upLoad(data['photoUrl']||data.images||[])
      if(data){
        data.draflag = '0';
        data.userId = window.userId;
        data.creator = window.userInfo;
        return DataHand.Sdata("get","add_circle",data,{});
      }
      else{
        return {error:"Empty Input!"}
      }
    }
    serviceData.publishCircleInfo=function(data,id){
      //如果id存在 则更新圈子数据
      //发布圈子
      system.correspondingKey(serviceData.infoTransform,data);
      pickPic.upLoad(data["photoUrl"]||data["photoUrl"].images||[])
      data.userId = window.userId;
      data.creator = window.userInfo;
      //draflag = '0' means a draf item,'1' means a published item
      if(id=="new"){
        data.draflag = '1';
        return DataHand.Sdata("get","add_circle",data,{});
      }else{
        return DataHand.Sdata("get","update_circle_item",data,{circleId:id})
      }

    }

    serviceData.getCircle = function(htype,area,type,text){
        var param = {draflag:'1',userId:userId,"title": {$regex: text?text:"", $options:'i'}};
      if(type&&type.length){

          param.type = {$in:type};
      }
        if(area){
            var area = area.split('-')[0];
            param.area = {$regex: area, $options:'i'};
        }
      return DataHand.Sdata("get","get_circle",{type:htype},param)

    }
      serviceData.getMyCircle = function(type,text){

          return DataHand.Sdata("get","get_circle",{type:type},{draflag:'1',userId:userId,"title": {$regex: text?text:"", $options:'i'}})

      }
      serviceData.getParticipateCircle = function(text){
          return DataHand.Sdata("get","get_participate_circle",{},{draflag:'1',userId:userId,"title": {$regex: text?text:"", $options:'i'}})

      }

/*    serviceData.getNotice=function(id){
      //获取圈子通知
      //return system.httpGet('./testData/notice.json');
      return DataHand.Sdata("get","get_circle_item",{notice:1},{circleId:id});
    }*/
    serviceData.getCircleActivity=function(id,offset){
      //获取圈子活动信息
      //return system.httpGet('./testData/partakeActivity.json');
      return DataHand.Sdata("get","get_circle_item",{type:"activities"},{circleId:id});
    }

    serviceData.getCircleMembers=function(id,offset){
       return DataHand.Sdata("get","get_circle_members",{members:1,"describe.text":1},{circleId:id});
      //return system.httpGet('./testData/circleMembersPageData.json');
    }

    serviceData.getAllMember=function(id,offset){
      return DataHand.Sdata("get","get_circle_members",{members:1},{circleId:id});
      //return system.httpGet('./testData/allMembes.json');
    }
    serviceData.subNotice=function(id,data){

      return DataHand.Sdata("get","update_circle_rRecord",{type:"notice",data:data,userId:window.userId,creator:window.userInfo},{circleId:id});
    }
    /**************/
    //圈子改版后
    /**************/
    serviceData.getDynamicState=function(id){
      //获取圈子动态 类似信息的格式
      //return system.httpGet('./testData/circleDynamicState.json');
      return DataHand.Sdata("get","get_circle_item",{type:"informations"},{circleId:id});
    }
    serviceData.getCircleToHire=function(id){
      //获取圈子才聘
      //return system.httpGet('./testData/partakeToHire.json');
      return DataHand.Sdata("get","get_circle_item",{type:"hires"},{circleId:id});
    }
     serviceData.getEltraFun=function(id){
      //获取圈子下拉功能
      return DataHand.Sdata("get","get_circle_item",{type:"investigations"},{circleId:id});
    }
    serviceData.getCircleInvestigate=function(id){
      //获取圈子调查
      //return system.httpGet('./testData/partakeInvestigate.json');
      return DataHand.Sdata("get","get_circle_item",{type:"investigations"},{circleId:id});
    }
    serviceData.getCircleHeard=function(id){
      //获取圈子头部
        $rootScope.isMembers = 0 ;

  
      //return system.httpGet('./testData/circleHeard.json');
      return DataHand.Sdata("get","get_circle_items",{members:1,userId:1,circleId:1,photoUrl:1,'introduction':1,title:1},{circleId:id}).then(
          function(res){
              console.log('res:',res)
              if(res){
                  if(res.data.members){
                      var members = res.data.members.common||[];

                        console.log(' members:',members)
                      members.map(function (item) {
                          if((item.userId==window.userId)||item==window.userId){
                              $rootScope.isMembers = 1 ;
                             
                          }
                      })
                  }
              }

              return res;
          }

      )
    }
    serviceData.getExamineAndVerify=function(id,type){
      //圈子审核
      function getItem(flag){
        var wArray=[];
        return DataHand.Sdata("get","get_circle_items",{applicant:1},{circleId:id})
        .then(function(res){
          var result = res.data.applicant||[];
          var len = result.length||0;
          for(var i=0;i<len;i++){
             if(result[i].status==flag) wArray.push(result[i]);
          }
          return wArray;
        })
      }

      switch (type) {
        case 0:
          //to be verify
          return getItem("0");
          break;
        case 1:
          //未通过
          return getItem("-1");
          break;
        case 2:
          //已退出
          return getItem("-2");
          break;
      }

      //return DataHand.Sdata("get","get_circle_items",{applicant:1},{circleId:id})
      //return system.httpGet('./testData/examineAndVerify.json');
    }
    serviceData.ask=function(status,id,nickname,circleId,noticeId){

      //type 同意/拒绝
      DataHand.Sdata("get","add_circle_members",{'members.common':id},{circleId:circleId});

            //console.log(data)
            DataHand.Sdata("get","new_sysNotice"
                ,{type:"circleApplyVerify",circleId:circleId,from:{userId:window.userId,nickname:window.userInfo.nickname},to:{userId:id,nickname:nickname},time:new Date(),message:"圈子管理员:"+window.userInfo.nickname+(status?"同意":"拒绝")+" 你的申请!"}
                ,{type:"circleApplyVerify",circleId:circleId,'from.userId':window.userId,'to.userId':id}
            )
        DataHand.Sdata("get","update_a_sysNotice",{'status':status,type:"agreeCircleApply"},{'id':id,userId:window.userId})
      return DataHand.Sdata("get","update_circle_item",{'applicant.$.status':status},{circleId:circleId,'applicant.userId':id});
    }

      serviceData.setManager = function(circleId,uId){
          return DataHand.Sdata("get","update_circle_members",{'members.authority':uId},{circleId:circleId});
      }

      serviceData.unsetManager = function(circleId,uId){
          return DataHand.Sdata("get","unset_circle_manager",{'members.authority':uId},{circleId:circleId});
      }


      serviceData.deleteMember = function(circleId,uId){
          return DataHand.Sdata("get","unset_circle_manager",{'members.common':uId},{circleId:circleId});
      }


    serviceData.addFriends=function(info,circleId){
      //{id:"",extraMessage:""}
      //return $http({url:""})
      return DataHand.Sdata("get","find_add_circle_member",{'members.common':info.id},{circleId:circleId})
    }
    serviceData.getNoticePage=function(id){
      //return $http({url:''});
      return DataHand.Sdata("get","get_circle_items",{notice:1},{circleId:id});
    }
    serviceData.getCircleInput=function(id){
      //return $http({url:''});
        return DataHand.Sdata("get","get_circle_items",{requirement:1},{circleId:id}).then(function (res) {
            var temp = res.data.requirement||[];
            var tTemp =[];
            temp.map(function (apply) {
                if(apply.checkBox){
                  tTemp.push(apply);
                }
            })
            res.data = tTemp;
            return res;
        });
    }


    serviceData.submitCircleInput=function(userData,circleInfo,registrationAdditional,images){
        var id = circleInfo.id;
        var name = circleInfo.name;
        if(images){
            var image = angular.copy(images);
            pickPic.upLoad(image||[]);
            (images).map(function (noe) {
                noe.src=noe.tsrc;
            })
            registrationAdditional.map(function(nof){
                if(nof.text=='是否需要上传验证'){
                    nof.value.images=images;
                }
            })
        }

        var data = {};
        data.registrationAdditional = registrationAdditional;
        data.userId = userData.userId;
        data.nickname = userData.nickname;
        data.headUrl = userData.headUrl;
        data.status ='0';
        //
        DataHand.Sdata("get","new_circle_sysNotice"
                ,{type:"applyCircle",circleId:id,to:{userId:""},from:{userId:data.userId,nickname:data.nickname},time:new Date(),message:data.nickname+" 申请加入圈子'"+name+"'!"}
                ,{type:"applyCircle",circleId:id,'from.userId':data.userId}
            )

        return DataHand.Sdata("get","apply_circle",data,{circleId:id})

    }
    return serviceData;
  });
