angular.module('starter.chatServices', [])
.factory('dateService', [function() {
        return {
            handleMessageDate: function(messages) {
                var i = 0,
                    length = 0,
                    messageDate = {},
                    nowDate = {},
                    weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                    diffWeekValue = 0;
                if (messages) {
                    nowDate = this.getNowDate();
                    length = messages.length;
                    for (i = 0; i < length; i++) {
                        messageDate = this.getMessageDate(messages[i]);
                        if(!messageDate){
                            return null;
                        }
                        if (nowDate.year - messageDate.year > 0) {
                            messages[i].lastMessage.time = messageDate.year + "";
                            continue;
                        }
                        if (nowDate.month - messageDate.month >= 0 ||
                            nowDate.day - messageDate.day > nowDate.week) {
                            messages[i].lastMessage.time = messageDate.month +
                                "月" + messageDate.day + "日";
                            continue;
                        }
                        if (nowDate.day - messageDate.day <= nowDate.week &&
                            nowDate.day - messageDate.day > 1) {
                            diffWeekValue = nowDate.week - (nowDate.day - messageDate.day);
                            messages[i].lastMessage.time = weekArray[diffWeekValue];
                            continue;
                        }
                        if (nowDate.day - messageDate.day === 1) {
                            messages[i].lastMessage.time = "昨天";
                            continue;
                        }
                        if (nowDate.day - messageDate.day === 0) {
                            messages[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                            continue;
                        }
                    }
                    // console.log(messages);
                    // return messages;
                } else {
                    console.log("messages is null");
                    return null;
                }

            },
            getNowDate: function() {
                var nowDate = {};
                var date = new Date();
                nowDate.year = date.getFullYear();
                nowDate.month = date.getMonth();
                nowDate.day = date.getDate();
                nowDate.week = date.getDay();
                nowDate.hour = date.getHours();
                nowDate.minute = date.getMinutes();
                nowDate.second = date.getSeconds();
                return nowDate;
            },
            getMessageDate: function(message) {
                var messageDate = {};
                var messageTime = "";
                //2015-10-12 15:34:55
                var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
                var result = new Array();
                if (message) {
                    messageTime = message.lastMessage.originalTime;
                    result = reg.exec(messageTime);
                    if (!result) {
                        console.log("result is null");
                        return null;
                    }
                    messageDate.year = parseInt(result[1]);
                    messageDate.month = parseInt(result[2]);
                    messageDate.day = parseInt(result[3]);
                    messageDate.hour = parseInt(result[4]);
                    messageDate.minute = parseInt(result[5]);
                    messageDate.second = parseInt(result[6]);
                    // console.log(messageDate);
                    return messageDate;
                } else {
                    console.log("message is null");
                    return null;
                }
            }
        };
    }])


.factory('messageService', ['$rootScope','DataHand','localStorageService', 'dateService',
        function($rootScope,DataHand,localStorageService, dateService) {
            var service = {};
            service.init = function(){
            }
            
            service.deleteSysNotice = function (id,number) {
                return DataHand.Sdata("get","delete_sysNotice",{userId:userId,number:-1},{id:id})
            }

            service.agreeCircleInvitation=function(apply,status){

                var applyUser = apply.from.userId;
                DataHand.Sdata("get","new_sysNotice"
                    ,{type:"agreeCircleInvitation",from:{userId:window.userId,nickname:window.userInfo.nickname},to:{userId:applyUser,nickname:""},time:new Date(),message:window.userInfo.nickname+" 加入了圈子!"}
                    ,{type:"agreeCircleInvitation",'from.userId':window.userId,'to.userId':applyUser}
                )
                DataHand.Sdata("get","update_a_sysNotice",{'status':status,type:"agreeCircleInvitation"},{'id':apply.id,userId:window.userId})
                return DataHand.Sdata("get","add_circle_members",{'members.common':window.userId},{circleId:apply.circleId});
            }

            service.updateASysNotice = function(id) {

                return DataHand.Sdata("get","update_a_sysNotice",{'status':2},{'id':id,userId:userId})

            }


            service.getAllMessages = function(type) {

                return DataHand.Sdata("get","get_all_pMessage",{},{'userId':window.userId||'undefinedUserFromTina'});

            }

            service.getAllpSysNotice = function(type) {
                return DataHand.Sdata("get","get_all_psysNotice", {'sysNotice.$':1},{'userId':window.userId||'undefinedUserFromTina','sysNotice.type':type});
            }

            service.getAllSysNotice = function(type) {
                return DataHand.Sdata("get","get_all_sysNotice",{},{'to.userId':window.userId||'undefinedUserFromTina',type:type});
            }

            service.deleteMessageId = function(id,number){
                var num = isNaN(parseInt(number))?0:parseInt(number);
                return DataHand.Sdata("get","update_message_delete",{'messages.$.status':'-1','messages.$.noReadMessages':0},{userId:window.userId,'messages.id':id,noReadMessages:number})
            },

            service.refreshMessage = function (num,id) {


                return DataHand.Sdata("get","refresh_message",{userId:window.userId,'messages.id':id},{id:id,num:num})
            }


            service.getToPersonMessage = function (toUserInfo) {

                  return DataHand.Sdata("get","get_toPerson_message",toUserInfo,userInfo);
                

            }

            service.pushToPersonMessage=function(data,id){
                return DataHand.Sdata("get","update_user_message",data,{userId:window.userId,'id':id});
            }

            return service;

        }
    ])


