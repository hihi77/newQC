/**
 * Created by yeshuijuan on 5/5/16.
 * This module deal with system notice,
 * DB collection: systemNoticification,
 * structure:{
 * id:'',
 * status:''   //1:agree,-1:reject,2:alreadyRead,3:history notice that is replaced by a same new notice
 *
 * }
 *
 */
var user = require('./users');
var async = require('async');

exports.new_sysNotice= function(db,data,param,res) {
    var collection = db.collection('systemNoticification');
    var userId = param['to.userId'];
    param.status = 0;
    data.status = 0;
    data.id = new Date().getTime().toString();
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
                collection.insertOne(data, function (err, result) {
                    if (err) {
                        console.log('Error:' + err);
                        return;
                    } else {
                        collection = db.collection('users');
                        collection.updateOne({"userId":userId},{$inc:{allSysNotice:num}}, function (err,result) {
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
                })
            }
        })
    })


}

exports.delete_sysNotice= function(db,data,param,res) {
    var collection = db.collection('systemNoticification');
    collection.removeOne(param,function(err,result){
        if (err) {
            console.log('Error:' + err);
            return;
        } else {
            collection = db.collection('users');
            collection.updateOne({userId:data.userId},{$inc:{allSysNotice:data.number}},function(err,result){
                if (err) {
                    console.log('Error:' + err);
                    return;
                }
                res.send(result);
                //db.close();
            })

        }
    })
}

exports.new_circle_sysNotice= function(db,data,param,res) {
    var collection;
    var circleId = param['circleId']||"undefinedCircleByTina";
    data.status = 0;
    if(circleId) {
        collection = db.collection('circles');
        collection.find({circleId: circleId}, {'members.authority': 1}).toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            } else {
                if (result[0].members.authority) {
                    var toUsers = result[0].members.authority || [];
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
                                        }else{
                                            callback(null,result);
                                        }
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
            }
        })
    }
}


exports.get_all_sysNotice= function(db,data,param,res) {
    var collection = db.collection('systemNoticification');
    var sparam = {$or:[param,{to:param['to.userId']}],status:{$ne:3}}
    console.log(sparam)
    collection.find(sparam,data).toArray(function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }else{

            var rResult = result||[];
            //纠正计数不准确,权宜之计
            var i=0;
            rResult.map(function (item) {
                if(item.status==0){
                    i++;
                }
            });
            collection = db.collection('users');
            collection.updateOne({userId:param['to.userId']},{$set:{allSysNotice:i}},function(){


            })
            res.send(rResult);
        }
    });
}

exports.get_all_psysNotice= function(db,data,param,res) {
    var collection = db.collection('users');
    //console.log(param)
    collection.find(param,data).toArray(function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        //console.log(result)
        if(result[0]){
            res.send(result[0].allSysNotice);

        }else{
            res.send(result);
        }
        //db.close();
    });

}


/*exports.update_sysNotice= function(db,data,param,res) {
    var collection = db.collection('systemNoticification');
    collection.updateOne({id:param.id},{$set:{status:data.status}}, function (err,result) {
        collection.updateOne({userId:param.userId},{$inc:{allSysNotice:-1}},function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }else{
                res.send(result);
                //db.close();
            }
        })
    })
}*/


exports.update_a_sysNotice= function(db,data,param,res) {
    var collection = db.collection('systemNoticification');
    var num = -1;
    collection.count({id:param.id,status:0}, function (err,number) {
        num = -number;

        collection.updateMany({id:param.id},{$set:{status:data.status}}, function (err,result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }else{
                collection = db.collection('users');
                collection.updateOne({userId:param.userId},{$inc:{allSysNotice:num}}, function () {
                    console.log(result)
                    res.send(result);
                    //db.close();
                })
            }
        })
    })


}