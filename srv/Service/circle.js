exports.add_circle = function(db,data,param,res) {
  //To be replaced with actual userInfo
  var userInfo = data.creator||{};
  data.circleId = new Date().getTime().toString() + '_circle';
  data.members = {
    authority : [],
    common : [],
    leave : []
  };
  if((!data.photoUrl)||(!data.photoUrl.images)) {
    data.photoUrl = {
      "images" : [
        {
          "name" : '1464093378038',
          "src" : "file:///var/mobile/Containers/Data/Application/882E0340-B3AC-4CEE-8E07-E8813CA67E32/tmp/cdv_photo_001.jpg",
          "tsrc" : "./img/default/default_circle.jpg"
        }
      ]
    }
  };
  data.applicant = [];
  data.messages = [];
  data.information = [];
  data.activity = [];
  data.invest = [];
  data.hire = [];
  data.members.authority.push(userInfo.userId);
  data.members.common.push(userInfo.userId);
  var collection = db.collection('circles');
  collection.insert(data, function(err, result) {
    if (err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  });

//res.send('newuser');

}


exports.get_circle_item_detail = function(db,data,param,res){
  var collection = db.collection('circles');
  collection.find(param).toArray(function(err,result){
    if(err){
      console.log('Error:'+err);
      return;
    }
    res.send(result[0]);
    //db.close();
  })

}


exports.delete_circle= function(db,data,param,res){
  var collection = db.collection('circles');
  collection.remove(param,function(err,result){
    if(err){
      console.log('Error:'+err);
      return;
    }
    res.send(result);
    //db.close();
  })

}

/*exports.update_pull_circle_item= function(db,data,param,res){
 var collection = db.collection('circles');
 collection.updateOne({$pull:param},function(err,result){
 if(err){
 console.log('Error:'+err);
 return;
 }
 res.send(result);
 //db.close();
 })

 }*/

exports.find_add_circle_member = function(db,data,param,res) {

  var collection = db.collection('users');
  var userId = data['members.common'];
  collection.find({"$or":[{userId:userId},{nickname:userId}]}).toArray(function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }else if(result.length>0){
      collection = db.collection('circles');
      collection.update(param,{$addToSet:data},function(err, result) {
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }else {
          res.send({result:1});
          //db.close();
        }
      });
    }else {
      res.send({result:0})
      //db.close();
    }
  })
//res.send('newuser');

}


exports.update_circle_rRecord = function(db,data,param,res)
{
  data.id = new Date().getTime().toString()+'_'+param.circleId+'_circle';
  var type = data.type;
  data.startTime = new Date();
  data.circleId = param.circleId;
  //var collection = db.collection('circles');
  switch (type) {
    case "informations":
      updateRecord1(type,{information:data.id});
      break;
    case "investigations":
      updateRecord1(type,{invest:data.id});
      break;
    case "hires":
      updateRecord1(type,{hire:data.id});
      break;
    case "activities":
      updateRecord1(type,{activity:data.id});
      break;
    case "notice":
      updateRecord({notice:data});
      break;
    case "applicant":
      updateRecord({applicant:data});
      break;
    case "complaint":
      updateRecord({complaint:data});
      break;
    case "messages":
      updateRecord({messages:data});
      break;
    default:
      res.send('非法请求');
  }
  function updateRecord1(document,par){
    var collection = db.collection(document);

    collection.insert(data,function(err,result){
      if(err){
        console.log('Error:'+ err);
        return;
      }else{
        collection = db.collection('circles');
        collection.update(param,{$push:par},function(err,result){
          if(err){
            console.log('Error:'+ err);
            return;
          }else{
            res.send(result);
            //db.close();
          }
        })
      }
    })
  }

  function updateRecord(rData){
    var collection = db.collection('circles');
    collection.update(param,{$addToSet:rData},function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
      res.send(result);
      //db.close();
    });
  }
}


exports.update_circle_item = function(db,data,param,res){
  var collection = db.collection('circles');
  collection.update(param,{$set:data},function(err,result){
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  })
}




exports.get_circle_edit = function(db,data,param,res){
  var collection = db.collection('circles');
  collection.find(param,data).toArray(function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }else{
      res.send(result[0]);
      //db.close();
    }
  })
}



//get circle data for page index.html for circle
exports.get_circle_index= function(db,data,param,res) {
  var collection = db.collection('circles');
  var resultData = {};
  var param1 = {
    draflag:'1',
    open:true
  };
  if(param.title){
    param1.title = param.title;
  }
  param.userId = param.userId||"undefinedUserByTina";
  var returnPro = {title:1,circleId:1,photoUrl:1,userId:1,creator:1,describe:1};
  collection.find(param,returnPro).sort({totalMembers:-1}).limit(12).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      resultData.myCircle = result;

      collection.find(param1,returnPro).sort({totalMembers:-1}).limit(12).toArray(function(err,result){
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }else{
          resultData.hotCircle = result;
          collection = db.collection('users');
          collection.find({userId:param.userId},{'participate.circle':1}).toArray(function(err, results) {
            if(err)
            {
              console.log('Error:'+ err);
              return;
            }else{
              if(results[0]){
                var result = results[0].participate.circle||[];

                collection = db.collection('circles');
                collection.find({"circleId":{"$in":result}}).toArray(function(err,result){
                  if(result){
                    console.log(result)
                    resultData.participateCircle = result;
                    res.send(resultData);
                    //db.close();
                  }else{
                    res.send(resultData);
                    //db.close();
                  }
                })
              }else{
                res.send(resultData);
                //db.close();
              }
            }
          });

        }
      })
    }
  })
//res.send('newuser');
}




exports.get_circle_item = function(db,data,param,res)
{
  var type = data.type;
  switch(type){
    case "activities":
      getRecord({activity:1});
      break;
    case "informations":
      getRecord({information:1});
      break;
    case "hires":
      getRecord({hire:1});
      break;

    case "investigations":
      getRecord({invest:1});
      break;
    default:
      console.log("Invalid!");
  }

  function getRecord(condition){
    var collection = db.collection("circles");
    collection.find(param,condition).toArray(function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else{
        if(result[0]){
          for(var key in condition){
            result = result[0][key];
          }
          console.log(result)
          collection = db.collection(type);
          collection.find({"id":{"$in":result}}).toArray(function(err,result){
            res.send(result);
            //db.close();
          })
        }
      }
    });
  }
}



exports.get_circle_items = function(db,data,param,res)
{
  var collection = db.collection('circles');
  console.log(param)
  //param = {'circleId':'1458826340223_circle','applicant.status':'0'}
  collection.find(param,data).toArray(function(err, result) {
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



exports.get_circle_members = function(db,data,param,res)
{
  var collection = db.collection('circles');
  collection.find(param,{userId:1,members:1,'describe.text':1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    var rResult = result[0];
    collection = db.collection('users');
    collection.find({userId:{$in:rResult.members.common}},{userId:1,nickname:1,headUrl:1}).toArray(function(err,result){
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
      rResult.members.common = result;
      rResult.describe = rResult.describe.text;

      collection.find({userId:{$in:rResult.members.authority}},{userId:1,nickname:1,headUrl:1}).toArray(function(err,result){
            if(err)
            {
              console.log('Error:'+ err);
              return;
            }
            var rrResult = [];
            try{
              rResult.members.authority.map(function(item){
                if(item instanceof Object){
                  rrResult.push(item);
                }
              })
            }catch (err){
              console.log(err)
            }
            rResult.members.authority = result;
            rResult.members.authority = rResult.members.authority.concat(rrResult);
            res.send(rResult);
            //db.close();
          }
      )
    })
  });

}


exports.add_circle_members = function(db,data,param,res)
{
  //{'members.common':userId},{circleId:circleId}

  var collection = db.collection('circles');
  collection.update(param,{$addToSet:data,$inc:{'totalMembers':1}},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{

      collection = db.collection('users');
      collection.update({userId:data['members.common']}, {$addToSet:{'participate.circle':param.circleId}},function(err,result){
        if(err){
          console.log('Error:'+ err);
          return;
        }else{
          res.send(result);
          //db.close();
        }
      })
    }

  });

}



exports.apply_circle = function(db,data,param,res){
  var collection = db.collection('circles');
  data.id = new Date().getTime().toString()+'_'+param.circleId+'_circle';
  data.time = new Date();
  if(data.userId){

    collection.find({circleId:param.circleId,'applicant.userId':data.userId}).toArray(function(err,result){
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else{
        if(result.length>0){
          if(!(result[0].flag=='1')){
            collection.update({circleId:param.circleId,'applicant.userId':data.userId},{$set:{'applicant.$':data}},"",function(err,result){
              if(err)
              {
                console.log('Error:'+ err);
                return;
              }else{
                res.send(result);
                //db.close();
              }
            })
          }else{
            res.send(result);
            //db.close();
          }
        }else{
          collection.update(param,{$addToSet:{applicant:data}},function(err, result) {
            if(err)
            {
              console.log('Error:'+ err);
              return;
            }
            res.send(result);
            //db.close();
          });
        }
      }
    })
  }else{
    collection.update(param,{$addToSet:{applicant:data}},function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
      res.send(result);
      //db.close();
    });
  }
}


exports.update_circle_members = function(db,data,param,res)
{
  var collection = db.collection('circles');
  collection.update(param,{$addToSet:data},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  });
}

exports.check_add_user = function(db,data,param,res)
{
  var collection = db.collection('users');

  if(param&&param.phone){
    collection.find(param).toArray(function (err,result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else{
        if(result[0]){
          res.send(result[0]);
          //db.close();
        }else{
          data.userId = data.userId||new Date().getTime().toString();
          //data.token = IM.fetchToken(data.userId,data.nickname);
          data.participate = {};
          data.basicinfo = {nickname:""};
          data.projectExperience = [];
          data.workExperience = [];
          data.educationalBackground=[];
          data.sysNotice = [];
          data.messages = [];
          data.messageBadge = 0;
          data.headUrl = "./img/default/default_headUrl.png";
          data.config = {位置隐身可见: false, 基本信息可见: false, 个人简历可见: false};
          collection.insert(data, function (err, result) {
            if (err) {
              console.log('Error:' + err);
              return;
            }
            console.log(result.ops[0])
            res.send(result.ops[0]);
            //db.close();
          });
        }

      }

    })

  }

}

exports.unset_circle_manager = function(db,data,param,res)
{
  var collection = db.collection('circles');
  collection.updateOne(param,{$pull:data},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  });

}


exports.delete_circle = function(db,data,param,res){
  var collection = db.collection('circles');
  collection.remove(param,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result[0]);
    //db.close();
  });
}

exports.leave_circle = function(db,data,param,res){
  var collection = db.collection('circles');
  var userId = param.userId;
  var circleId = param.circleId;

  collection.find({circleId:circleId}).toArray(function(err,result){
    try{
      if(result[0]){
        result.members.leave = result.members.leave||[];
      }
    }catch (err){
      console.log(err)
    }
    collection.updateOne({circleId:circleId},{$pull:{'members.common':userId},$addToSet: {'members.leave':userId}},function(err,result){
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }else{
        collection = db.collection('users');
        collection.updateOne({userId:userId},{$pull: {'participate.circle':circleId}},function(err,result){

          res.send(result[0]);
          //db.close();
        });
      }

    })

  })
}

exports.get_participate_circle = function(db,data,param,res)
{
  var collection = db.collection('users');
  console.log(param.userId)
  collection.find({userId:param.userId},{'participate.circle':1}).toArray(function(err, results) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      console.log('participate',results)
      if(results[0]){
        var result1 = results[0].participate.circle||[];
        collection = db.collection('circles');
        collection.find({"circleId":{"$in":result1},"title":param.title}).toArray(function(err,result){
          res.send(result);
          //db.close();
        })
      }else{
        res.send(results);
        //db.close();
      }
    }
  });
}

exports.get_circle = function(db,data,param,res)
{
  var collection = db.collection('circles');
  var type = data.type;
  var par = JSON.parse(JSON.stringify(param));
  delete par.userId;
  console.log(par)
  switch(type){
    case "myCircle":
      getCircle(param);
      break;
    case "hotCircle":
      getCircle(par);
      break;
      defalt:
          res.send("Invalid");
  }
  function getCircle(param){
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
}