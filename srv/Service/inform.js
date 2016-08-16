exports.new_inform = function(db,data,param,res) {

 var collection = db.collection('informs');
  collection.insert(data, function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }
    res.send(result);
    //db.close();
});

}

