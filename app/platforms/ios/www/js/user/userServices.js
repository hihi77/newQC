angular.module('starter.userServices', [])
  .factory('userServices', function ($q,system,$http,$window,DataHand,rDataHand,localStorageService) {
    var services = {};
    /*
    * 登陆后获取用户基本信息
    * */


    services.shareUserInfo = {
      setUserInfo:setUserInfo,
      getUserInfo:getUserInfo,
      updateUserInfo:updateUserInfo
    }

    function setUserInfo(data){
      services.serviceUserInfo = data;
    }
    function getUserInfo(){
      return services.serviceUserInfo;
    }

    function updateUserInfo(key,value){
      services.serviceUserInfo[key] =value;
    }


  services.findUser = function(param)
     {
       var re = rDataHand.Sdata('get','get_user_basic',{},param)
/*      .then(function(res){
        return res;
          //callback(res);
              });*/
       return re;
     }

  services.addUser = function(data)
     {
       console.log('config',data)
       var re = rDataHand.Sdata('get','add_user',data,{})
/*      .then(function(res){
        return res;
          //callback(res);
              });*/
       return re;
     }

  services.updateUndergo = function(type,data,sub)
     {
      console.log(data)
      data.type = type;
       if(sub=='new'){
         return DataHand.Sdata("get","updatePush_user_rRecord",data,{userId:window.userId});
       }else{
         return DataHand.Sdata("get","update_user_rRecord",data,{userId:window.userId})
       }
     }

    services.getUserProInfo=function(){

        return DataHand.Sdata("get","get_user_profile",{},{userId:window.userId});
    }

    //发送邀请加入圈子的系统消息
    services.sendNotification = function(circle,data){
      //console.log(data)
      return DataHand.Sdata("get","new_sysNotice"
          ,{type:"circleInvitation",circleId:circle.circleId,circleName:circle.circleName,from:{userId:userId,nickname:userInfo.nickname},to:{userId:data.userId,nickname:data.nickname},time:new Date(),message:userInfo.nickname+" 邀请你加入圈子'"+circle.circleName+"'!"}
          ,{type:"circleInvitation",circleId:circle.circleId,'from.userId':userId,'to.userId':data.userId}
      )
    }
    /*
    * 获取全部用户信息
    * */
    services.getUserBasicInfo=function(id){
      id=id||window.userId;
      return DataHand.Sdata("get","get_user_basic",{},{userId:id});
    }
    /*
    * 通讯录
    * */
    services.deleteFriend=function(userId){
      //删除一个联系人
      //return $http({url:''});
      return DataHand.Sdata("get","delete_friend",{'friends':userId},{userId:window.userId})
    }

    services.inviteMany = function(circle,data){
      var len = data.length;
      for(var i=0;i<len-1;i++){
        DataHand.Sdata("get","new_sysNotice"
            ,{type:"circleInvitation",circleId:circle.circleId,from:{userId:userId,nickname:userInfo.nickname},to:data[i],time:new Date(),message:userInfo.nickname+" 邀请你加入圈子 '"+circle.circleName+"'!"}
            ,{type:"circleInvitation",circleId:circle.circleId,'from.userId':userId,'to.userId':data[i].userId}
        )
      }
      return DataHand.Sdata("get","new_sysNotice"
          ,{type:"circleInvitation",circleId:circle.circleId,from:{userId:userId,nickname:userInfo.nickname},to:data[i],time:new Date(),message:userInfo.nickname+" 邀请你加入圈子'"+circle.circleName+"'!"}
          ,{type:"circleInvitation",circleId:circle.circleId,'from.userId':userId,'to.userId':data[len-1].userId}
      )
    }



    services.defriend=function(userId){
      //lahei一个联系人
      //return $http({url:''});

      return DataHand.Sdata("get","def_friend",{'friends.$.status':"-1"},{userId:window.userId,'friends.userId':userId})
    }
    /*
    *当前行业
    * */
    services.getTrade=function(){
      //由于数据格式一样 我为了节约时间就用同样的json了
      return system.httpGet('./testData/activitySelectTypeData.json');;
    }

    /*
    * 当前职能
    * */
    services.getOccupation=function(){
      return system.httpGet('./testData/activitySelectTypeData.json');
    }
    /*
    * 擅长技能
    * */
    services.getBeGoodAt=function(){
      return system.httpGet('./data/beGoodAtSelectTypeData.json');
    }
    /*
    * 兴趣爱好
    * */
    services.getInterest=function(){
      return system.httpGet('./data/interestSelectTypeData.json');
    }

    /*
    * 语言能力
    * */
    services.getLanguage=function(){
      return system.httpGet('./testData/languageSelectTypeData.json');
    }

    /*
    * 更新用户隐私配置 每次点击执行
    * */
    services.updateUserConfig=function(config){
      //{位置隐身可见: false, 基本信息可见: false, 个人简历可见: false}
      console.log(config);

      DataHand.Sdata("get","update_user_info",{config:config},{userId:window.userId});

    }

    /*
    * 更新用户信息
    * key对应getAllUserInfo左边
    * value对应getAllUserInfo右边的值
    * */
    services.updateUserInfo=function(key,value,sub){
        var data = {};
      //sub 属性仅在 workExperience userProjectExperience userEducationalBackground
      if(sub=='new'){
        //新增一个经验
        data[key]= value;
        return DataHand.Sdata("get","updatePush_user_rRecord",data,{userId:window.userId});
      }
      else if(sub==""||sub==undefined) {
        //更新属性
        data[key] = value;
        try{
          window.userInfo[key] = value;
        }catch (err){
          console.log(err);
        }
        return DataHand.Sdata("get","update_user_info",data,{userId:window.userId});
      }else {
        delete value.$$hashKey;
        //更新一个经验
        key = key+'.'+sub;
        data[key] = value;
        console.log(data[key],key)
        return DataHand.Sdata("get","update_user_rRecord",data,{userId:window.userId})
      }
      console.log(key,value,'window.userInfo_数据更新...');
    }
    /*
    * 添加好友
    * */
    services.addFriends=function(data,applyUser){
      return DataHand.Sdata("get","new_sysNotice"
          ,{type:"userApplyFriend",from:{userId:window.userId,nickname:window.userInfo.nickname},to:{userId:applyUser.userId,nickname:applyUser.nickname},time:new Date(),message:window.userInfo.nickname+" 发出好友申请!"}
          ,{type:"userApplyFriend",'from.userId':window.userId,'to.userId':applyUser.userId}
      )
    }

    //同意好友申请
    services.agreeFriendApply=function(apply,status){
      console.log(apply)
      var applyUser = apply.from.userId;
      DataHand.Sdata("get","new_sysNotice"
          ,{type:"agreeFriendApply",from:{userId:window.userId,nickname:window.userInfo.nickname},to:{userId:applyUser,nickname:""},time:new Date(),message:window.userInfo.nickname+" 同意你的申请!"}
          ,{type:"agreeFriendApply",'from.userId':window.userId,'to.userId':applyUser}
      )
 /*     DataHand.Sdata("get","update_sysNotice",{'status':status,type:"agreeFriendApply"}
          ,{'id':apply.id,userId:window.userId}
      )*/
      DataHand.Sdata("get","update_a_sysNotice",{'status':status},{'id':apply.id,userId:window.userId})
      return DataHand.Sdata("get","add_friend",{userId:applyUser},{userId:window.userId});

    }




    services.getFriends=function(searchText){
      /*
      * {
       "W"://代表这组数据的字母排序
         [
           {
           "heardPhotoUrl": "",//头像
           "nickname": "序列",//昵称
           "userId": ""//用户唯一id
           }
         ]
       }
       ]
      * */
      //return system.httpGet('./testData/userFriends.json');
      return DataHand.Sdata("get", "get_friend",{},{userId:window.userId,'friends.status':{$ne:"-1"}})
    }

    services.getAllUser=function(searchText){
      var data = {};
      if(searchText){
        data = {"nickname": {$regex: searchText||"", $options:'i'}}
      }else{
        data = {userId:window.userId}
      }
      console.log(userId)
      return DataHand.Sdata("get", "get_all_user",{userId:1,sex:1,area:1,nickname:1,headUrl:1},data)
    }
    /*
    * 我参与的
    * */

    services.partake={
      getActivity:function(){
        //活动
        //return system.httpGet('./testData/partakeActivity.json');
        return DataHand.Sdata("get","get_participate_item",{type:"activities"},{userId:window.userId});
      },
      getToHire:function(){
        //才聘
        /*
        *
        * [
         {
         "title":"数据分析",//标题
         "time":"2016-1-2",//时间
         "address":"北京-海淀区",//地区
         "company":"阿里巴巴",//公司名称
         "salary":"10-20万"//薪资待遇
         }
         ]
        * */
        //return system.httpGet('./testData/partakeToHire.json');
        return DataHand.Sdata("get","get_participate_item",{type:"hires"},{userId:window.userId});
      },
      getInvestigate:function(){
        //return system.httpGet('./testData/partakeInvestigate.json');
        return DataHand.Sdata("get","get_participate_item",{type:"investigations"},{userId:window.userId});
      },
      getInformation:function(){
        //信息
        //return system.httpGet('./testData/partakeInformation.json');
        return DataHand.Sdata("get","get_participate_item",{type:"informations"},{userId:window.userId});
      }
    };

    /*
    * 我发布的
    * */
    services.publish={
      getActivity:function(){
        //活动
        /*
         *
         *
         *<--数据格式-->
         [
         {
         "title":"骑在路上",//标题
         "phoneUrl":"http://h.hiphotos.baidu.com/image/h%3D200/sign=a28cdfce86cb39dbdec06056e01609a7/8ad4b31c8701a18bf89ea96b992f07082838fe99.jpg",//头像地址
         "time":"02月15日(周一)16:00 ",//活动时间
         "address":"上海市 徐汇区 越界创业中心",//活动地址
         "price":"100",//活动价格
         "applicants":"100",//报名人数
         "status":false//状态 true 进行中 false 已经结束
         }
         ]
         *
         * */
        //return system.httpGet('./testData/partakeActivity.json');
        return DataHand.Sdata("get","get_u_activity",{},{userId:window.userId});
      },
      getToHire:function(){
        //才聘
        /*
         *
         * [
         {
         "title":"数据分析",//标题
         "time":"2016-1-2",//时间
         "address":"北京-海淀区",//地区
         "company":"阿里巴巴",//公司名称
         "salary":"10-20万"//薪资待遇
         }
         ]
         * */
        //return system.httpGet('./testData/partakeToHire.json');
        return DataHand.Sdata("get","get_u_hire",{},{userId:window.userId});
      },
      getInvestigate:function(){
        //调查
        /*
         *
         *
         * [
         {
         "source":"捷豹汽车",//调查来源
         "startTime":"2016-02-18 14:23",//发布时间
         "moneyReward":"2.00",//悬赏
         "endTime":"2016-02-22 00:00",//截止时间
         "alreadyPortion":"79",//已经答卷分数
         "maxPortion":"300"//全部份数
         }
         ]

         * */
        //return system.httpGet('./testData/partakeInvestigate.json');
        return DataHand.Sdata("get","get_u_invest",{},{userId:window.userId});
      },
      getInformation:function(){
        //信息
        //return system.httpGet('./testData/partakeInformation.json');
        return DataHand.Sdata("get","get_u_info",{},{userId:window.userId});
      }
    };


    services.getCircle = function(type){
      //return system.httpGet('./testData/myCircle.json');
      return DataHand.Sdata("get","get_circle",{type:type},{userId:window.userId})
    }
    /*
    * 用户反馈提交
    * */
    services.userCoupleBackSubmit=function(data){
      console.log(data)
      /*
      * {
      *   phone:"",//手机号码
      *   text:""//文本信息
      * }
      * */
      data.userId = userId;
      data.creator = userInfo;
      return DataHand.Sdata("get","new_inform",data,{})
    }
    services.getFellowInfo=function(userId){
      //return system.httpGet('./testData/issuerUserIfo.json');
      return DataHand.Sdata("get","get_user_basic",{},{userId:userId})
    }
    /*
    * 新增部分
    * */
    services.deleteUndergoItem=function(type,index){
      console.log('删除一个'+type+'下标'+index);
      return $http({url:''});
    }
    services.getPublishData=function(type,id){
      return $http({url:''});
    }
    services.deleteItem=function(type,id){
      return $http({url:''});
    }
    services.getExamineAndVerify=function(id,type){
      return DataHand.Sdata("get", "get_activity_detail",{signUpRecord:1},{id:id,userId:window.userId})
    }


    services.getSignInPersonnel=function(id){

      return DataHand.Sdata("get", "get_activity_item",{type:"signInRecord"},{id:id,userId:window.userId})
    }


    services.getActivityEvaluation=function(id){

      return DataHand.Sdata("get", "get_activity_evaluate",{"evaluationRecord":1},{id:id,userId:window.userId})
    }

    services.delActivity=function(partake){
      //删除一个活动
      return DataHand.Sdata("get","delete_publish_item",{type:"activities"},{id:partake.id,userId:window.userId})
    }
    services.delToHire=function(partake){
      //删除一个才聘
      //return $http({url:''});
      return DataHand.Sdata("get","delete_publish_item",{type:"hires"},{id:partake.id,userId:window.userId})
    }
    services.delInvestigate=function(partake){
      //删除一个调查
      return DataHand.Sdata("get","delete_publish_item",{type:"investigations"},{id:partake.id,userId:window.userId})
    }
    services.delInformation=function(partake){
      //删除一个信息
      return DataHand.Sdata("get","delete_publish_item",{type:"informations"},{id:partake.id,userId:window.userId})
    }
    services.delCircle=function(partake){
      //删除一个圈子
      return DataHand.Sdata("get","delete_publish_item",{type:"circles"},{id:partake.id,userId:window.userId})
    }
    services.ask=function(type,param,uId){
      var id = param.id;
      var activityName = param.activityName;
      var result = "";
      if(type=='1'){
        result = "通过";
      }else if(type=='-1'){
        result="拒绝";
      }
      DataHand.Sdata("get","new_sysNotice"
          ,{type:"activityApplyVerify",activityId:id,from:{userId:userId,nickname:userInfo.nickname},to:{userId:uId,nickname:""},time:new Date(),message:"活动"+activityName+"发起者"+result+"你的报名申请!"}
          ,{type:"activityApplyVerify",activityId:id,'from.userId':userId,'to.userId':uId}
      )

      return DataHand.Sdata("get","update_activity_verify",{'signUpRecord.$.status':type},{id:id,'signUpRecord.userId':uId})
    }


    services.getCandidates=function(id){
/*      var data=[
        {
          userId:'',
          company:"",//所在公司
          time:"",//应聘时间
          name:"",
          heardPhotoUrl:''
        }
      ]
      return $http({url:""});*/
      return DataHand.Sdata("get","get_hire_candidates",{},{id:id});
    }

    services.getpSysNotice = function(type) {
      return DataHand.Sdata("get","get_all_psysNotice", {'sysNotice.$':1},{'userId':window.userId,'sysNotice.type':"userApplyFriend"});
    }
      services.getSysNotice = function(type) {
          return DataHand.Sdata("get","get_all_sysNotice",{},{'to.userId':window.userId||'undefinedUserFromTina',type:type});
      }

    services.getAnswerDetails=function(id){
      return DataHand.Sdata("get","get_invest_statistics",{record:1,questions:1},{id:id});
    }
    services.getSchoolName=function(){
      return system.httpGet('./data/school.json',{cache:true});
    }
    services.getSpecialty=function(){
      return system.httpGet('./data/specialty.json',{cache:true});
    }
    services.startSignIn=function(id,status){
      var param = {activityName:''};

      return DataHand.Sdata("get","start_signIn"
          ,{'signInStatus':status,type:"startActivitySignIn",activityId:id,from:{userId:userId,nickname:userInfo.nickname},to:{},time:new Date(),message:" 你有一个活动开始签到啦 '"+param.activityName+"'!"}
          ,{type:"startActivitySignIn",activityId:id,'to.userId':''}
      )
      //return DataHand.Sdata("get","start_signIn",{'signIn.startSignIn':status},{type:"activities",id:id});
    }

    services.getFriendsUrl=function(){
      //这里我目前是这样写 你写的时候直接等于地址就好了 这个地址后面会加上查询参数
      return system.httpGet('./testData/addressList.json');
    }
    return services;
  })


