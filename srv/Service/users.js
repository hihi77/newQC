var IM = require('./rongIM');
var async = require('async');
exports.newuser = function(db,data,param,res) {
  data.userId = data.userId.toString()||new Date().getTime().toString();
  //data.token = IM.fetchToken(data.userId,data.nickname);
  data.participate = {};
  data.basicinfo = {nickname:""};
  data.projectExperience = [];
  data.workExperience = [];
  data.educationalBackground=[];
  data.sysNotice = [];
  data.messages = [];
  data.messageBadge = 0;
  data.headUrl = "./img/default/head.png";
  data.config = {位置隐身可见: false, 基本信息可见: false, 个人简历可见: false};
  var collection = db.collection('users');
  collection.find({phone:data.phone||""}).toArray(function (err,rest) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else if(!rest[0]){
      collection.insertOne(data ,function(err, result) {
        if(err)
        {
          console.log(err);

        }else{
          //req.session.userId = data.userId;
          //req.session.userName = data.nickname;
          //console.log(result)
          res.send({result:{ok:1}});
        }

        //db.close();
      });
    }
  })
//res.send('newuser');

}



exports.get_all_user = function(db,data,param,res)
{
  var collection = db.collection('users');
  //console.log(param)
  collection.find(param,{friends:1}).toArray(function(err,result){
    if(err){
      console.log('err:',err);
      return;
    }else{
      var friend = result[0]?(result[0].friends||[]):[];
      friend.push(param.userId);
      collection.find({"userId":{"$nin":friend}},data).toArray(function(err,result){
        if(err){
          console.log('Error:'+ err);
          return;
        }else{
          console.log(result)
          result=result||[];
          result.map(function(user){
            if(user.headUrl == "./img/default/default_headUrl.png"){
              user.headUrl = "http://www.caishangll.com:8081/uploads/head.png"
            }
          })
          res.send(result);
        }
      })
    }
  })

}


exports.delete_publish_item = function(db,data,param,res)
{
  var type = data.type;
  console.log(type)
  var par1 = {id:param.id};
  var par2 = {userId:param.userId};
  var collection = db.collection(type);
  collection.remove(par1,function(err,result){
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      collection = db.collection('users');
      res.send(result);
      //db.close();
    }
  })
}

exports.update_publish_item = function(db,data,param,res)
{
  var type = param.type;
  var par1 = {id:param.id};
  var collection = db.collection(type);
  collection.update(par1,{$set:data},function(err,result){
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      res.send(result);
      //db.close();
    }
  })
}

exports.start_signIn = function(db,data,param,res)
{
  var collection = db.collection('activities');
  collection.findOneAndUpdate({id:param.activityId},{$set:{'signIn':{startSignIn:data['signInStatus']}}},function(err,result){
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      if(result.value){
        console.log(result.value);
        var activityTitle = result.value.title;
        var toUsers = result.value.verifiedApplicant||[];
        console.log(toUsers)
        //给所有活动成员发送开始签到消息
        if(data['signInStatus']){


          data.notice_mark =  new Date().getTime().toString();
          collection = db.collection('systemNoticification');
          var rData = [];


          var iterator = function (user, callback) {
            param['to.userId'] = user;
            param.status = 0;
            data.status = 0;
            data.to = {};
            data.to.userId = user;
            data.id = new Date().getTime().toString();
            rData.push(JSON.parse(JSON.stringify(data)));
            var num = 1;
            var param1 = JSON.parse(JSON.stringify(param));
            //if notice already exist(status:0) and remain unread, set (status=3) and make allSysNotice-unreadNumber(1)
            param1.status = 2;
            collection.count(param,function(err,number){
              num = num - number;
              collection.updateMany({$or:[param,param1]},{$set:{status:3}},function(err,result){
                if (err) {
                  console.log('Error:' + err);
                  return;
                } else {
                  collection = db.collection('users');

                  collection.updateOne({"userId":user},{$inc:{allSysNotice:num}}, function (err,result) {
                    if(err)
                    {
                      console.log('Error:'+ err);
                      return;
                    }
                    callback(null,result);
                  })

                }
              })
            })
          }
          async.map(toUsers, iterator, function (err, results) {
            if (err) {
              console.log('Error:' + err);
              return;
            }
            collection = db.collection('systemNoticification');
            collection.insertMany(rData, function (err, result) {
              if (err) {
                console.log('Error:' + err);
                return;
              } else {
                res.send(results);
                //db.close();
              }
            })

          });
        }
        else {
          res.send(result);
          //db.close();
        }
      }
    }
  })
}



exports.update_user_partake = function(db,type,data,param)
{
  switch(type){
    case "activity":
      updateRecord({"participate.activity":data});
      break;
    case "hire":
      updateRecord({"participate.hire":data});
      break;
    case "investigation":
      updateRecord({"participate.invest":data});
      break;
    case "information":
      updateRecord({"participate.information":data});
      break;
    case "circle":
      updateRecord({"participate.circle":data});
      break;
      defalt:
          console.log('Invalid!');
  }

  function updateRecord(data){
    console.log(param,data)
    var collection = db.collection('users');
    collection.update(param,{$addToSet:data},function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else console.log('success');
      //db.close();
    });
  }
}


exports.get_user_basic = function(db,data,param,res)
{
  var collection = db.collection('users');
  if(!param){
    var param = {};
    param.userId = 'undefinedUserByTina';
  }else{
    if(!param.phone&&!param.userId&&!param.openId){
      param.phone = 'undefinedUserByTina';
    }
  }
  collection.find(param,{password:0}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    console.log(result[0])
    res.send(result[0]);
    //db.close();
  });
}



exports.check_user_login = function(db,data,param,res,req)
{
  var collection = db.collection('users');
  if(!param){
    var param = {};
    param.userId = 'undefinedUserByTina';
  }else{
    if(!param.phone&&!param.userId&&!param.openId){
      param.phone = 'undefinedUserByTina';
    }
  }

  collection.find(param,{password:0}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    if(result[0]){
      req.session.userId =  result[0].userId;
      req.session.userName = result[0].nickname;
      req.session.currentTrade = result[0].currentTrade;
      req.session.currentFunction = result[0].currentFunction;
      console.log(req.session)
    }
    res.send(result[0]);
  });
}


exports.refresh_sysNotice = function(db,data,param,res)
{
  var collection = db.collection('users');
  if(!param){
    var param = {};
    param.userId = 'undefinedUserByTina';
  }
  collection.find(param,{messageBadge :1,allSysNotice:1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      var rResult = result[0];
      if(result[0]){
      if(result[0].allSysNotice<0){
        collection = db.collection("systemNoticification");
        collection.count({'to.userId':param.userId,status:0},function (err,number) {
          if(err)
          {
            console.log('Error:'+ err);
            return;
          }else{
            collection = db.collection("users");

            collection.updateOne({userId:param.userId},{$set:{allSysNotice:number}},function(err,result){
              if(err)
              {
                console.log('Error:'+ err);
                return;
              }else{
                rResult.allSysNotice = number;
                res.send(rResult);
                //db.close();
              }
            })

          }
        })
      }else{
        res.send(rResult);
      }
      }else{
        res.send(rResult);
        //db.close();
      }
    }
  });
}

exports.delete_friend = function(db,data,param,res)
{
  var collection = db.collection('users');
  collection.update(param,{$pull:data},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    console.log(result)
    res.send(result);
    //db.close();
  });
}


exports.def_friend = function(db,data,param,res)
{
  var collection = db.collection('users');
  collection.update(param,{$set:data},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  });
}


exports.get_participate_item = function(db,data,param,res)
{

  var type = data.type;
  switch(type){
    case "activities":
      getRecord("participate.activity.id",{id:1,title:1,activityStartTime:1,activityEndTime:1,'eventDetails.images':1,address:1,signUpSuccess:1,price:1,phoneUrl:1});
      break;
    case "informations":
      getRecord("participate.information.id",{id:1,images:1,headPhotoUrl:1,name:1,title:1,text:1,endTime:1,'des':1,browseNumber:1,commentNumber:1,alikeNumber:1});
      break;
    case "hires":
      getRecord("participate.hire.id",{id:1,time:1,address:1,company:1,salary:1,responsibility:1});
      break;
    case "investigations":
      getRecord("participate.invest.id",{id:1,source:1,startTime:1,endTime:1,moneyReward:1,alreadyPortion:1,maxPortion:1});
      break;
    case "circles":
      getRecord("participate.circle.id",{});
      break;
    default:
      console.log("Invalid!");
  }

  function getRecord(condition,par){
    var collection = db.collection('users');
    //console.log(param)
    collection.distinct(condition,param,function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else{
        if(result){
          collection = db.collection(type);
          collection.find({"id":{"$in":result}}).sort({id:-1}).toArray(function(err,result){
            res.send(result);
            //db.close();
          })
        }
      }
    });
  }
}


exports.add_friend = function(db,data,param,res) {
  var collection = db.collection('users');
  collection.updateOne({userId:param.userId},{$addToSet:{friends:data.userId}},function(err,result){
    if(err){
      console.log('err:',err);
    }else {

      collection.updateOne({userId:data.userId},{$addToSet:{friends:param.userId}},function(err,result){
        res.send(result);
        //db.close();
      })
    }
  });

}



exports.get_friend = function(db,data,param,res)
{
  var collection = db.collection('users');

  collection.find(param,{friends:1,_id:0}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{

      var results = result[0]?(result[0].friends||[]):[];
      collection.find({"userId":{"$in":results}},{userId:1,nickname:1,sex:1,phone:1,headUrl:1}).toArray(function(err,result){
        res.send(result);
        //db.close();
        console.log(result);
      })
    }
  });

}


exports.get_user_profile = function(db,data,param,res)
{

  var collection = db.collection('users');
  collection.find(param,{name:1,nickname:1,currentCompany:1,currentFunction:1,headUrl:1,config:1,sysSetting:1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else {
      console.log(result)
      if(result.length>0){
        res.send(result[0]);
        //db.close();
      }
    }
  });

}


exports.update_user_info = function(db,data,param,res)
{
  var collection = db.collection('users');

  collection.updateOne(param,{$set:data},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else {
      collection.find(param).toArray(function(err, result) {
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }
        res.send(result);
        //db.close();
      });
    }
  });

}

exports.updatePush_user_rRecord = function(db,data,param,res)
{
  var type = data.type;
  data.id = new Date().getTime().toString();
  switch(type){
    case "educationalBackground":
      update({educationalBackground:data});
      break;
    case "projectExperience":
      update({projectExperience:data});
      break;
    case "workExperience":
      update({workExperience:data});
      break;
    default:
      console.log('invalid');
  }

  function update(rData){
    var collection = db.collection('users');
    collection.update(param,{$addToSet:rData},'',function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else console.log('success')
      res.send();
      //db.close();
    });
  }
}


exports.update_user_rRecord = function(db,data,param,res)
{
  var type = data.type;
  var recordName = type +'.id';
  param[recordName] = data.id;
  switch(type){
    case "educationExperience":
      update({'educationExperience.$':data});
      break;
    case "projectExperience":
      update({'projectExperience.$':data});
      break;
    case "workExperience":
      update({'workExperience.$':data});
      break;
    default:
      console.log('invalid');
  }

  function update(rData){
    var collection = db.collection('users');
    console.log(param)
    collection.update(param,{$set:rData},function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else console.log('success')
      res.send(result);
      //db.close();
    });
  }
}



exports.updatepulluser = function(db,data,param,res)
{
  var collection = db.collection('users');
  collection.update(param,{$pull:data},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else console.log('success')
    res.send();
    //db.close();
  });

}


