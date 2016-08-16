/**
 * Created by lmin on 16/3/22.
 */
angular.module('starter.chatControllers', [])



    .controller('chat', function($scope,  $timeout,$state, $rootScope ,$ionicPopup,$ionicPopover,localStorageService, messageService)
    {


        $ionicPopover.fromTemplateUrl('button-options.html',
            {
                scope: $scope
            }).then(function (popover) {
            $scope.popover = popover;
        });

        $rootScope.openPopover = function ($event) {

            $scope.popover.show($event);
        };
        // $scope.messages = messageService.getAllMessages();
        // console.log($scope.messages);
    

        $scope.friends = function()
        {
            $state.go('tab.user-addressList');
            //$scope.popover.hide();

        }



        $scope.markMessage = function() {
            var index = $scope.popup.index;
            var message = $scope.messages[index];
            if (message.showHints) {
                message.showHints = false;
                message.noReadMessages = 0;
            } else {
                message.showHints = true;
                message.noReadMessages = 1;
            }
            $scope.popup.optionsPopup.close();
            $scope.popup.isPopup = false;
            messageService.updateMessage(message);
        };
        $scope.deleteMessage = function(message,index) {
            // alert(message.id);
            //console.log(message,index)
            var index = $scope.messages.indexOf(message);
            alert(index)
            $scope.messages.splice(index, 1);
            messageService.deleteMessageId(message.id,message.noReadMessages).then(function(res){

            })

        };
        $scope.topMessage = function() {
            var index = $scope.popup.index;
            var message = $scope.messages[index];
            if (message.isTop) {
                message.isTop = 0;
            } else {
                message.isTop = new Date().getTime();
            }
            $scope.popup.optionsPopup.close();
            $scope.popup.isPopup = false;
            messageService.updateMessage(message);
        };

        $scope.messageDetils = function(message) {
  $rootScope.messageBadge =$rootScope.messageBadge||0-message.noReadMessages||0;
                if($rootScope.messageBadge<0){
                    $rootScope.messageBadge = message.noReadMessages||0;

                }

   $timeout(function() {
                    $state.go("tab.message_detail", {
                "messageId": message.id,
                "noReadMessages":message.noReadMessages

            }); 
                  
                }, 200);


          
        };

        $scope.$on("$ionicView.beforeEnter", function(){
            /*if ($rootScope.checkUserAuthority()) {
                $state.go('tab.chat-index')
            }*/
            messageService.getAllMessages("toPerson").then(function(res){
                $scope.messages =res.data.messages;
            });


            $scope.popup = {
                isPopup: false,
                index: 0
            };
        });

    })

    .controller('chatUserOtherInfo', function ($rootScope,$state,$scope, $stateParams, messageService,userServices) {
        $scope.userInfo = {};

        userServices.getFellowInfo($stateParams.id).then(function (result) {
            $scope.userInfo = result.data||{};
        })

        $scope.newsSend = function () {
        if($scope.userInfo.userId==window.userId){
                   // 
                   alert("不能给自己发私信");
                return;
                }


            messageService.getToPersonMessage($scope.userInfo).then(function(result){
                $scope.messageDetails = result.data.message||[];
                if ($rootScope.checkUserAuthority()) {
                    $state.go('tab.message_detail',{messageId:result.data.id,isFromMe:result.data[window.userId]},true)
                }
            })
        }
    })

    .controller('chatNewCircle',function ($scope, system, $stateParams, $ionicPopup, $rootScope, messageService) {
        messageService.getAllSysNotice("circleInvitation").then(function(result){
            $scope.circleInvitation = result.data;
        })

        $scope.agreeCircleInvitation = function (index,data,$event) {

            messageService.agreeCircleInvitation(data,1).then(function (res) {
                if(res.status==200){
                    $scope.circleInvitation[index].status = 1;
                }
                $event.stopPropagation();
            })
        }
    })


.controller('sysNoticeCtrl', ['$rootScope','$scope','messageService','$q','$state',
    function($rootScope,$scope,messageService,$q,$state) {
        
        $scope.deleteSysNotice = function (message,index) {
            var index = $scope.sysNotice.indexOf(message);
            //alert(index);
            $scope.sysNotice.splice(index,1);
            var number;
            if(!message.status){
               number = 1;
            }
            messageService.deleteSysNotice(message.id,number).then(function(res){

            })
        }

        $scope.dealWithNotice = function (item,event,index) {
            if(!(item.status!=1&&item.status!=-1)){
                event.preventDefault();
            }else{
                if(!item.status){
                    messageService.updateASysNotice(item.id).then()
                    $scope.sysNotice[index].status = 2;
                    $rootScope.allSysNotice -= 1;
                    //$scope.$apply();
                }
                switch(item.type){
                    //circle
                    case "circleInvitation":
                        $state.go('tab.chat-newCircle');
                        break;
                    case "agreeCircleInvitation":
                        break;
                    case "applyCircle":
                        $state.go('tab.notice-circle-examineAndVerify',{id:item.circleId})
                        break;

                    //friend
                    case "userApplyFriend":
                        $state.go('tab.chat-newFriend');
                        break;
                    case "agreeFriendApply":
                        break;

                    //activity
                    case "applyActivity":
                        $state.go('tab.notice-user-examineAndVerify',{id:item.item.id,activityName:item.item.activityName})
                        break;

                    case "activityApplyVerify":
                        break;

                    //start sign in(activity)
                    case "startActivitySignIn":
                        $state.go('tab.chat-signUp-detailed',{id:item.activityId,source:'discover'})
                        break;

                    //hire
                    case "applyHire":
                        console.log(item)
                        $state.go('tab.notice-candidatesUserInfo',{id:item.from.userId})
                        break;
                }
            }


        }

        messageService.getAllSysNotice().then(function(res){
            $scope.sysNotice =res.data;
            $scope.sysNotice.map(function(item){
                item.unread = (!item.status)?"messageUnread":"messageRead";
            })

        });
    }])


    .controller('MessageDetailCtrl', ['$rootScope','$interval','$scope', '$stateParams',
        'messageService', '$ionicScrollDelegate', '$timeout','pickPic','$q',
        function($rootScope,$interval,$scope, $stateParams, messageService, $ionicScrollDelegate, $timeout,pickPic,$q) {
            $scope.messageNum = -10;
            $scope.calculateTime = 0;
           var timer = $interval(refresh,2000);
            timer.then(success, error, notify);
            function success(){
        
            console.log("done");
            }
            function error(){
            console.log("error");
            }
            function notify(){
            console.log("每次都更新");
            }

            $scope.$on("$ionicView.leave", function() {
                //$scope.message = messageService.getMessageById($stateParams.messageId);
               if(timer){
                   $interval.cancel(timer);
               }

            });

            $scope.send_content={};
            $scope.send_content.text="";
            var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
            $scope.doRefresh = function(){
                $scope.messageNum -= 5;
                messageService.refreshMessage($scope.messageNum, $stateParams.messageId)
                .then(function(res){
                    $scope.messageHead =res.data;
                    $scope.messageHead.members.map(function(item){
                        if(!(item.userId==window.userId)){
                            $scope.message = item;
                        }
                    })
                    $scope.messageDetails = res.data.message||[];
                    $scope.$broadcast('scroll.refreshComplete');

                })
            }

            var pic={};

            $scope.addMulti =function()
            {
                pickPic.getPic(pic,uploadpic)

            }
            function uploadpic(data)
            {
                //alert(data.src);
                var pdata=[];
                pdata[0]=data;
                pickPic.upLoad(pdata,$scope.doSend)

            }


            $scope.doSend = function(data){
                var newm={};
                newm.id=new Date().getTime(),
                    newm.content= $scope.send_content,
                    newm.name= window.userInfo.nickname,
                    newm.face = window.userInfo.headUrl;
                    newm.isFromMe = $scope.message.isFromMe,
                    newm.pic= data.tsrc,
                    newm.time =new Date()//.format("yyyy-MM-dd hh:mm:ss")
                newm.praise=0;
                newm.replycount=0
                $scope.messageDetails.splice($scope.messageDetails.length,0,newm);
                messageService.pushToPersonMessage(newm,$scope.message.id);
                $scope.send_content="";

                  $timeout(function() {
                   
                   refresh();
                }, 200);
              
              //  $ionicScrollDelegate.$getByHandle('listScroll').scrollBottom();

            }
           function refresh (){
                    messageService.refreshMessage($scope.messageNum,$stateParams.messageId).then(function(res){
                        if(!$scope.calculateTime){
                            $scope.messageHead = res.data;
                            $scope.messageHead.members.map(function (item) {
                                if (!(item.userId == window.userId)) {
                                    $scope.message = item;
                                }
                            })
                            $scope.messageDetails = res.data.message || [];
                        }else {

                            if (!(res.data.statusUM == "UM")) {
                                console.log($scope.calculateTime)
                                $scope.messageHead = res.data;
                                $scope.messageHead.members.map(function (item) {
                                    if (!(item.userId == window.userId)) {
                                        $scope.message = item;
                                    }
                                })
                                $scope.messageDetails = res.data.message || [];
                            }
                        }
                        $scope.calculateTime++;
                    })

                }

            $scope.$on("$ionicView.beforeEnter", function() {

                $rootScope.messageBadge =$rootScope.messageBadge||0-$stateParams.noReadMessages||0;
                if($rootScope.messageBadge<0){
                    $rootScope.messageBadge = 0;
                }
                $scope.message={};
                //$rootScope.messageBadge+=1;
                refresh();
                //$scope.messageDetils = messageService.getAmountMessageById($scope.messageNum, $stateParams.messageId);
                $timeout(function() {
                    viewScroll.scrollBottom();
                }, 200);
            });

            window.addEventListener("native.keyboardshow", function(e){
                viewScroll.scrollBottom();
            });
        }
    ])