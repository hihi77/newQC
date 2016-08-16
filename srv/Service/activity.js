/**
 * Created by yeshuijuan on 16/3/3.
 */

var user  = require('./users');
var async = require('async');
exports.newactivity = function(db,data,param,res) {

  var collection = db.collection('activities');
  var id = new Date().getTime().toString();
  data.id = id;
  data.signIn={startSignIn:false};
  collection.insertOne(data ,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  });
//res.send('newuser');
}


exports.get_all_activities = function (db,data,param,res) {
  var collection = db.collection('activities');
  collection.find(param,data).toArray(function (err,result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  })
}

exports.update_activity_verify = function(db,data,param,res){

  var collection = db.collection('activities');
  var par = {id:param.id};
  console.log(param,data)
  collection.update(param,{$set:data},function(err,result){
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      collection.update(par,{$addToSet:{verifiedApplicant:param['signUpRecord.userId']}},function(err,result){
      if(err)
        {
          console.log('Error:'+ err);
          return;
        }else{
          console.log(result);
          res.send(result);
          //db.close();
        }
      })
    }
  })
}

exports.update_activity_signIn = function(db,data,param,res){

  var collection = db.collection('activities');
  var par = {id:param.id};
  collection.update(param,{$set:data},function(err,result){
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      console.log(param)
      param['signUpRecord.userInfo'].date = new Date();
      collection.update(par,{$addToSet:{signInRecord:param['signUpRecord.userInfo']}},function(err,result){
      if(err)
        {
          console.log('Error:'+ err);
          return;
        }else{
          console.log(result);
          res.send(result);
          //db.close();
        }
      })
    }
  })
}

exports.get_activity_edit = function(db,data,param,res)
{
  var collection = db.collection('activities');
  collection.find(param,data).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    console.log(result[0]);
    res.send(result[0]);
    //db.close();
  });

}

/*exports.get_activity_evaluate = function(db,data,param,res)
{
  var collection = db.collection('activities');
  collection.find(param,{evaluationRecord:1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
/!*      if(result[0]){
        var len = result.length;
        for(var i=0;i<len;i++){
          
        }
      }*!/
      console.log(result[0]);
      res.send(result[0]);
      //db.close();
    }
  });

}*/


exports.get_activity_item = function(db,data,param,res)
{
  var type = data.type;
  switch(type){
    case "signInRecord":
    getRecord({signInRecord:1,signIn:1},"signInRecord");
    break;
    case "evaluationRecord":
      getRecord({evaluationRecord:1},"evaluationRecord");
      break;
    default:
    console.log("Invalid!");
  }

  function getRecord(condition,item){
    var collection = db.collection("activities");
    collection.find({id:param.id},condition).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      res.send(result[0]);
      //db.close();
    }
    });
 }
}


exports.get_activity_evaluate = function(db,data,param,res)
{
    var collection = db.collection("activities");

    collection.find({id:param.id},data).toArray(function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else{
        if(result[0]){

          try{
            var rData = result[0].evaluationRecord||[];

            var rResult = {};
            rData.map(function(noe){
              var data = noe['data'];
              for(var item in data){
                if(!rResult[item]){
                  rResult[item] = {};
                }

                data[item].map(function (nof) {
                  var index = nof['activityIndex']||nof['giveLessonsIndex']
                   if(!rResult[item][nof['text']]){

                     rResult[item][nof['text']] = [index];
                   }else{
                     rResult[item][nof['text']].push(index);
                   }
                })
              }
            })
            for(var x in rResult){
              for(var y in rResult[x]){
                var i=0;
                rData[0].data[x].map(function (nn) {
                  if(nn['text']==y){
                    console.log('i',rData[0].data[x][i]);
                    !((rData[0].data[x][i]['activityIndex']=='')||(rData[0].data[x][i]['activityIndex']==undefined))?rData[0].data[x][i]['activityIndex'] =rResult[x][y]:rData[0].data[x][i]['giveLessonsIndex'] =rResult[x][y];
                  }
                  i++;
                })
              }
            }
          }
          catch (err){
            console.log(err);
          }
          if(rData[0]){
            try{
              res.send(rData[0].data);
              //db.close();
            }catch(err){
              console.log(err);
              res.send({});
              //db.close();
            }

          }else{
            res.send({});
            //db.close();
          }

        }

      }
    });
}

exports.get_activity_detail = function(db,data,param,res)
{
  var collection = db.collection('activities');
  collection.find({id:param.id},data).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      var Model = result[0];
      collection.find({id:param.id,signUpRecord:param.userId},data).toArray(function(err,result){
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }
        else{
          if(result[0]){
            Model.isSignUp = 1;
          }
          res.send(Model);
          //db.close();
        }
      })
    }
  });

}

exports.get_activity_area = function(db,data,param,res)
{
  var collection = db.collection('activities');
  var types =[
    "培训",
  "沙龙",
  "游学",
  "私董",
  "论坛",
  "读书",
  "会议",
  "展会",
  "户外",
  "公益",
  "其他"
  ];
  var resultDataAll = [];
  var resultData = [];
  //var area = param.address;
  //param.address = { $regex: area, $options: 'i' };
  var param = {
    draflag:'1',
    circleId:{$exists: false}
  };
  var openPar = {
    draflag: '1',
    circleId: { '$exists': true },
    eventProperty: '公开'
  };

  var iterator = function(item,callback){
    param.type = item;
    openPar.type = item;
    collection.find({$or:[openPar,param]},{images:1,id:1,title:1,type:1,phoneUrl:1,eventDetails:1,activityStartTime:1,activityEndTime:1,address:1,price:1,evaluationRecord:1}).toArray(function(err, result) {
    callback(null,result);
  });
  }
  async.map(types,iterator,function(err,results){
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
      var len = results.length;
      for (var i=0; i<len; i++){
        var item = {type:types[i],data:results[i]};
        resultDataAll.push(item);
      }
      console.log(resultDataAll);
      res.send(resultDataAll);
      //db.close();
  });
}


exports.submit_activity_rRecord = function(db,data,param,res)
{
  var rdata = data;
  console.log('data.type:'+data.type)
  var collection = db.collection('activities');
  switch (data.type) {
    case "evaluation":
      updateRecord({evaluationRecord:rdata},{evaluationNumber:""});
      break;
    case "signUp":
      updateRecord({signUpRecord:rdata},{signUpSuccess:""});
      break;
    case "signIn":
      updateRecord({signInRecord:rdata},{signInSuccess:""});
      break;
    default:
      res.send('非法请求');
  }

  function updateRecord(rData,count){
    collection.update(param,{$addToSet:rData},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
        collection.find(param,{id:1,title:1,type:1,phoneUrl:1,time:1,address:1,price:1,signUpSuccess:1,evaluationNumber:1}).toArray(function(err,result){
            if(result[0]){
          for(var item in count){
              count[item] = (result[0][item]?result[0][item]:0)+1;
              result[0][item] = count[item];
            }
        }
            var results = {};
            results.id = result[0].id;
            collection.update(param,{$set:count},function(err,result){
              if(err){
                console.log('Error:'+ err);
                return;
              }else{
                user.update_user_partake(db,"activity",results,{userId:data.userId});  
              }
           })
        
      })    
    }
   res.send(result);
  });
  }
}


exports.get_activity_registAdditModel = function(db,data,param,res)
{
  var collection = db.collection('activities');
  collection.find(param,{registrationAdditional:1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else if(result){
      var bt = result[0]?result[0].registrationAdditional:[];
      var len = bt.length;
      var rResult = [];
      for (var i=0;i<len;i++){
        if(bt[i].checkBox==true){
          rResult.push(bt[i])
        }
      }
    }else rResult=[];
    res.send(rResult);
    //db.close();
  });

}

exports.get_activity_evaluationModel = function(db,data,param,res)
{
  var collection = db.collection('activities');
  collection.find(param,{activitySatisfaction:1,courseSastisfaction:1}).toArray(function(err, result) {
    var rData = {};
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else if(result){
      var rData = {};
      var bt = result[0].activitySatisfaction,
          at = result[0].courseSastisfaction;

      var len = bt?bt.length:0;
      var rResult = [],
          aResult = [];
      for (var i=0;i<len;i++){
        if(bt[i].checkBox==true){
          rResult.push(bt[i])
        }
      }
      rData.activity = rResult;
      len = at?at.length:0;
      for (var i=0;i<len;i++){
        if(at[i].checkBox==true){
          aResult.push(at[i])
        }
      }
      rData.courseSastisfaction = aResult;
      
    }
/*    rdata.activity = result[0]?result[0].activitySatisfaction:[];
    rdata.giveLessons = result[0]?result[0].courseSastisfaction:[];
*/
    res.send(rData);
    //db.close();
  });

}

exports.get_u_activity = function(db,data,param,res)
{
  var collection = db.collection('activities');
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

