/**
 * Created by yeshuijuan on 16/3/3.
 */
var numbers = require('numbers');
var user  = require('./users');
var async = require('async');
exports.newinvest = function(db,data,param,res) {
  if(data){
  var id = new Date().getTime().toString();
  //var id = new Date().getTime()+data.userId;
  data.id = id;
  data.startTime = new Date();
    data.alreadyPortion = 0;
  var collection = db.collection('investigations');
  collection.insert(data ,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  });
}
  
//res.send('newuser');
}


exports.get_invest_detail = function(db,data,param,res)
{
  var collection = db.collection('investigations');
  if(!param.id){
    param.id = "emptyInvestigation";
  }
  collection.find(param).toArray(function(err, result) {
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


exports.get_invest_answer = function(db,data,param,res)
{
  var collection = db.collection('investigations');
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


exports.get_invest_statistics = function(db,data,param,res){
  var collection = db.collection('investigations');
  collection.find(param,{record:1,questions:1}).toArray(function(err,result){
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      var rRecord;
      if(result[0]){
        var record = result[0].record||[];
        var len = 0;
        if(record[0]){
          len = record[0].length;
        }     
        var jlen = record.length;
        var aRecord = [];
        for(var r=0;r<len;r++){
          aRecord.push([]);
        }
        for(var j=0;j<jlen;j++){
          for(var i=0;i<len;i++){
            aRecord[i].push(record[j][i]);
          }
        }
        function addMatrix(a,b){
          try{
            var result = numbers.matrix.addition(a,b);
            return result;
          }
          catch(e){
            return a;
          }
          
        }
        for(var x=0;x<len;x++){
          if(typeof aRecord[x][0] =="object"&&aRecord[x][0]){
            console.log('ff:',aRecord[x])
            aRecord[x] = aRecord[x].reduce(addMatrix);
          }
        }
        res.send(aRecord);
      }
    
    }
  })

}



exports.get_invest_model = function(db,data,param,res)
{
  console.log(param)
if(!param.userId){
  param.userId = 'undefinedUserIdByTina';
}
  var collection = db.collection('investigations');
  if(!data){
    data={title:1,userId:1,source:1,startTime:1,moneyReward:1,endTime:1,alreadyPortion:1,maxPortion:1,questions:1,questdes:1,respondents:1}
  }
  collection.find({id:param.id},data).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      var Model = result[0]||{};
      Model.isRespondent = 0;
      collection.find({id:param.id,respondents:param.userId},{respondents:1}).toArray(function(err,result){
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }
        else{
          if(result[0]){
            Model.isRespondent = 1;
          }
          res.send(Model);
          //db.close();
        }
      })
    }

  });

}

exports.get_u_invest = function(db,data,param,res)
{
  var collection = db.collection('investigations');
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

exports.get_info_byType = function(db,data,param,res)
{
  var collection = db.collection('investigations');
  var types =["行业问卷", "管理问卷","市场调查","企业调查","生活休闲","测评研究","其它"];
  var resultDataAll = [];
  var resultData = [];
  var iterator = function(item,callback){
    param.type = item;
    collection.find(param,{id:1,startTime:1,endTime:1,title:1,maxPortion:1,moneyReward:1}).toArray(function(err, result) {   
    callback(null,result);
  });
  }
  async.map(types,iterator,
  function(err,results){
      if(err)
      {console.log('Error:'+ err);
      return;}
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

exports.submit_invest_rRecord = function(db,data,param,res)
{  

  var userInfo = {"userId":data.userId};
  var collection = db.collection('investigations');
  switch (data.type) {
    case "investRecord":
      updateRecord({record:data.data,respondents:data.userId},{alreadyPortion:0});
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
        collection.find(param,{id:1,startTime:1,endTime:1,moneyReward:1,maxPortion:1,source:1,alreadyPortion:1,record:1}).toArray(function(err,result){
        var alreadyPortion = result[0].record.length;
          result[0].alreadyPortion = parseInt(alreadyPortion?alreadyPortion:0)+1;
        var results = {};
        results.id = result[0].id;
        collection.update(param,{$set:{alreadyPortion:alreadyPortion}},function(err,result){
          if(err){
            console.log('Error:'+ err);
            return;
          }else{
            user.update_user_partake(db,"investigation",results,{userId:data.userId}); 
            res.send(result);
          }
        })
      })
    }
  });
    }
}

