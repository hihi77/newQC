exports.addgroup = function(db,data,param,res) {

console.log(param);
 var collection = db.collection('groups');

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


exports.findgroup = function(db,data,param,res) {
   var collection = db.collection('groups');


 collection.find(param).toArray(function(err, result) {
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


 exports.updategroup = function(db,data,param,res) {

 var collection = db.collection('groups');

 console.log(param);
 console.log(data);
 var setdata={$set:data};
  console.log(setdata);
  collection.update(param,setdata,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
//res.send('newuser');
 });
}

exports.savegroup = function(db,data,param,res) {

console.log(param);
 //
 console.log(data);
 var collection = db.collection('groups');


  collection.save(data ,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
//res.send('newuser');
  });
}

exports.removegroup = function(db,data,param,res) {
   var collection = db.collection('groups');

   console.log(param);
 //
 if(param=={})
 {
 console.log('Error:revome all');
      return;

 }
  collection.remove(param,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
});
}

exports.pushgroup = function(db,data,param,res)
{
  var collection = db.collection('groups');
 // param=JSON.parse(param);
 // data=JSON.parse(data);
  collection.update(param,{$push:data},'',function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else console.log('success')
    res.send();
    //db.close();
  });

}

//db.groups.update({"id":1453273976333},{$push:{"members":{"name":"egger","content":"thks!"}}})
