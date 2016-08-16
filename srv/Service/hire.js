/**
 * Created by yeshuijuan on 16/3/3.
 */
 var user  = require('./users');
exports.newhire = function(db,data,param,res) {
  var collection = db.collection('hires');
  var id = new Date().getTime().toString();
  //var id = new Date().getTime()+data.userId;
  data.id = id;
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


exports.get_hire = function(db,data,param,res)
{
  var collection = db.collection('hires');
  collection.find(param,data).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      if(result[0]){
        result[0].postPublisher = result[0].creator;
        res.send(result[0]);
        //db.close();
        
      }
    }
  });
}



exports.get_hire_item = function(db,data,param,res)
{
  var collection = db.collection('hires');
  collection.find(param,data).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      if(result[0]){
        result[0].postPublisher = result[0].creator;
      }
      res.send(result[0]);
      //db.close();
    }
  });
}


exports.get_hire_candidates = function(db,data,param,res)
{
  var collection = db.collection('hires');
  collection.find(param,{applicant:1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else{
      if(result[0]){
        console.log(result[0])
        result[0] = result[0].applicant;
      }
      console.log(result[0])
      res.send(result[0]);
      //db.close();
    }
  });
}

exports.apply_hire = function(db,data,param,res)
{
  var collection = db.collection('hires');
  data.time = new Date();
  collection.update(param,{$addToSet:{applicant:data}},function(err,result){
    if(err){
      console.log('err:'+err);
      return;
    }
    else{
      collection.find(param,{title:1,time:1,address:1,company:1,applyNumber:1}).toArray(function(err,result){
       if(err){
         console.log('err:'+err);
         return;
        }else{
        if(result){ 
          var results={};
          results = param;
          var count = {applyNumber:result[0]?result[0].applyNumber:0};
          collection.update(param,{$set:count},function(err,result){
              if(err){
                console.log('Error:'+ err);
                return;
              }else{
                try{
                user.update_user_partake(db,"hire",results,{userId:data.userId});
                 res.send(result);
                }catch(e){
                  console.log('error in hire.js');
                  res.send({error:'error'});
                  //db.close();
                }

              }
          })
        }
        else{
             res.send({error:'Not found!'})
             //db.close();
          }
        }
      })
    }
  })
}

exports.get_u_hire = function(db,data,param,res)
{
  var collection = db.collection('hires');
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


exports.get_hire_byParam = function(db,data,param,res)
{
  var collection = db.collection('hires');
  collection.find(param).sort({id:-1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
  });

}



