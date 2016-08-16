/**
 * Created by yeshuijuan on 16/3/3.
 */

var async = require('async');

exports.get_index_detail = function(db,data,param,res)
{

  var userLocals = res.locals||{};
  var userFunction = (userLocals.currentFunction||[])[0];
  var userTrade = (userLocals.currentTrade||[])[0];
  var n = 5;
  var resultall = {};
  var len;
  var collection = db.collection('hires');
  if(0){
    param = {
      draflag:'1',
      circleId:{$exists: false},
      $or:[{"industry": {$regex: userTrade, $options:'i'}},{"responsibility": {$regex: userFunction, $options:'i'}}]
    }
  }else{
    param = {
      draflag:'1',
      circleId:{$exists: false}
    }
  }

  console.log(param)
  collection.find(param,{createTime:1,id:1,time:1,address:1,company:1,salary:1,responsibility:1,profession:1}).sort({createTime:-1}).limit(n).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      resultall.toHireData = result;
      collection = db.collection("activities");
      var openPar = { draflag: '1',
      circleId: { '$exists': true },
      eventProperty: '公开' };
      collection.find({$or:[openPar,param]},{location:1,eventDetails:1,id:1,title:1,activityStartTime:1,activityEndTime:1,images:1,address:1,signUpSuccess:1,price:1,phoneUrl:1}).sort({createTime:-1}).limit(n).toArray(function(err, result){
        if(err){
          console.log('error:'+err);
          return;
        }else{
          len = result.length;
          for(var i=0;i<len;i++){
            //result[i].phoneUrl = result[i].images[0]?result[i].images[0].tsrc:"";
            result[i].time = result[i].activityTime +'-'+result[i].endTime;
          }
          resultall.activityData = result;
          collection = db.collection("informations");
          collection.find(param,{createTime:1,userId:1,creator:1,id:1,images:1,headPhotoUrl:1,name:1,title:1,text:1,endTime:1,des:1,browseNumber:1,commentNumber:1,alikeNumber:1}).sort({createTime:-1}).limit(n).toArray(function(err, result){
            if(err){
              console.log('error:'+err);
              return;
            }else{
              resultall.informationData = result||[];
              resultall.informationData.map(function(data){
                var userId = data.userId;
                collection = db.collection("users");
                collection.find({userId:userId},{userId:1,headUrl:1,nickname:1}).toArray(function (err,res) {
                  //console.log('??:',res)
                  if(res) {
                    data.creator = res[0] || data.creator;
                  }
                })
              })
              var nowDate = new Date();
              //param.endTime = {$gt:nowDate};
              //console.log(param)
              collection = db.collection("investigations");
              collection.find(param,{title:1,id:1,source:1,startTime:1,endTime:1,moneyReward:1,alreadyPortion:1,maxPortion:1}).sort({createTime:-1}).limit(n).toArray(function(err,result){
                if(err){
                  console.log('error:'+err);
                  return;
                }else{
                  resultall.investigateData = result||[];
                  function filtertime(item){
                     return (new Date(item.endTime)>nowDate);
                  }
                  resultall.investigateData = resultall.investigateData.filter(filtertime)
                  res.send(resultall);
                  ////db.close();
                }
              })
            }
          })
        }
      })
    }
  });
}


exports.search_specialist = function(db,data,param,res)
{

  var collection = db.collection("users");
  //console.log(param.param||[])
  collection.find({goodSkill:{$in:param.param}}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
  });
}


