/**
 * Created by lmin on 16/2/25.
 */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
window.href = function(path) {
    window.location.href = window.location.href.replace(/#.*/, '') + path;
    console.log(window.location.href)
}
window.formatDate = function(dateStr) {
    var date = new Date(dateStr);
    return date.toLocaleString();
}
window.processTheFile = function(file, callBack) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(evt) {
        callBack(evt.target.result);
    }
    reader.onerror = function(e) {
        alert('文件读取失败' + JSON.stringify(e));
    }
}



var app = angular.module('starter', [
    'ionic',
    //'textAngular',
    'ngCordova',
    'angucomplete',
    'starter.routes',
    'starter.Services',
    'starter.publicDirective',
    'starter.publicFilter',
    //
    'starter.enrollControllers',
    'starter.enrollServices',
    //

    'starter.loginControllers',
    'starter.loginServices',

    //发布的才聘模块
    'starter.publishToHireControllers',
    'starter.publishToHireServices',
    'starter.publishToHireDirective',
    //发布的活动模块
    'starter.publishActivityControllers',
    'starter.publishActivityServices',
    'starter.publishActivityDirective',
    //发布的信息模块 information
    'starter.publishInformationControllers',
    'starter.publishInformationServices',
    'starter.publishInformationDirective',
    //发布的调查模块 investigate
    'starter.publishInvestigateControllers',
    'starter.publishInvestigateServices',
    'starter.publishInvestigateDirective',
    //我的 user
    'starter.userControllers',
    'starter.userServices',
    //发现 discover
    "starter.discoverControllers",
    "starter.discoverServices",
    //圈子模块 circle
    "starter.circleControllers",
    "starter.circleServices",
    //聊天
    "monospaced.elastic",
    'starter.directives',

    "starter.chatControllers",
    "starter.chatServices"
]);


app.run(function($state, localStorageService, $http, $ionicPlatform, $rootScope, $ionicHistory, system, $ionicModal, $ionicNavBarDelegate, messageService) {




    $rootScope.TAB = {};

    $rootScope._n = /\n/ig;
    $rootScope.devicePlatform = "browser";

    var url = "";
    if (ionic.Platform.isAndroid()) {
        url = "/android_asset/www/";
        $rootScope.devicePlatform = "android";
    }
    if (ionic.Platform.isIOS()) {

        $rootScope.devicePlatform = "IOS";
    }


    $rootScope._n = /\n/ig;


    var url = "";
    if (ionic.Platform.isAndroid()) {
        url = "/android_asset/www/";
    }

    // if (localStorage.getItem("messageID") === null) {



    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);

        }

        /*    document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
              $rootScope.devicePlatform = device.platform;
              console.log(device.platform);
            }
        */
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            //StatusBar.styleDefault();
            StatusBar.styleLightContent();
        }




        if (localStorage.getItem("firstStart")) {

            $rootScope.starterShow = true;
        } else {
            //false to enable splash
            //$rootScope.starterShow = true;
            $rootScope.starterShow = false;
            $state.go('preview');

            //for web
        }






    });
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            $rootScope.prevNavText = $rootScope.navRightButtonText;
            system.bindNavTool(); //初始化头部工具
            $rootScope.showNavBar = true; //显示navbar

        })

})

/*
 * 默认服务
 * */
app.factory('system', function($interval, $window, localStorageService, DataHand, $ionicLoading, $q, $http, $rootScope, $ionicHistory) {
    window.userInfo = localStorageService.get('userInfo') || { userId: "", nickname: "", headUrl: "" };
    //window.userInfo ={userId: "", nickname: "", headUrl: ""};
    //for web



    window.userId = window.userInfo.userId;
    console.log('window.userinfo', window.userInfo)

    window.baseUrl = {
        /*url: "http://192.168.31.238:8081/"*/
        //url:"http://localhost:8081/"
        url: "http://www.caishangll.com:8081/"

    };
    //default images

    $rootScope.default_headUrl = "./img/default/head.png";
    $rootScope.default_logo = "./img/logoT.png";
    $rootScope.default_circleUrl = "./img/default/default_circle.jpg";
    window.company = { logo: "./img/logoT.png" };

    DataHand.Sdata("get", "get_user_basic", {}, { userId: localStorageService.get('userId') }).then(function(res) {
        if (res != "") {
            res = res.data;
            window.userInfo = {};
            window.userInfo.nickname = res.nickname;
            window.userInfo.phone = res.phone;
            window.userInfo.userId = res.userId;
            window.userInfo.headUrl = res.headUrl;
            window.userInfo.heardPhoto = res.headUrl;
            window.userInfo.currentCompany = res.currentCompany;
            window.token = res.token || "";
            window.userId = res.userId;
            $rootScope.sysNoticeBadge = (res.allSysNotice < 0) ? 0 : res.allSysNotice;
            $rootScope.messageBadge = res.messageBadge;
            $rootScope.sysBadge = $rootScope.messageBadge || 0 + $rootScope.sysNoticeBadge || 0;
            localStorageService.update('userInfo', window.userInfo);
            localStorageService.update('userId', window.userId);
            localStorageService.update('token', window.token);
        }
    })

    //for web
    //定时更新系统提示消息;
    if (localStorageService.get('userId')) {
        refreshSysNotify();
        window.sysTimer = $interval(refreshSysNotify, 5000);
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
            DataHand.Sdata("get", "refresh_sysNotice", {}, { userId: localStorageService.get('userId') }).then(function(res) {
                if (res != "") {
                    res = res.data;
                    $rootScope.messageBadge = (!res.messageBadge || res.messageBadge < 0) ? 0 : res.messageBadge;
                    $rootScope.sysNoticeBadge = (res.allSysNotice < 0) ? 0 : res.allSysNotice;
                    $rootScope.sysBadge = $rootScope.messageBadge || 0 + $rootScope.sysNoticeBadge || 0;
                }
            })
        }
    }


    var serve = {};
    serve.httpGet = function(url, config) {
        $ionicLoading.show();
        return $http.get(url, config).success(function() {
            //数据处理
            $ionicLoading.hide();
        }).error(function() {
            $ionicLoading.hide();
        });
    };
    serve.loadingHttp = function(httpParameter, loadingParameter) {
        loadingParameter = loadingParameter || {};
        httpParameter = httpParameter || {};
        $ionicLoading.show({
            content: loadingParameter.loadText || 'Loading',
            animation: loadingParameter.animateTpe || 'fade-in',
            showBackdrop: loadingParameter.showBackdrop,
            maxWidth: loadingParameter.maxWidth || 200,
            showDelay: loadingParameter.showDelay || 0
        });
        return $http(httpParameter).success(function() {
            $ionicLoading.hide()
        }).error(function() {
            $ionicLoading.hide()
        });
    }
    serve.bindNavTool = function(parameter, scope) {

        var rootScope = $rootScope;
        if (scope) {
            scope.$on('$ionicView.beforeEnter', bind);
            bind();
        } else {
            console.log('scope没有传递');
            bind();
        }

        function bind() {

            parameter = parameter || {};
            rootScope.navRightIonicClass = parameter.navRightIonicClass || '';
            rootScope.navRightButtonText = parameter.rightText || '';
            rootScope.toolClick = parameter.toolClick || function() {};
            rootScope.showNav = parameter.showNav;

        }
    }
    serve.correspondingKey = function(obg, obj_, reverse) { //键值转换 obj键值对应表 obj_需要转换的键值
        if (!reverse) {
            for (var key in obg) {
                obj_[obg[key]] = obj_[key];
                delete obj_[key];
            }
        } else {
            for (var key in obg) {
                obj_[key] = obj_[obg[key]];
                delete obj_[obg[key]];
            }
        }
    }
    serve.delObj = function(obj) {
        if (obj == window.userInfo) {
            console.log('当前对象是window.userInfo');
            return;
        };
        //删除对象但是不覆盖引用
        for (var key in obj) {
            if (obj[key] instanceof Array) {
                obj[key].length = 0;
            } else if (obj[key] instanceof Object) {
                if (obj[key] instanceof Date) {
                    obj[key] = undefined;
                    continue;
                }
                serve.delObj(obj[key]);
            } else {
                switch (typeof obj[key]) {
                    case "number":
                        obj[key] = 0;
                        break;
                    case "string":
                        obj[key] = "";
                        break;
                    case "boolean":
                        obj[key] = false;
                        break;
                    default:
                        obj[key] = undefined;
                }
            }
        }
    }
    serve.newObject = function(o) {
        return JSON.parse(JSON.stringify(o));
    }
    return serve;
});
/*
 * 默认控制器
 * */
app.controller('overstory', function($scope, system, $rootScope, $ionicPopup, $timeout, $state, localStorageService, userServices, $ionicTabsDelegate) {
    //Check wheather a valid user
    //tabs事件
    var prevTab = '';
    var index = 0;
    var link = '';


    Date.prototype.Format = function(fmt) { //author: meizz //原型扩展
        //"yyyy-MM-dd hh:mm:ss.S"
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    $rootScope.newDate = function(datestr) {
        return new Date(datestr);
    }
    $rootScope.checkUserAuthority = function() {
        var id = localStorageService.get('userId');

        if (id) {

            return true;
        } else {
            $state.go('login');
            return false;
        }
    }


})




.controller('AppCtrl', function($scope, $ionicHistory, localStorageService, $rootScope, $ionicPopup, $ionicModal, $ionicPopover, $state, $timeout) {

    $rootScope.enroll = function() {
        $state.go('enroll_register');
    }

    /*


     */
    $rootScope.pageMarking = "discover";

    $rootScope.startApp = function() {
        localStorageService.update("firstStart", 1);
        $rootScope.starterShow = true;
        $rootScope.go('tab.discover-index', 'discover');

    }
    $rootScope.backClick = function(clear) {


        if (clear) {
            $rootScope.pageMarking = $rootScope.pageMarkingOld;
            // alert($rootScope.pageMarking);

        }
        $ionicHistory.goBack();

    }

    $rootScope.setTab = function(tab) {

        if (!tab)
            $rootScope.pageMarking = $rootScope.pageMarkingOld;
        else
            $rootScope.pageMarking = tab;


    }


    $rootScope.go = function(url, tabName) {
        $rootScope.hideTabs = false;
        $rootScope.pageMarkingOld = tabName;
        $rootScope.pageMarking = tabName;

        if ((tabName == 'user' || tabName == 'chat') && !window.userInfo.userId) {
            $state.go('login');
        } else {
            $state.go(url);
        }
    }



    function iniModal(url, scope)

    {
        if (!scope)
            scope = $scope
        $ionicModal.fromTemplateUrl(url, {
            scope: scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();

        });


    }

    $scope.closeModal = function(clear) {
        $scope.modal.remove();
        if (clear)
            $rootScope.pageMarking = $rootScope.pageMarkingOld;
        // $rootScope.pageMarkingOld ="";
        //  alert($rootScope.pageMarking)
    };


    $scope.openModel = function(url, tab) {
        if (window.userInfo.userId) {
            if (tab) {
                $rootScope.pageMarkingOld = $rootScope.pageMarking;
                $rootScope.pageMarking = tab;
                
            }
            if (window.userInfo.phone) {
                var key = ['ephemeralData', 'activityEphemeralData', 'informationEphemeralData', 'investigateEphemeralData'];
                key.map(function(noe) {
                    try {
                        if ($rootScope[noe])
                            system.delObj($rootScope[noe]);
                    } catch (e) {

                    }
                })
                iniModal(url);
            } else {
                $ionicPopup.confirm({
                    title: '是否验证用户?', // String. 弹窗标题。
                    subTitle: '没有验证手机号码，不能使用发布功能!现在就去验证?', // String (可选)。弹窗的副标题。
                    cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                    okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                }).then(function(res) {
                    if (res) {
                        $state.go('mobile_verify');
                    } else {}
                })
            }

        } else {
            $ionicPopup.confirm({
                title: '是否登录或注册用户?', // String. 弹窗标题。
                subTitle: '没有登录系统，不能使用发布功能!现在就去注册或登录?', // String (可选)。弹窗的副标题。
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
            }).then(function(res) {
                if (res) {
                    $state.go('login');

                } else {


                }
            })
        }
    }

})


.controller('selectType', function($scope) {
        $scope.removeNoe = function(noe) {
            $scope.selectData.splice($scope.selectData.indexOf(noe), 1);
            $scope.elementShow[noe] = false;
            $scope.surplus--;
        }
        $scope.addNoe = function(noe) {
                if ($scope.surplus >= $scope.maxSurplus && $scope.selectData.indexOf(noe) == -1) return;
                $scope.elementShow[noe] = !$scope.elementShow[noe];
                if ($scope.maxSurplus == 1 && $scope.selectData.length) {
                    $scope.removeNoe($scope.selectData[0]);
                }
                if ($scope.elementShow[noe]) {
                    $scope.selectData.push(noe);
                } else {
                    $scope.removeNoe(noe);
                }
                $scope.surplus = $scope.selectData.length;
            }
            /**
             *
             * 初始化判断
             */
        $scope.surplus = 0;
        if (!$scope.title) console.log('父级未指定title');
        if (!$scope.selectTypeText) $scope.$parent.selectTypeText = '父级未指定selectTypeText';
        if (!$scope.elementShow) $scope.$parent.elementShow = {};
        if (!$scope.selectData) $scope.$parent.selectData = []
        else {
            $scope.selectData.map(function(noe) {
                $scope.elementShow[noe] = true;
                $scope.surplus = $scope.selectData.length;
            });
        }
        if (!$scope.typeDatas) console.log('父级没有typeDatas数据');
        if (!$scope.maxSurplus) $scope.$parent.maxSurplus = 1;
        //end
    })
    .controller('selectArea', function($scope) {
        if (!$scope.config) {
            console.log('$scope.config不存在');
            return;
        }
        var promise = $scope.config.getData(); //$scope.citys
        promise.then(function(result) { //处理结果数据
            $scope.citys = result.data;
            if ($scope.selectData) {
                var selectData = $scope.selectData;
                $scope.$parent.selectData = [];
                $scope.selectData.indexOf = function(noe) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i].county == noe || this[i].city == noe) {
                            return i;
                        }
                    }
                    return -1;
                }
                selectData.map(function(noe, index) {
                    if (noe instanceof Object) {
                        return false;
                    }
                    if (noe)
                        var arr = noe.split('-');
                    else
                        var arr = "";
                    var city = arr[0];
                    var county = arr[1];
                    $scope.countyShow[city + county] = true;
                    $scope.selectData.push({
                        county: county,
                        city: city
                    });
                })
                $scope.surplus = $scope.selectData.length;
            }
        }, function(data) {
            console.log('请求失败！' + data);
        });
        //$scope.selectData = [];
        if (!$scope.maxSurplus) $scope.$parent.maxSurplus = 3;
        $scope.surplus = 0;
        $scope.countyShow = {};
        $scope.selectData.indexOf = function(noe) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].county == noe || this[i].city == noe) {
                    return i;
                }
            }
            return -1;
        }
        $scope.removeNoe = function(city, county) {
            var i = $scope.selectData.indexOf(county);
            $scope.selectData.splice(i, 1);
            $scope.countyShow[city + county] = false;
            $scope.surplus = $scope.selectData.length;
        }
        $scope.cityClick = function(index, key) {
            $scope.cityIndex = index;
            $scope.nowKey = key;
            $scope.countys = $scope.citys[$scope.nowKey];
        };
        $scope.countyClick = function(index, county) {
            if ($scope.maxSurplus == 1 && $scope.selectData.length) {
                $scope.removeNoe($scope.selectData[0].city, $scope.selectData[0].county);
            }
            //这里的显示隐藏做法略为复杂 下次直接用jQuery做
            $scope.countyIndex = index;
            if ($scope.surplus >= $scope.maxSurplus && $scope.selectData.indexOf(county) == -1) return;
            $scope.countyShow[$scope.nowKey + county] = !$scope.countyShow[$scope.nowKey + county];
            if ($scope.countyShow[$scope.nowKey + county]) {
                $scope.selectData.push({
                    county: county,
                    city: $scope.nowKey
                });
            } else {
                $scope.removeNoe($scope.nowKey, county);
            }
            $scope.surplus = $scope.selectData.length;
        }
    })
    .controller('categoryTab', function($scope) {
        $scope.nowIndex = 0;
        if (!$scope.heardTabs) {
            console.log('父级不存在heardTabs数据');
            return false;
        }
        if (!$scope.title) {
            console.log('父级不存在title属性!');
        }
        $scope.tabClick = function(tab, index) {
            if (index == $scope.nowIndex) return false;
            $scope.nowIndex = index;
            $scope.heardTabs.map(function(noe) {
                noe.hover = '';
            })
            tab.hover = 'hover';
            $scope.$parent.$parent.nowTab = tab;
            if ($scope.nowData) $scope.nowData.length = 0;
            if (tab.click) tab.click();
        }
        if ($scope.heardTabs.length) $scope.tabClick($scope.heardTabs[0]);
    })
    .controller('attachInfo', function($scope) {
        if (!$scope.lists) console.log('父级$scope.lists不存在!');
        $scope.noeType = {
            "icon": "ion-android-happy",
            "text": ""
        };
        $scope.removeFn = function(type) {
            if (type && type.remove) {
                type.removeDom = true;
            }
        };
        $scope.addFn = function() {
            $scope.lists.push({
                "icon": "ion-android-happy",
                "text": $scope.noeType.text,
                "remove": true,
                "checkBox": true
            });
            $scope.noeType.text = '';
            $scope.addItemShow = false;
        };
    })
    .controller('shareController', function($state, $stateParams, $location, $scope, WeChat, $ionicModal, $timeout) {
        //分享
        //alert($location.$$path)
        //alert($location.$$url)
        $scope.shareWeChatFriend = function() {
            WeChat.sharelink(
                0,
                '才商连联', '您的好友:' + window.userInfo.nickname + '分享的信息',
                'www/img/logoT.png', window.baseUrl.url + '#' + $location.$$url
            );
        }
        $scope.shareWeChatFriendCircle = function() {
            WeChat.sharelink(
                1,
                '才商连联', '您的好友:' + window.userInfo.nickname + '分享的信息',
                'www/img/logoT.png', window.baseUrl.url + '#' + $location.$$url
                //window.company.logo, window.baseUrl.url + '#/tab/discover/discover-signUp-detailed/' + $stateParams.id+'/discover'
            );
        }

        $scope.shareCoupleBack = function() {
            $state.go('user-coupleBack');
        }


        $scope.shareEnroll = function() {
            WeChat.sharelink(
                0,
                '后MBA|EMBA报名', '后MBA|EMBA报名',
                'www/img/slither/csllenroll_01.png', window.baseUrl.url + '#' + '/previewEnroll'
            );
        }


        $ionicModal.fromTemplateUrl('templates/public/shareLayer.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            var show = $scope.modal.show;
            var hide = $scope.modal.hide; //改写
            $scope.modal.hide = function() {
                $scope.modalHide = true;
                var that = this;
                $timeout(function() {
                    hide.apply(that);
                }, 400)
            }
            $scope.modal.show = function() {
                $scope.modalHide = false;
                show.apply(this);
            }
        });
    })
    .controller('informationDisplay', function($scope) {
        $scope.phone = function(p) {
            if (p) {
                return p.substr(0, 3) + '****' + p.substr(7, 10);
            }
        }
    })
    .directive('search', function() {
        return {
            restrict: "A",
            templateUrl: './templates/public/search.html',
            replace: true,
            controller: function($scope, $element, $attrs, $timeout) {
                $scope.initText = $element.attr('init-text');
                $scope.searchKeyDown = function() {
                    if ($scope.servicesSearch) {
                        $scope.servicesSearch($scope.searchText, $scope);
                        return;
                    }
                    $timeout(function() {
                        $scope.searchData.map(function(noe) {
                            if (!(noe instanceof Object)) {
                                return false;
                            }
                            if (!(new RegExp($scope.searchText, 'ig')).test(noe[$scope.searchMarking || 'searchText'])) {
                                noe.hide = true;
                            } else {
                                noe.hide = false;
                            }
                            if (!$scope.searchText) {
                                noe.hide = false;
                            }
                        });
                    }, 20);
                }
                if (!$scope.searchData) {
                    console.log('$scope.searchData不存在');
                    //$scope.searchData=[];
                }
            }
        }
    })

.directive('ngAnimationEnd', function() {
        return {
            replace: true,
            restrict: "A",
            link: function($scope, $element, $attrs) {
                $element[0].addEventListener("webkitAnimationEnd", function() { //动画重复运动时的事件
                    $attrs.ngAnimationEnd.split(';').map(function(noe) {
                        var key = noe.replace(/\(|\)+/ig, '');
                        if ($scope[key]) $scope[key]();
                    })
                }, false);
            }
        }
    })
    .directive('input', function() {
        return {
            restrict: "E",
            controller: function($scope, $element, $attrs, $rootScope, $timeout) {
                if (!($attrs.type == 'datetime-local' || $attrs.type == 'date')) return;
                $scope.$watch($attrs.ngModel, function(val) {
                    if (!val) {
                        return };
                    try {
                        var date = eval('$rootScope.' + $attrs.ngModel);
                    } catch (e) {
                        return false;
                    }
                    if ($attrs.type == 'datetime-local') {}
                    if (!(date instanceof Date)) {
                        switch ($attrs.type) {
                            case 'datetime-local':
                                eval('$rootScope.' + $attrs.ngModel + '=' + "new Date('" + val + "')");;
                                break;
                            case 'date':
                                eval('$rootScope.' + $attrs.ngModel + '=' + (new Date(val)).Format('yyyy-MM-dd'));
                                break;
                        }
                    }
                });
            }
        }
    })

.directive("ionHeaderBar", function() {
    return {
        restrict: "E",
        link: function($scope, $element, $attrs) {
            if (!$element.hasClass('bar-positive')) {
                $element.addClass('bar-positive');
            }
        }
    }
})


.directive('imgAuto', function() {
    return {
        restrict: "A",
        link: function($scope, $element, $attrs) {
            $element.on('load', function() {
                var parent = angular.element(this).parent()[0];
                var image = angular.element(this);
                var that = this;
                image.css({ opacity: 0 })
                if (that.width / that.height > parent.clientWidth / parent.clientHeight) {
                    image.css({
                        width: 'auto',
                        height: '100%',
                        display: 'block',
                    })
                    setTimeout(function() {
                        image.css({ marginLeft: -(that.width - parent.clientWidth) / 2 + 'px', opacity: 1 });
                    }, 100)
                } else {
                    image.css({
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    })
                    setTimeout(function() {
                        image.css({ marginTop: -(that.height - parent.clientHeight) / 2 + 'px', opacity: 1 })
                    }, 100)
                }
            })
        }
    }
})



.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {

                scope.$watch(attributes.hideTabs, function(value) {
                    $rootScope.hideTabs = value;

                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
                $rootScope.showNavBar = false;

            });
        }
    };
});
