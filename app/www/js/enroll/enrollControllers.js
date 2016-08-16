
/* global angular, document, window */
/* global angular, document, window */
'use strict';
angular.module('starter.enrollControllers', [])

    .controller('enrollLoginCtrl', function($ionicHistory,DataHand,$interval,$rootScope,$q,$window,$scope,$state,userServices,localStorageService,WeChat){
        $scope.getPreviousTitle = function() {
            return $ionicHistory.backTitle();
        };

        $scope.goBack = function(){
            $ionicHistory.goBack();
        }

        $scope.user={
            phone:"",
            password:""
        };

        $scope.WeChatOk=false;
        function checkWeChat(installed)
        {
            $scope.WeChatOk=installed;



        }

        $scope.guestView = function()
        {

            $state.go('tab.discover-index');

        }


        $scope.$on('$ionicView.beforeEnter', function () {
            try{

                WeChat.check(checkWeChat);
            }catch (e)
            {


            }


        })

        $scope.Checkin = function()
        {//
            console.log("$scope.user",$scope.user.password,$scope.user.phone);
            //定时更新系统提示消息;
            function setSysTimer() {
                window.sysTimer = $interval(refreshSysNotify, 2000);
                sysTimer.then(success, error, notify);

                function success() {

                    console.log("done");
                }

                function error() {
                    console.log("error");
                }

                function notify() {
                    console.log("每次都更新");
                }

                function refreshSysNotify() {
                    DataHand.Sdata("get", "get_user_basic", {}, {userId: localStorageService.get('userId')}).then(function (res) {
                        if (res != "") {
                            res = res.data;
                            $rootScope.messageBadge = res.messageBadge;
                        }
                    })
                }
            }
            userServices.findUser({password:$scope.user.password,phone:($scope.user.phone||"").toString()}).then(function(res)
            {
                if(res!="")
                {
                    window.userInfo={};
                    window.userInfo.nickname = res.nickname;
                    window.userInfo.phone = res.phone;
                    window.userInfo.userId = res.userId;
                    window.userInfo.headUrl = res.headUrl;
                    window.userInfo.heardPhoto = res.headUrl;
                    window.userInfo.currentCompany = res.currentCompany;
                    window.userInfo.config = res.config;
                    window.userInfo.sysSetting = res.sysSetting;
                    window.token = res.token||"";
                    window.userId = res.userId;
                    $rootScope.messageBadge = res.messageBadge;
                    localStorageService.update('userInfo',window.userInfo);
                    localStorageService.update('userId',window.userId);
                    localStorageService.update('token',window.token);
                    $scope.user=window.userInfo;
                    console.log(res.userId);
                    $state.go('tab.user-index',{userId:res.userId});
                    if(res.nickname>' '){
                        $state.go('tab.user-index',{userId:res.userId});
                    }else{
                        //alert('Empty nickname!')
                    };
                    setSysTimer();
                }
                else{
                    alert('密码或手机号码错误','您输入的密码或手机号码有误，请检查。');

                };
            })
        }
        $scope.WeChatSSO= function()
        {
            //alert("sso")
            function callback(wxres)
            {

                if(wxres.openid)
                {
                    userServices.findUser({openId:wxres.openid}).then(function(res){
                        if(res)
                        {
                            console.log(wxres.openid)
                            window.userInfo={};
                            window.userInfo.nickname = res.nickname;
                            window.userInfo.userId = res.userId;
                            window.userInfo.headUrl = res.headUrl;
                            window.userInfo.heardPhoto = res.headUrl;
                            window.userInfo.config = res.config;
                            window.userInfo.sysSetting = res.sysSetting;
                            $rootScope.messageBadge = res.messageBadge;
                            window.token = res.token||"";
                            window.userId = res.userId;
                            localStorageService.update('userId',window.userId);
                            localStorageService.update('userInfo',window.userInfo);
                            localStorageService.update('token',window.token);
                            $scope.user=res;
                            console.log(res.nickname)
                            if(res.nickname>' '){
                                $state.go('tab.user-index',{userId:res.userId});
                            }else {
                                //alert('Empty nickname!')
                            };
                            setSysTimer();
                        }
                        else{
                            var d = new Date();
                            window.userInfo = {};
                            window.userInfo.userId = d.getTime().toString() ;
                            window.userInfo.openId=wxres.openid;
                            window.userInfo.nickname=wxres.nickname;
                            window.userInfo.headUrl=wxres.headimgurl;

                            if(wxres.sex==2){
                                window.userInfo.sex = '女';
                            }else if(wxres.sex==1){
                                window.userInfo.sex = '男';
                            }else{
                                window.userInfo.sex='';
                            }
                            window.userInfo.config = {手机号码可见: false, 基本信息可见: false, 扩展信息可见: false};
                            window.userInfo.sysSetting = {sysSetting:false};
                            window.userId = window.userInfo.userId;
                            userServices.addUser(window.userInfo).then(function(res){
                                if(res.result.ok>0)
                                {
                                    localStorageService.update('userId', window.userId);
                                    localStorageService.update('userInfo',window.userInfo);
                                    $state.go('tab.user-index');
                                }
                                else{
                                    ShowM.showAlert('创建用户失败','创建用户失败，请检查网路！');
                                }
                            });
                        }
                    })
                }
            }
            WeChat.auth(callback);
        }

    })

    .controller('erollfetchPasswordCtrl', function($ionicPopup,DataHand,$window,$scope,$sce, $timeout,$state, $stateParams,userServices,ShowM,localStorageService) {
        $scope.user = {};
        $scope.Tosubmit= function()
        {
            if($scope.user.password==$scope.obj.confirm)
            {
                var d = new Date();
                $scope.user.userId=d.getTime().toString();

                userServices.addUser($scope.user).then(function(res){
                    if(res.result.ok>0)
                    {
                        localStorageService.update('userId', $scope.user.userId);
                        localStorageService.update('userInfo', $scope.user);
                        window.userInfo = $scope.user;
                        window.userId = $scope.user.userId;
                        $state.go('tab.user-index');
                    }
                    else
                        ShowM.showAlert('创建用户失败','创建用户失败，请检查网路！');
                });

                //Datahand.Sdata('GET','find_user',$scope.user,{phone:$scope.user.phone}).then(function(res){console.log(res);});

            }
            else
                ShowM.showAlert('密码错误','您两次输入的密码不一致！');

        };

        $scope.Rsend= function(type,phone)
        {

            $scope.myURL ="";
            if(type==2 &&!$scope.obj.resend)
                return;

            if(!$scope.user.phone)
                $scope.user.phone=phone;
            $scope.obj.resend=false;
            $scope.Snumber="";
            for(var i=0;i<6;i++)
            {
                $scope.Snumber+=Math.floor(Math.random()*10);
            }


            // $scope.Snumber=888888;
            var src='http://106.ihuyi.cn/webservice/sms.php?method=Submit&account=cf_zhongwei&password=amec123456&mobile='+$scope.user.phone+
                '&content=您的验证码是：【'+$scope.Snumber+'】。请不要把验证码泄露给其他人。' ;
//alert(src);
            $scope.myURL = $sce.trustAsResourceUrl(src);

            $scope.wait=60;
            $scope.time=function () {
                if ($scope.wait== 0) {
                    $scope.obj.resend=true;
                    return;
                } else {

                    $scope.wait--;
                    $timeout(function() {
                            $scope.time()  ;
                        },
                        1000)
                }
            }
            $scope.time();
        }


        $scope.checkPhoneNumber= function()
        {
            console.log($scope.user.phone);
            userServices.findUser({phone:$scope.user.phone.toString()})
                .then(function(res)
                {
                    console.log(res);
                    if(res.length<1)
                    {

                        ShowM.showConfirm('账号不存在','该账号不存在,请前往注册').then(
                            function(res){
                                if(res){
                                    //alert($scope.user.phone);
                                    $state.go('register_new');
                                }
                            });
                    }
                    else
                        $state.go('resetPassword_verify',{verify:$scope.user.phone});
                });
        };

        $scope.DoVerify= function()
        {
            if($scope.Snumber==$scope.obj.Vnumber&&$scope.Snumber>'0')
            {
                $state.go('reset_password',{submit:$scope.user.phone});
            }
            else
            {
                ShowM.showAlert('验证码错误','您输入的短信验证码有误，请检查。');
            }
        };
        $scope.resetPassword = function () {
            DataHand.Sdata("get","update_user_info",{password:$scope.user.password},{phone:$stateParams.submit}).then(
                function(res){
                    if(res){
                        $ionicPopup.alert({
                            "title": "密码修改成功",
                            "okText": "确认"
                        })
                        $state.go('tab.user-index');
                    }else{
                        $ionicPopup.alert({
                            "title": "修改失败",
                            "okText": "确认"
                        })
                    }
                }


            )
        }

        if($stateParams.verify)
        { $scope.Snumber='';
            $scope.obj={Vnumber:'',confirm:'',resend:false};
            // $scope.resend = false ;
            $scope.Rsend(1,$stateParams.verify);

        }
        else if($stateParams.submit)
        {  $scope.obj={confirm:''};
            $scope.user.phone=$stateParams.submit;

        }

    })


    .controller('enrollAddCircleInput',function($state,$scope,circleServices,$ionicPopup,$rootScope,$stateParams){
        //报名信息
        $scope.registrationAdditional = [];
        $scope.userInfo = window.userInfo;
        circleServices.getCircleInput($stateParams.id).then(function (result) {
            $scope.registrationAdditional = result.data instanceof Array ? result.data : [];
            console.log($scope.registrationAdditional)
        }, function () {
        });
        $scope.initData = function (noe) {
            noe.text == '姓名' ? noe.value = userInfo.nickname : '';
            noe.text == '手机' ? noe.value = userInfo.phone : '';
        }
        $scope.submitSignUp = function () {
            var tmp = '';
            $scope.registrationAdditional.map(function (noe) {
                if (!noe.value) {
                    tmp += noe.text + "信息未填写<br>"
                }
            })
            if (tmp) {
                $ionicPopup.alert({
                    "title": "信息未填写",
                    template: tmp,
                    "okText": "确认"
                })
                return false;
            }
            //if (!$scope.checkbox)return;
            circleServices.submitCircleInput($stateParams.id, $scope.registrationAdditional).then(function () {
                $ionicPopup.alert({
                    "title": "提交成功",
                    "okText": "确认"
                })
                //$rootScope.backClick();
                $state.go('tab.circle-enterTheCircle',{name:'上海后MBA|EMBA报名群',id:'1461659549401_circle'},true);
            }, function () {
                $ionicPopup.alert({
                    "title": "提交失败",
                    "okText": "确认"
                })
            })
        }
    })



    .controller('EnrollCtrl', function($rootScope,$ionicPopup,$ionicHistory,$window,$scope,$sce, $timeout,$state, $stateParams,userServices,ShowM,localStorageService) {
        $scope.mobileVerify = $stateParams.mobileVerify;
        $rootScope.pageMarking = 'circle';
        $scope.user = {};
        $scope.getPreviousTitle = function() {
            return $ionicHistory.backTitle();
        };

        $scope.goBack = function(){
            $ionicHistory.goBack();
        }

        $scope.Tosubmit= function()
        {
            if($scope.user.password==$scope.obj.confirm)
            {
                var d = new Date();
                $scope.user.userId=d.getTime().toString();

                userServices.addUser($scope.user).then(function(res){
                    if(res.result.ok>0)
                    {
                        localStorageService.update('userId', $scope.user.userId);
                        localStorageService.update('userInfo', $scope.user);
                        window.userInfo = $scope.user;
                        window.userId = $scope.user.userId;
                        $state.go('enroll-addCircleInput',{id:'1461659549401_circle'},true);

                    }
                    else
                        ShowM.showAlert('创建用户失败','创建用户失败，请检查网路！');
                });

                //Datahand.Sdata('GET','find_user',$scope.user,{phone:$scope.user.phone}).then(function(res){console.log(res);});

            }
            else
                ShowM.showAlert('密码错误','您两次输入的密码不一致！');

        };

        $scope.Rsend= function(type,phone)
        {

            $scope.myURL ="";
            if(type==2 &&!$scope.obj.resend)
                return;

            if(!$scope.user.phone)
                $scope.user.phone=phone;
            $scope.obj.resend=false;
            $scope.Snumber="";
            for(var i=0;i<6;i++)
            {
                $scope.Snumber+=Math.floor(Math.random()*10);
            }


            // $scope.Snumber=888888;
            var src='http://106.ihuyi.cn/webservice/sms.php?method=Submit&account=cf_zhongwei&password=amec123456&mobile='+$scope.user.phone+
                '&content=您的验证码是：【'+$scope.Snumber+'】。请不要把验证码泄露给其他人。' ;
//alert(src);
            $scope.myURL = $sce.trustAsResourceUrl(src);

            $scope.wait=60;
            $scope.time=function () {
                if ($scope.wait== 0) {
                    $scope.obj.resend=true;
                    return;
                } else {

                    $scope.wait--;
                    $timeout(function() {
                            $scope.time()  ;
                        },
                        1000)
                }
            }
            $scope.time();
        }


        $scope.CheckbyPhoneNuber= function(flag)
        {
            $scope.mobileVerify = $stateParams.mobileVerify;

            userServices.findUser({phone:$scope.user.phone.toString()})
                .then(function(res)
                {
                    console.log(res);
                    if(res.length<1)
                    {


                        $state.go('enroll_verify',{verify:$scope.user.phone,mobileVerify:$scope.mobileVerify});
                    }
                    else{
                        window.userId = res.userId;
                        window.userInfo = {};
                        window.userInfo.phone = res.phone;
                        window.userInfo.nickname = res.nickname;
                        localStorageService.update('userId',window.userId);
                        ShowM.showConfirm('手机号已注册','您输入的手机号已经注册!')
                            .then(
                     function(res){
                     if(res){
                     //alert($scope.user.phone);

                         $state.go('enroll-addCircleInput',{id:'1461659549401_circle'},true);
                     }
                     });}
                });
        };

        $scope.DoVerify= function()
        {

            if($scope.Snumber==$scope.obj.Vnumber&&$scope.Snumber>'0')
            {
                //$state.go('register_submit',{submit:$scope.user.phone});
                if(!$stateParams.mobileVerify){
                    $state.go('enroll_submit',{submit:$scope.user.phone});
                }else{
                    userServices.updateUserInfo('phone',$scope.user.phone).then(function(res){
                        if(res.status==200){
                            $ionicPopup.show({
                                title: "绑定成功",
                                buttons: [
                                    {
                                        text: "确认",
                                        type: "button-positive"
                                    }
                                ]
                            }).then(function () {

                                $ionicHistory.goBack(-4);
                            });
                        }
                    })
                }

            }
            else
            {
//
                ShowM.showAlert('验证码错误','您输入的短信验证码有误，请检查。');
            }
        };

        if($stateParams.verify)
        { $scope.Snumber='';
            $scope.obj={Vnumber:'',confirm:'',resend:false};
            // $scope.resend = false ;
            $scope.Rsend(1,$stateParams.verify);
        }
        else if($stateParams.submit)
        {  $scope.obj={confirm:''};
            $scope.user.phone=$stateParams.submit;

        }

    })
