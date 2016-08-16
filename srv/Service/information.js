/**
 * Created by yeshuijuan on 16/3/3.
 */
var user  = require('./users');
var async = require('async');
exports.newinfo = function(db,data,param,res) {
  var id = new Date().getTime().toString();
  //var id = new Date().getTime()+data.userId;
  data.id = id;
  data.createTime = new Date();
  var collection = db.collection('informations');
  collection.insert(data ,function(err, result) {
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


exports.get_info_detail = function(db,data,param,res)
{
  console.log(param);
  var collection = db.collection('informations');
  collection.find(param,data).toArray(function(err, result) {
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

exports.submit_info_rRecord = function(db,data,param,res)
{
  var userInfo = data.UserInfo;
  var collection = db.collection('informations');
  switch (data.type) {
    case "alike":
      updateRecord({alikeRecord:userInfo},{alikeNumber:0});
      break;
    case "browse":
      updateRecord({browseRecord:userInfo},{browseNumber:0});
      break;
    case "comment":
      updateRecord({commentInfo:data},{commentNumber:0});
      break;
    default:
      res.send('非法请求');
  }

  function updateRecord(rData,count){
    collection.update(param,{$push:rData},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      collection.find(param).toArray(function(err,result){
        var results = {};
        if(result.length>0){
          for(var item in count){
          count[item] = (result[0][item]?result[0][item]:0)+1;
          result[0][item] = count[item];
          }
          results.id = result[0].id;
        }

        collection.update(param,{$set:count},function(err,result){
          if(err){
            console.log('Error:'+ err);
            return;
          }else{
            user.update_user_partake(db,"information",results,{userId:data.userId}); 
          }
          res.send(result);
        })
      })
    }
  });
 }
}



exports.get_info_byType = function(db,data,param,res)
{
  var collection = db.collection('informations');
  var types =["sos", "分享","产品","投资","招标","其它"];
  var resultDataAll = [];
  var resultData = [];
  var iterator = function(item,callback){
    param.type = item;
    collection.find(param,{userId:1,creator:1,images:1,des:1,id:1,title:1,type:1,phoneUrl:1,time:1,address:1,price:1,alikeNumber:1,commentNumber:1,browseNumber:1}).toArray(function(err, result) {

      if(err){
        console.log(err)
      }else{
        var rResult = result||[];
        rResult.map(function (data) {
        collection = db.collection("users");
        collection.find({userId:data.userId},{userId:1,nickname:1,headUrl:1}).toArray(function(err,res){
          if(res){
            data = res[0]||data.creator;
          }
          console.log('userid:',data.userId)
          console.log('res:',res)
          console.log('r!!!!!!:',data)
        })
      })
        callback(null,rResult);///////here!!
      }
  });
  }
  async.map(types,iterator,
  function(err,results){
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
      res.send(resultDataAll);
      //db.close();
  });
}


exports.get_u_info = function(db,data,param,res)
{
  var collection = db.collection('informations');
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
