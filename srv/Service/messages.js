/**
 * Created by yeshuijuan on 4/26/16.
 */

var user = require('./users');
var async = require('async');

exports.new_message = function (db, data, param, res) {

    var collection = db.collection('messages'),
        id = new Date().getTime().toString();
    data.id = id;
    data.message = [];
    collection.insert(data, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        res.send(result);
        //db.close();
    });
}


exports.update_message_delete = function (db, data, param, res) {

    var collection = db.collection('users');

    collection.findOneAndUpdate({userId:param.userId,'messages.id':param['messages.id']}, {$set: data}, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        console.log(result)
        if(result.value){
           var noReadMessages = isNaN(param.noReadMessages)?0:param.noReadMessages;
            var messageBadge = isNaN(result.value.messageBadge)?0:result.value.messageBadge;
            messageBadge = messageBadge -noReadMessages;
            messageBadge = (messageBadge<0)?0:messageBadge;
            collection.updateOne({userId:param.userId},{$set:{messageBadge:messageBadge}},function(err,result){
                if (err) {
                    console.log('Error:' + err);
                    return;
                }
                res.send(result);
                //db.close();
            })
        }else{
            res.send(result);
            //db.close();
        }

    });
}


exports.refresh_message = function (db, data, param, res) {
    var collection = db.collection('messages');
    var par = {id: param.id}
    collection.find(par, {message: {$slice: param.num}}).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        } else {
            collection = db.collection('users');
            var rResult = result[0];
            collection.find(data, {'messages.$.noReadMessages': 1,messageBadge:1}).toArray(function (err, result) {
                if (err) {
                    console.log('Error:' + err);
                    return;
                } else {
                    if (result[0]) {
                        console.log(result[0].messageBadge,result[0].messages[0])
                        if(result[0].messageBadge<0||!result[0].messageBadge){
                            result[0].messageBadge = result[0].messages[0].noReadMessages||0;
                        }
                        if (result[0].messageBadge > 0 && result[0].messages[0]) {
                            if(result[0].messages[0].noReadMessages>0){
                            var messageBadge = (result[0].messageBadge||0) - (result[0].messages[0].noReadMessages||0);
                            collection.update(data, {
                                '$set': {
                                    'messages.$.noReadMessages': 0,
                                    'messageBadge': messageBadge
                                }
                            }, function (err, result) {
                                if (err) {
                                    console.log('Error:' + err);
                                    return;
                                }
                                console.log(result, rResult)
                                res.send(rResult);
                                //db.close();
                            })}else{
                                rResult.statusUM="UM";
                                res.send(rResult)
                                //db.close();
                            }
                        } else {
                            rResult.statusUM="UM";
                            res.send(rResult)
                            //db.close();
                        }
                    } else {
                        res.send(rResult)
                        //db.close();
                    }
                }
            })
        }
    });
}


exports.get_all_pMessage = function (db, data, param, res) {

    var collection = db.collection('users');
    param.userId = param.userId||"__not__avaiable";
    collection.find(param).sort({'messages.lastMessage.id': -1}).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        } else {
            var rRes = result[0] || {};
            var messages = rRes.messages || [];
            var array = [];
            messages.map(function (item) {
                if (item.status != '-1') {
                    array.push(item)
                }
            })
            res.send({messages: array});
            //db.close();
        }

    });
}

exports.update_user_message = function (db, data, param, res) {

    var collection = db.collection('messages');
    var par = {id: param.id};
    collection.update(par, {$push: {'message': data}}, function (err, result) {
        if (err) {
            console.log('err:', err);
            return;
        } else {
            collection = db.collection('users');
            collection.find({
                userId: param.userId,
                'messages.id': param.id
            }, {'messages.members.$': 1}).toArray(function (err, result) {
                if (err) {
                    console.log('err:', err);
                    return;
                } else {
                    var members = [];
                    if (result[0]) {
                        members = result[0].messages[0].members || [];
                    }
                    var len = members.length;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            if (members[i] == param.userId) {
                                collection.update({
                                    userId: param.userId,
                                    'messages.id': param.id
                                }, {
                                    $set: {
                                        'messages.$.lastMessage': data,
                                        'messages.$.status': 0
                                    }
                                }, function (err, result) {
                                    if (err) {
                                        console.log('err:', err);
                                        return;
                                    }
                                    //res.send(result);
                                })
                            } else {
                                var par1 = {userId: members[i], 'messages.id': param.id}
                                collection.find(par1, {'messages.$': 1,messageBadge:1}).toArray(function (err, result) {
                                    if (err) {
                                        console.log('err:', err);
                                        return;
                                    } else {
                                        if (result[0]) {
                                            console.log(11,result[0])
                                            var messageBadge = (result[0].messageBadge||0) + 1;

                                            var noReadMessage = result[0].messages[0].noReadMessages + 1;
                                            collection.update(par1, {
                                                $set: {
                                                    'messageBadge': messageBadge,
                                                    'messages.$.lastMessage': data,
                                                    'messages.$.status': 0,
                                                    'messages.$.noReadMessages': noReadMessage

                                                }
                                            }, function (err, result) {
                                                if (err) {
                                                    console.log('err:', err);
                                                    return;
                                                }


                                            })
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            })
            res.send(result)
        }
    })
}


exports.get_toPerson_message = function (db, data, param, res) {

    var collection = db.collection('users');
    var par = {
        userId: param.userId,
        'messages.userId': data.userId
    }
    collection.find(par, {'messages.$': 1}).toArray(function (err, result) {
        if (err) {
            console.log('err:', err);
            return;
        } else {
            if (result[0]) {
                try{
                var messageId = (result[0].messages[0] || {})['id'];
                collection = db.collection('messages');
                if (messageId) {
                    collection.find({id: messageId}).toArray(function (err, result) {
                        if (err) {
                            console.log('err:', err);
                            return;
                        } else {
                            console.log('meres:', result[0])
                            res.send(result[0])
                            //db.close();
                        }
                    })
                }
                }catch (err){
                    console.log(err)
                    res.send({err:err});

                }
            } else {
                var iid = new Date().getTime().toString();
                collection = db.collection('messages');
                var mess0 = {
                    "id": iid,
                    "members": [param.userId, data.userId],
                    "isFromMe": 0,
                    "userId": data.userId,
                    "type": "toPerson",
                    "name": data.nickname,
                    "pic": data.headUrl,
                    "lastMessage": {},
                    "noReadMessages": 0,
                    "showHints": true,
                    "isTop": 0,
                    "messageBadge": 0
                }
                var mess1 = {
                    "id": iid,
                    "members": [param.userId, data.userId],
                    "isFromMe": 1,
                    "userId": param.userId,
                    "type": "toPerson",
                    "name": param.nickname,
                    "pic": param.headUrl,
                    "lastMessage": {},
                    "noReadMessages": 0,
                    "showHints": true,
                    "isTop": 0,
                    "messageBadge": 0
                }
                var insertM = {
                    id: iid,
                    members: [mess0, mess1],
                    message: []
                };
                insertM[param.userId] = 0;
                insertM[data.userId] = 1;
                collection.insert(insertM, function (err, result) {
                    if (err) {
                        console.log('err:', err);
                        return;
                    } else {

                        collection = db.collection('users');
                        collection.update({userId: param.userId}, {$push: {messages: mess0}}, function (err, result) {
                            if (err) {
                                console.log('err:', err);
                                return;
                            } else {
                                collection.update({userId: data.userId}, {$push: {messages: mess1}}, function (err, result) {
                                    if (err) {
                                        console.log('err:', err);
                                        return;
                                    }
                                    res.send({id: iid, message: []});
                                    //db.close();
                                })
                            }
                        });
                    }

                })
            }
        }
    })
}



exports.get_message_registAdditModel = function (db, data, param, res) {
    var collection = db.collection('messages');
    collection.find(param, {registrationAdditional: 1}).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        } else if (result) {
            var bt = result[0] ? result[0].registrationAdditional : [];
            var len = bt.length;
            var rResult = [];
            for (var i = 0; i < len; i++) {
                if (bt[i].checkBox == true) {
                    rResult.push(bt[i])
                }
            }
        } else rResult = [];
        res.send(rResult);
        //db.close();
    });

}



exports.get_u_message = function (db, data, param, res) {
    var collection = db.collection('messages');
    collection.find(param).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        res.send(result);
        //db.close();
    });

}

